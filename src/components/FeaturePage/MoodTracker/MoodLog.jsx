import { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import 'chartjs-plugin-zoom';
import { useParams } from 'react-router-dom';

import '../../FeaturePage/MoodTracker/MoodLog.css';

function MoodLog() {
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [moodEntries, setMoodEntries] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mood/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMoodEntries(data);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };

    fetchMoodEntries();
  }, [id]);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/mood/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: id,
          emotion: mood,
          intensity: parseInt(intensity, 10),
          entry_date: new Date().toISOString().split('T')[0],
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const newMoodEntry = await response.json();
        setMoodEntries([...moodEntries, newMoodEntry]);
        setMood('');
        setIntensity(5);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting mood entry:', error);
    }
  };

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

  const scatterData = {
    datasets: moodEntries.map((entry) => ({
      label: `${entry.emotion} on ${new Date(entry.entry_date).toLocaleDateString()}`,
      data: [{ x: new Date(entry.entry_date), y: entry.intensity }],
      backgroundColor: getMoodColor(entry.emotion),
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
            <select value={mood} onChange={(e) => setMood(e.target.value)} required>
              <option value="">Select Mood</option>
              <option value="Happy">Happy</option>
              <option value="Sad">Sad</option>
              {/* Add other mood options as needed */}
            </select>
          </label>
        </div>
        <div>
          <label>
            <input
              type="number"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              min="1"
              max="10"
              placeholder="Intensity (1-10)"
              required
            />
          </label>
        </div>
        <button type="submit">Log Mood</button>
      </form>
    </div>
  );
}

export default MoodLog;
