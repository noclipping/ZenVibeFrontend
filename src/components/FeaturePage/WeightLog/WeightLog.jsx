import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "../../FeaturePage/WeightLog/WeightLog.css";

// Register Chart.js and its plugins
Chart.register(...registerables, annotationPlugin);

function WeightLog({ showInputs }) {
  // State hooks for managing weight data and chart
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState("");
  const [originalWeight, setOriginalWeight] = useState("");
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
  // State hooks for managing weight data and chart
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  // Getting user ID from URL parameters
  const { id } = useParams();

  // Fetch user data and weight entries on component mount
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
        const weightResponse = await fetch(
          `http://localhost:3000/weight/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const weightEntries = await weightResponse.json();

        setOriginalWeight(userData.original_weight);
        setWeightGoal(userData.goal_weight);
        updateChartData(weightEntries, userData.original_weight);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Function to update the chart data
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

  // Effect hook to update chart whenever weight data changes
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

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: weightData,
      options: {
        scales: { y: { beginAtZero: false } },
        elements: { line: { tension: 0.4 }, point: { radius: 5 } },
        plugins: { annotation: { annotations } },
      },
    });
  }, [weightData, weightGoal]);

  // Function to handle weight submission
  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    if (!isNaN(parseFloat(weight)) && id) {
      try {
        const today = new Date().toISOString().split("T")[0];
        const payload = {
          weight: parseFloat(weight),
          entry_date: today,
        };
        const response = await fetch(`http://localhost:3000/weight/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newEntry = await response.json();
        updateChartData(
          [...weightData.datasets[0].data, newEntry.weight],
          originalWeight
        );
        setWeight("");
      } catch (error) {
        console.error("Error submitting weight:", error.message);
      }
    }
  };

  // Function to handle weight goal submission
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!isNaN(parseFloat(weightGoal))) {
      setWeightGoal(e.target.previousElementSibling.value);
      localStorage.setItem("weightGoal", e.target.previousElementSibling.value);
    }
  };

  // Function to clear data from local storage and state
  const clearData = () => {
    localStorage.removeItem("weightGoal");
    setWeightGoal("");
    setWeightData({
      labels: ["Start"],
      datasets: [
        {
          label: "Weight (lb)",
          data: [originalWeight],
          borderColor: "#FFFFFF",
          pointBackgroundColor: "#FF0000",
          pointBorderColor: "#FF0000",
        },
      ],
    });
  };

  // JSX for rendering the component
  return (
    <div className="weight-log-container">
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
          <form onSubmit={handleGoalSubmit} className="weight-log-form">
            <input
              type="number"
              value={weightGoal}
              onChange={(e) => setWeightGoal(e.target.value)}
              placeholder="Set weight goal (lb)"
              required
            />
            <button type="submit">Set Goal</button>
          </form>
          <button onClick={clearData} className="clear-data-button">
            Clear Data
          </button>
        </>
      )}
    </div>
  );
}

// PropTypes for type checking props
WeightLog.propTypes = {
  showInputs: PropTypes.bool.isRequired,
};

export default WeightLog;
