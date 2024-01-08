import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; // Use this if you're passing the user ID via URL parameters
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "../../FeaturePage/WeightLog/WeightLog.css"; // Adjust the path as needed

Chart.register(...registerables, annotationPlugin);

function WeightLog() {
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

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { id } = useParams(); // Assuming you're passing the user ID as a URL parameter

  // Fetch user data and initial weight data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        console.error("No user ID available.");
        return;
      }

      try {
        // Fetch user profile
        const userResponse = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        setOriginalWeight(userData.original_weight);
        setWeightGoal(userData.goal_weight);

        // Fetch weight entries
        const weightResponse = await fetch(`http://localhost:3000/weight/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!weightResponse.ok) {
          throw new Error(`HTTP error! status: ${weightResponse.status}`);
        }
        const weightEntries = await weightResponse.json();
        const chartLabels = weightEntries.length ? weightEntries.map((entry, index) => `Day ${index + 1}`) : ["Start"];
        const chartData = weightEntries.length ? weightEntries.map(entry => entry.weight) : [userData.original_weight];

        setWeightData({
          labels: chartLabels,
          datasets: [{
            label: "Weight (lb)",
            data: chartData,
            borderColor: "#FFFFFF",
            pointBackgroundColor: "#FF0000",
            pointBorderColor: "#FF0000",
          }],
        });

      } catch (error) {
        console.error("Fetching data failed: " + error.message);
      }
    };

    fetchUserData();
  }, [id]);

  // Update the chart when weightData or weightGoal changes
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const goalValue = parseFloat(weightGoal); // Ensure it's a number
    const annotations = goalValue
      ? {
          line1: {
            type: "line",
            yMin: goalValue,
            yMax: goalValue,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "Weight Goal: " + goalValue + " lb",
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
        scales: {
          y: {
            beginAtZero: false,
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 5,
          },
        },
        plugins: {
          annotation: {
            annotations: annotations,
          },
        },
      },
    });
  }, [weightData, weightGoal]);

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    const newEntry = parseFloat(weight);
    if (!isNaN(newEntry) && id) {
      const dayCount = weightData.labels.length + 1;
      setWeightData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, `Day ${dayCount}`],
        datasets: [{
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, newEntry],
        }],
      }));
      setWeight("");

      // Send new weight entry to server
      try {
        const response = await fetch(`http://localhost:3000/weight/${id}`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weight: newEntry }),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Submitting new weight entry failed: " + error.message);
      }
    }
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const newGoal = e.target.previousElementSibling.value; // Get weight goal from input
    if (!isNaN(parseFloat(newGoal))) {
      setWeightGoal(newGoal);
      localStorage.setItem("weightGoal", newGoal); // Store the new goal in local storage
    }
  };

  const clearData = () => {
    localStorage.removeItem("weightGoal");
    setWeightGoal("");
    setWeightData({
      labels: ["Start"],
      datasets: [{
        label: "Weight (lb)",
        data: [originalWeight],
        borderColor: "#FFFFFF",
        pointBackgroundColor: "#FF0000",
        pointBorderColor: "#FF0000",
      }],
    });
  };

  return (
    <div className="weight-log-container">
      <div className="weight-log-chart">
        <canvas ref={chartRef} />
      </div>
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
    </div>
  );
}

export default WeightLog;
