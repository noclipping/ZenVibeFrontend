import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import '../../FeaturePage/WeightLog/WeightLog.css'

// Registers the necessary components for Chart.js
Chart.register(...registerables);

function WeightLog() {
    // State for storing the current weight input
    const [weight, setWeight] = useState('');
    // State for storing the chart data
    const [weightData, setWeightData] = useState({
        labels: [], // Labels for each data point (days)
        datasets: [{ // Data for the chart
            label: 'Weight (lb)',
            data: [], // Array of weight data
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    });

    // References to the chart canvas and the chart instance
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // useEffect to update the chart when the weightData changes
    useEffect(() => {
        // Destroy the previous chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create a new chart instance
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: weightData,
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }, [weightData]);

    // Handler for weight submission
    const handleWeightSubmit = (e) => {
        e.preventDefault();
        // Calculate the day count for the label
        const dayCount = weightData.labels.length + 1;
        // Update the weightData state with the new weight
        setWeightData(prevData => ({
            ...prevData,
            labels: [...prevData.labels, `Day ${dayCount}`],
            datasets: [{
                ...prevData.datasets[0],
                data: [...prevData.datasets[0].data, parseFloat(weight)]
            }]
        }));
        // Reset the weight input field
        setWeight('');
    };

return (
    <div className="weight-log-container">
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
        <div className="weight-log-chart">
            <canvas ref={chartRef} />
        </div>
    </div>
);
}

export default WeightLog;

