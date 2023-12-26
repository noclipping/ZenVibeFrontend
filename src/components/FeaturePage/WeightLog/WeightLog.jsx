import { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import '../../FeaturePage/WeightLog/WeightLog.css'; // Adjust the path as needed

Chart.register(...registerables, annotationPlugin);

function WeightLog() {
    const [weight, setWeight] = useState('');
    const [weightGoal, setWeightGoal] = useState(localStorage.getItem('weightGoal') || '');
    const [weightData, setWeightData] = useState(JSON.parse(localStorage.getItem('weightData')) || {
        labels: [],
        datasets: [
            {
                label: 'Weight (lb)',
                data: [],
                borderColor: '#FFFFFF',
                pointBackgroundColor: '#FF0000',
                pointBorderColor: '#FF0000',
            },
        ],
    });

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const updateChart = useCallback(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const goalValue = parseFloat(weightGoal); // Ensure it's a number
        const annotations = goalValue ? {
            line1: {
                type: 'line',
                yMin: goalValue,
                yMax: goalValue,
                borderColor: 'red',
                borderWidth: 2,
                label: {
                    content: 'Weight Goal: ' + goalValue + ' lb',
                    enabled: true,
                    position: 'start',
                },
            },
        } : {};

        chartInstance.current = new Chart(ctx, {
            type: 'line',
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

    useEffect(() => {
        localStorage.setItem('weightGoal', weightGoal);
        localStorage.setItem('weightData', JSON.stringify(weightData));
        updateChart();
    }, [weightData, weightGoal, updateChart]);

    const handleWeightSubmit = (e) => {
        e.preventDefault();
        const dayCount = weightData.labels.length + 1;
        setWeightData(prevData => ({
            ...prevData,
            labels: [...prevData.labels, `Day ${dayCount}`],
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: [...prevData.datasets[0].data, parseFloat(weight)],
                },
            ],
        }));
        setWeight('');
    };

    const handleGoalSubmit = (e) => {
        e.preventDefault();
        setWeightGoal(e.target.previousElementSibling.value); // Set weight goal from input
        updateChart(); // Update the chart to show the goal line
    };

    const clearData = () => {
        localStorage.removeItem('weightGoal');
        localStorage.removeItem('weightData');
        setWeightGoal('');
        setWeightData({
            labels: [],
            datasets: [
                {
                    label: 'Weight (lb)',
                    data: [],
                    borderColor: '#FFFFFF',
                    pointBackgroundColor: '#FF0000',
                    pointBorderColor: '#FF0000',
                },
            ],
        });
        updateChart();
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
            <button onClick={clearData} className="clear-data-button">Clear Data</button>
        </div>
    );
}

export default WeightLog;