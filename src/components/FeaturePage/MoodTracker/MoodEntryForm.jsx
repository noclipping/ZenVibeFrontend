// src/components/MoodEntryForm.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';


function MoodEntryForm({ onSubmit }) {
    const [mood, setMood] = useState('');
    const [intensity, setIntensity] = useState(5); // Mid-point of scale 1-10

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ date: new Date(), mood, intensity });
        setMood('');
        setIntensity(5); // Reset form
    };

    MoodEntryForm.propTypes = {
        onSubmit: PropTypes.func.isRequired,
      };

      return (
        <form onSubmit={handleSubmit} className="mood-entry-form">
            <div className="form-group">
                <label className="mood-label">
                    Mood:
                    <select value={mood} onChange={e => setMood(e.target.value)} required className="mood-select">
                        <option value="">Select...</option>
                        <option value="Happy">Happy</option>
                        <option value="Sad">Sad</option>
                        <option value="Anxious">Anxious</option>
                        <option value="Excited">Excited</option>
                        <option value="Tired">Tired</option>
                        <option value="Angry">Angry</option>
                        <option value="Calm">Calm</option>
                        <option value="Stressed">Stressed</option>
                        <option value="Content">Content</option>
                        <option value="Hopeful">Hopeful</option>
                        <option value="Frustrated">Frustrated</option>
                        <option value="Overwhelmed">Overwhelmed</option>
                        <option value="Joyful">Joyful</option>
                        <option value="Grateful">Grateful</option>
                        <option value="Inspirational">Inspirational</option>
                        {/* Add other moods as needed */}
                    </select>
                </label>
            </div>
    
            <div className="form-group">
                <label className="intensity-label">
                    Intensity:
                    <input 
                        type="number" 
                        value={intensity} 
                        onChange={e => setIntensity(e.target.value)} 
                        min="1" 
                        max="10" 
                        required 
                        className="intensity-input"
                    />
                </label>
            </div>
    
            <button type="submit" className="submit-button">Record Mood</button>
        </form>
    );
}    

export default MoodEntryForm;