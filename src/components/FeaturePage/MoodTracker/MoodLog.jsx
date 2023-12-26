import { useState, useEffect,} from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import '../../FeaturePage/MoodTracker/MoodLog.css'; // Adjust the path as needed

// Make sure to install chartjs-plugin-zoom for zooming functionality
// npm install chartjs-plugin-zoom
import 'chartjs-plugin-zoom';

function MoodLog() {
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [moodEntries, setMoodEntries] = useState(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'Happy':
        return 'rgba(102, 187, 106, 1)';
      case 'Sad':
        return 'rgba(66, 165, 245, 1)';
      case 'Anxious':
        return 'rgba(255, 238, 88, 1)';
      default:
        return 'rgba(128, 128, 128, 1)';
    }
  };

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      mood,
      intensity,
      date: new Date().toISOString(),
    };
    setMoodEntries([...moodEntries, newEntry]);
    setMood('');
    setIntensity(5);
  };

  const clearData = () => {
    localStorage.removeItem('moodEntries');
    setMoodEntries([]);
  };

  // Preparing the data for the Scatter chart
  const scatterData = {
    datasets: moodEntries.map((entry) => ({
      label: `${entry.mood} on ${new Date(entry.date).toLocaleDateString()}`,
      data: [{ x: new Date(entry.date), y: entry.intensity }],
      backgroundColor: getMoodColor(entry.mood),
    })),
  };

  const scatterOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: Intensity ${context.raw.y}`;
          },
        },
      },
      legend: {
        display: true,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="mood-log-container">
      <div className="mood-log-chart">
        <Scatter data={scatterData} options={scatterOptions} />
      </div>
      <form onSubmit={handleMoodSubmit} className="mood-log-form">
        <div>
          <label>
            Mood:
            <select value={mood} onChange={(e) => setMood(e.target.value)} required>
              <option value="">Select Mood</option>
              <option value="Happy">Happy</option>
              <option value="Sad">Sad</option>
              <option value="Anxious">Anxious</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Intensity:
            <input
              type="number"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              min="1"
              max="10"
              placeholder="Mood Intensity (1-10)"
              required
            />
          </label>
        </div>
        <button type="submit">Log Mood</button>
      </form>
      <button onClick={clearData} className="clear-data-button">Clear Data</button>
    </div>
  );
}

export default MoodLog;
