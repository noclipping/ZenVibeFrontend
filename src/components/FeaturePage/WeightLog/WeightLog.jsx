import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "../../FeaturePage/WeightLog/WeightLog.css";

Chart.register(...registerables, annotationPlugin);

function WeightLog() {
    const [weight, setWeight] = useState("");
    const [weightGoal, setWeightGoal] = useState("");
    const [originalWeight, setOriginalWeight] = useState("");
    const [showForm, setShowForm] = useState(true)
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
    const location = useLocation()

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

                const weightResponse = await fetch(`http://localhost:3000/weight/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                const weightEntries = await weightResponse.json();


                setOriginalWeight(userData.original_weight);
                setWeightGoal(userData.goal_weight);

                updateChartData(weightEntries, userData.original_weight);

                const isWeightGoalPage = location.pathname.startsWith('/weight-goal/') && location.pathname.split('/').pop() === id
                setShowForm(isWeightGoalPage)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserData();
    }, [id]);

    const updateChartData = (weightEntries, initialWeight) => {
        const chartLabels = weightEntries.map((entry, index) => `Day ${index + 1}`);
        //     const chartLabels = weightEntries.map((entry, index) => new Date(entry.date));
        const chartData = weightEntries.map(entry => entry.weight);
        // console.log(entry.weight, "this")

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

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const goalValue = parseFloat(weightGoal);

        const annotations = goalValue ? {
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
        } : {};

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

    const handleWeightSubmit = async (e) => {
        e.preventDefault();
        if (!isNaN(parseFloat(weight)) && id) {


            try {
                const response = await fetch(`http://localhost:3000/weight/${id}`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ weight }),
                    credentials: "include",
                });
                console.log(response)
                if (response.ok) {
                    const newEntry = await response.json();
                    updateChartData([...weightData.datasets[0].data, newEntry.weight], originalWeight);
                } else {
                    const errorResponse = await response.json()
                    console.error('Error Response:', errorResponse)
                }
                setWeight("");
            } catch (error) {
                console.error("Error submitting weight:", error);
            }
        }

    };

    const handleGoalSubmit = (e) => {
        e.preventDefault();
        if (!isNaN(parseFloat(weightGoal))) {
            setWeightGoal(e.target.previousElementSibling.value);
            localStorage.setItem("weightGoal", e.target.previousElementSibling.value);
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

            {showForm && (
                <div>
                    <form onSubmit={handleWeightSubmit} className="weight-log-form">
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Enter weight (lb)" required />
                        <button type="submit">Log Weight</button>
                    </form>
                    <form onSubmit={handleGoalSubmit} className="weight-log-form">
                        <input type="number" value={weightGoal} onChange={e => setWeightGoal(e.target.value)} placeholder="Set weight goal (lb)" required />
                        <button type="submit">Set Goal</button>
                    </form>
                    <button onClick={clearData} className="clear-data-button">Clear Data</button>
                </div>
            )}

        </div>
    );
}

export default WeightLog;
