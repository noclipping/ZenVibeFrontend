import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "../../FeaturePage/WeightLog/WeightLog.css"; // Adjust the path as needed

Chart.register(...registerables, annotationPlugin);

function WeightLog() {
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState(
    localStorage.getItem("weightGoal") || ""
  );
  const [weightData, setWeightData] = useState({
    labels: [],
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

  // Retrieve the user's ID from session storage or another client-side storage
  const userId = sessionStorage.getItem("userId");

  // Fetch initial weight data when the component mounts
  useEffect(() => {
    const fetchInitialWeightData = async () => {
      if (!userId) {
        console.error("No user ID available.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/weight/${userId}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const transformedData = {
            labels: data.map((entry, index) => `Day ${index + 1}`),
            datasets: [
              {
                label: "Weight (lb)",
                data: data.map((entry) => entry.weight),
                borderColor: "#FFFFFF",
                pointBackgroundColor: "#FF0000",
                pointBorderColor: "#FF0000",
              },
            ],
          };
          setWeightData(transformedData);
        }
      } catch (error) {
        console.error("Fetching initial weight data failed: " + error.message);
      }
    };

    fetchInitialWeightData();
  }, [userId]);

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

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    const newEntry = parseFloat(weight);
    if (!isNaN(newEntry)) {
      const dayCount = weightData.labels.length + 1;
      setWeightData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, `Day ${dayCount}`],
        datasets: [
          {
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data, newEntry],
          },
        ],
      }));
      setWeight("");
    }
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    setWeightGoal(e.target.previousElementSibling.value); // Set weight goal from input
  };

  const clearData = () => {
    localStorage.removeItem("weightGoal");
    // Assuming weightData is stored in localStorage
    localStorage.removeItem("weightData");
    setWeightGoal("");
    setWeightData({
      labels: [],
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
