import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation';
import '../../FeaturePage/WeightLog/WeightLog.css'; // Adjust the path as needed

// Register the annotation plugin
Chart.register(annotationPlugin);

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

    useEffect(() => {
        localStorage.setItem('weightGoal', weightGoal);
        localStorage.setItem('weightData', JSON.stringify(weightData));
    }, [weightData, weightGoal]);

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
    };

    const chartOptions = {
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
                annotations: {
                    line1: weightGoal ? {
                        type: 'line',
                        yMin: parseFloat(weightGoal),
                        yMax: parseFloat(weightGoal),
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'Weight Goal: ' + weightGoal + ' lb',
                            enabled: true,
                            position: 'start',
                        },
                    } : null,
                },
            },
        },
    };

    return (
        <div className="weight-log-container">
            <div className="weight-log-chart">
                <Line data={weightData} options={chartOptions} />
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
