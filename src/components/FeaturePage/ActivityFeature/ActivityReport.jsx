import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SideNav from '../../../components/dashboard/sidebar/SideNav';
import UserProfile from '../../dashboard/UserProfile/UserProfile';
import '../ActivityFeature/ActivityReport.css'

function ActivityTrack() {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        activity_name: '',
        sets: 0,
        reps: 0,
        lift_weight: 0,
        duration: 0,
        entry_date: ''
    });
    const { id: userId } = useParams();

    // Fetch Activities
    const fetchActivities = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/activity/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch activities');
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Fetch Activities Error:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    // Create Activity
    const handleCreateActivity = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/activity/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivity),
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to create activity');
            await fetchActivities();
            setNewActivity({
                activity_name: '',
                sets: 0,
                reps: 0,
                lift_weight: 0,
                duration: 0,
                entry_date: ''
            });
        } catch (error) {
            console.error('Create Activity Error:', error);
        }
    };

    // Additional functions for Update and Delete activities

    return (
        <div className="App">
            <SideNav userId={userId} />
            <UserProfile userId={userId} />
            <div className="activity-content">
                <h2>Activities</h2>
                {activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                        <h3>{activity.activity_name}</h3>
                        {/* Additional details and actions */}
                    </div>
                ))}
                <form onSubmit={handleCreateActivity} className="activity-form">
                    {/* Form fields for activity details */}
                    <button type="submit">Log Activity</button>
                </form>
            </div>
        </div>
    );
}

export default ActivityTrack;
