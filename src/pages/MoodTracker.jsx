// src/components/MoodTracker.jsx
import { useState } from 'react';
import MoodEntryForm from '../components/FeaturePage/MoodTracker/MoodEntryForm';
import MoodGraph from '../components/FeaturePage/MoodTracker/MoodGraph'; // This is the graph component from the previous guide
import SideNav from '../components/dashboard/sidebar/SideNav';

function MoodTracker() {
    const [moods, setMoods] = useState([]);

    const handleNewMood = (moodEntry) => {
        setMoods([...moods, moodEntry]);
    };

    return (
        <div>
            <h1>Mood Tracker</h1>
            <MoodEntryForm onSubmit={handleNewMood} />
            <MoodGraph moodData={moods} />
            <SideNav/>
        </div>
    );
}

export default MoodTracker;
