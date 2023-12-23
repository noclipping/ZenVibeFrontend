import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import './MoodTracker.css'


function MoodGraph({ moodData }) {
    const data = {
        labels: moodData.map(entry => entry.date.toLocaleDateString()),
        datasets: [{
            label: 'Mood Intensity',
            data: moodData.map(entry => entry.intensity),
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
        }],
    };

    

    const options = {
        scales: {
            y: {
                min: 1,
                max: 10,
            },
        },
    };

    return (
        <div className="mood-graph-container">
            <Line data={data} options={options} />
        </div>
    );
}

MoodGraph.propTypes = {
    moodData: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date).isRequired,
        mood: PropTypes.string.isRequired,
        intensity: PropTypes.number.isRequired,
      })
    ).isRequired,
  };
  export default MoodGraph;
