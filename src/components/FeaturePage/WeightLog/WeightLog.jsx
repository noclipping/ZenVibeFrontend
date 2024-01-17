import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from 'chartjs-plugin-zoom';
import PropTypes from 'prop-types';
import "../../FeaturePage/WeightLog/WeightLog.css";

// Registering Chart.js and its plugins globally
Chart.register(...registerables, annotationPlugin, zoomPlugin);

// Function to calculate BMI using weight in pounds and height in feet and inches
function calculateBMI(weightInPounds, heightFeet, heightInches) {
  const weightInKg = weightInPounds / 2.20462; // Convert weight to kilograms
  const heightInMeters = (heightFeet * 0.3048) + (heightInches * 0.0254); // Convert height to meters
  return weightInKg / (heightInMeters ** 2); // BMI formula
}

function WeightLog({ showInputs }) {
  // State hooks for managing various data and BMI
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState("");
  const [heightFeet, setHeightFeet] = useState(0);
  const [heightInches, setHeightInches] = useState(0);
  const [BMI, setBMI] = useState(0);
  const [weightData, setWeightData] = useState({
    labels: ["Start"],
    datasets: [{
      label: "Weight (lb)",
      data: [],
      borderColor: "#FFFFFF",
      pointBackgroundColor: "#FF0000",
      pointBorderColor: "#FF0000",
    }],
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { id } = useParams(); // Getting user ID from URL parameters

  // Fetching user data and weight entries on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        console.error("No user ID available.");
        return;
      }

      try {
        // Fetching user data from API
        const userResponse = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const userData = await userResponse.json();

        // Fetching weight entries from API
        const weightResponse = await fetch(`http://localhost:3000/weight/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const weightEntries = await weightResponse.json();

        // Setting states with fetched data
        setWeightGoal(userData.goal_weight);
        setHeightFeet(userData.feet);
        setHeightInches(userData.inches);
        setBMI(calculateBMI(userData.original_weight, userData.feet, userData.inches));

        // Updating chart data with weight entries
        updateChartData(weightEntries, userData.original_weight);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Function to update chart data
  const updateChartData = (weightEntries, initialWeight) => {
    const chartLabels = weightEntries.map((entry, index) => `Day ${index + 1}`);
    const chartData = weightEntries.map(entry => entry.weight);
    setWeightData({
      labels: ["Start", ...chartLabels],
      datasets: [{
        label: "Weight (lb)",
        data: [initialWeight, ...chartData],
        borderColor: "#FFFFFF",
        pointBackgroundColor: "#FF0000",
        pointBorderColor: "#FF0000",
      }],
    });
  };

  // Updating chart when weight data changes
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const goalValue = parseFloat(weightGoal);

    // Configuring annotations for goal line
    const annotations = goalValue ? {
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
    } : {};

    const zoomOptions = {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      };

    // Initializing the chart with updated data
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

  // Handling weight submission
  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    const newEntryWeight = parseFloat(weight);
    if (!isNaN(newEntryWeight) && id) {
      try {
        // Sending POST request to API
        const response = await fetch(`http://localhost:3000/weight/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weight: newEntryWeight, entry_date: new Date().toISOString().split("T")[0] }),
          credentials: "include",
        });

        if (response.ok) {
          const newWeightEntry = await response.json();

          // Updating chart data with new entry
          const updatedData = [...weightData.datasets[0].data, newWeightEntry.weight];
          const updatedLabels = [...weightData.labels, `Day ${weightData.labels.length}`];

          setWeightData({
            ...weightData,
            labels: updatedLabels,
            datasets: [{
              ...weightData.datasets[0],
              data: updatedData,
            }],
          });

          // Updating BMI with new weight entry
          setBMI(calculateBMI(newWeightEntry.weight, heightFeet, heightInches));
          setWeight("");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error submitting weight:", error);
      }33
    }
  };

  const handleDeleteLastEntry = async () => {
    // Ensure there is data to delete
    if (weightData.datasets[0].data.length > 1) {
        try {
            // Fetch the ID of the latest weight entry
            const latestEntryResponse = await fetch(`http://localhost:3000/weight/latest/${id}`, {
                method: "GET",
                credentials: "include",
            });
            if (!latestEntryResponse.ok) throw new Error('Failed to fetch latest entry');

            const latestEntry = await latestEntryResponse.json();
            const latestEntryId = latestEntry.entry_id; // Assuming the response contains the entry_id

            // Send DELETE request
            const deleteResponse = await fetch(`http://localhost:3000/weight/${latestEntryId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!deleteResponse.ok) throw new Error('Failed to delete entry');

            // Update the chart data by removing the last entry
            const updatedData = weightData.datasets[0].data.slice(0, -1);
            const updatedLabels = weightData.labels.slice(0, -1);
            setWeightData({
                ...weightData,
                labels: updatedLabels,
                datasets: [{ ...weightData.datasets[0], data: updatedData }],
            });
        } catch (error) {
            console.error("Error deleting weight entry:", error);
        }
    }
};

  

  //created function for BMI categories for user notification 
  function getBMICategory(bmi) {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
      return "Overweight";
    } else {
      return "Obesity";
    }
  }

  

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
          <div className="bmi-display">
            <p>Current BMI: {BMI.toFixed(2)} ({getBMICategory(BMI)})</p>
            {BMI > 24.9 && <p>Your BMI indicates that you might be overweight. Consider consulting a healthcare professional for advice.</p>}
            {BMI < 18.5 && <p>Your BMI indicates that you might be underweight. Consider consulting a healthcare professional for advice.</p>}
          </div>
          <button onClick={handleDeleteLastEntry}>Delete Last Entry</button>
        </>
        
      )}
    </div>
  );
}
WeightLog.propTypes = {
  showInputs: PropTypes.bool, // If it's a boolean
};


export default WeightLog;
