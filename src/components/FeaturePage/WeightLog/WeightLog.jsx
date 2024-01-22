import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  calculateBMR,
  getActivityFactor,
} from "../../FeaturePage/Food/CalculateBMR"; // Ensure correct path
import zoomPlugin from "chartjs-plugin-zoom";
import PropTypes from "prop-types";
import "../../FeaturePage/WeightLog/WeightLog.css";

Chart.register(...registerables, annotationPlugin, zoomPlugin);

function calculateBMI(weightInPounds, heightFeet, heightInches) {
  const weightInKg = weightInPounds / 2.20462;
  const heightInMeters = heightFeet * 0.3048 + heightInches * 0.0254;
  return weightInKg / heightInMeters ** 2;
}

function WeightLog({ showInputs }) {
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState("");
  const [heightFeet, setHeightFeet] = useState(0);
  const [heightInches, setHeightInches] = useState(0);
  const [userAge, setUserAge] = useState(0);
  const [userGender, setUserGender] = useState("");
  const [BMI, setBMI] = useState(0);
  const [totalDailyCalories, setTotalDailyCalories] = useState(0);
  const [userData, setUserData] = useState({});
  const [weightData, setWeightData] = useState({
    labels: ["Start"],
    datasets: [
      {
        label: "Weight (lb)",
        data: [],
        borderColor: "#FFFFFF",
        pointBackgroundColor: "#FF0000",
        pointBorderColor: "#FF0000",
      },
    ],
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const storedTotalDailyCalories = localStorage.getItem("totalDailyCalories");
    if (storedTotalDailyCalories) {
      setTotalDailyCalories(parseFloat(storedTotalDailyCalories));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        console.error("No user ID available.");
        return;
      }

      try {
        const userResponse = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const userData = await userResponse.json();

        setUserData(userData);

        setWeightGoal(userData.goal_weight);
        setHeightFeet(userData.feet);
        setHeightInches(userData.inches);
        setUserAge(userData.age);
        setUserGender(userData.gender);
        setBMI(
          calculateBMI(userData.original_weight, userData.feet, userData.inches)
        );

        const initialBMR = calculateBMR(
          userData.gender,
          userData.original_weight,
          userData.feet * 12 + userData.inches,
          userData.age
        );
        const TDEE = Math.floor(initialBMR * getActivityFactor("sedentary"));
        setTotalDailyCalories(TDEE - 500); // Assuming a deficit of 500 calories

        const weightResponse = await fetch(
          `http://localhost:3000/weight/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const weightEntries = await weightResponse.json();
        updateChartData(weightEntries, userData.original_weight);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const calculateAndUpdateCalories = (userData, weight) => {
    const BMR = calculateBMR(
      userData.gender,
      weight,
      userData.feet * 12 + userData.inches,
      userData.age
    );
    const TDEE = Math.floor(BMR * getActivityFactor("sedentary"));
    const newTotalDailyCalories = TDEE - 500;
    setTotalDailyCalories(newTotalDailyCalories);
    localStorage.setItem("totalDailyCalories", newTotalDailyCalories);
  };

  const updateChartData = (weightEntries, initialWeight) => {
    const chartLabels = weightEntries.map((entry, index) => `Day ${index + 1}`);
    const chartData = weightEntries.map((entry) => entry.weight);
    setWeightData({
      labels: ["Start", ...chartLabels],
      datasets: [
        {
          label: "Weight (lb)",
          data: [initialWeight, ...chartData],
          borderColor: "#FFFFFF",
          pointBackgroundColor: "#FF0000",
          pointBorderColor: "#FF0000",
        },
      ],
    });
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const goalValue = parseFloat(weightGoal);

    const annotations = goalValue
      ? {
          line1: {
            type: "line",
            yMin: goalValue,
            yMax: goalValue,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: `Weight Goal: ${goalValue} lb`,
              enabled: true,
              position: "start",
            },
          },
        }
      : {};

    const zoomOptions = {
      pan: {
        enabled: true,
        mode: "xy",
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy",
      },
    };

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: weightData,
      options: {
        scales: { y: { beginAtZero: false } },
        elements: { line: { tension: 0.4 }, point: { radius: 5 } },
        plugins: { annotation: { annotations } },
        zoom: zoomOptions,
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }, [weightData, weightGoal]);

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    const newEntryWeight = parseFloat(weight);
    if (!isNaN(newEntryWeight) && id) {
      try {
        const response = await fetch(`http://localhost:3000/weight/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weight: newEntryWeight,
            entry_date: new Date().toISOString().split("T")[0],
          }),
          credentials: "include",
        });

        if (response.ok) {
          const newWeightEntry = await response.json();
          const updatedData = [
            ...weightData.datasets[0].data,
            newWeightEntry.weight,
          ];
          const updatedLabels = [
            ...weightData.labels,
            `Day ${weightData.labels.length}`,
          ];

          setWeightData({
            ...weightData,
            labels: updatedLabels,
            datasets: [{ ...weightData.datasets[0], data: updatedData }],
          });

          setBMI(calculateBMI(newWeightEntry.weight, heightFeet, heightInches));

          const updatedBMR = calculateBMR(
            userGender,
            newEntryWeight,
            heightFeet * 12 + heightInches,
            userAge
          );
          const TDEE = Math.floor(updatedBMR * getActivityFactor("sedentary"));
          setTotalDailyCalories(TDEE - 500); // Update total daily calories
        }
      } catch (error) {
        console.error("Error submitting weight:", error);
      }
    }
    calculateAndUpdateCalories(userData, newEntryWeight);
  };

  const handleDeleteLastEntry = async () => {
    if (weightData.datasets[0].data.length > 1) {
      try {
        const latestEntryResponse = await fetch(
          `http://localhost:3000/weight/latest/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!latestEntryResponse.ok)
          throw new Error("Failed to fetch latest entry");

        const latestEntry = await latestEntryResponse.json();
        const latestEntryId = latestEntry.entry_id;

        const deleteResponse = await fetch(
          `http://localhost:3000/weight/${latestEntryId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (!deleteResponse.ok) throw new Error("Failed to delete entry");

        const updatedData = weightData.datasets[0].data.slice(0, -1);
        const updatedLabels = weightData.labels.slice(0, -1);
        setWeightData({
          ...weightData,
          labels: updatedLabels,
          datasets: [{ ...weightData.datasets[0], data: updatedData }],
        });

        if (updatedData.length > 0) {
          const latestWeight = updatedData[updatedData.length - 1];
          calculateAndUpdateCalories(userData, latestWeight); // Recalculate calories after deletion
        }
      } catch (error) {
        console.error("Error deleting weight entry:", error);
      }
    }
  };
  return (
    <div className="weight-log-container">
      <h1>Each Day is a step closer towards your goals</h1>
  
      <div className="weight-log-chart">
        <canvas ref={chartRef} />
      </div>
  
      {showInputs && (
        <>
          <form onSubmit={handleWeightSubmit} className="weight-log-form">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight (lb)"
              required
            />
            <button type="submit">Log Weight</button>
          </form>
          <div className="bmi-display">
            <p>Daily Target Calorie intake: {totalDailyCalories} kcal</p>
            <p>Current BMI: {BMI.toFixed(2)}</p> {/* Display only the BMI value */}
          </div>
          <button
            onClick={handleDeleteLastEntry}
            className="delete-entry-button"
          >
            Delete Last Entry
          </button>
        </>
      )}
    </div>
  );
}

WeightLog.propTypes = {
  showInputs: PropTypes.bool,
};

export default WeightLog;
