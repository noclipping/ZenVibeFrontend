import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SideNav from '../../../components/dashboard/sidebar/SideNav';
import UserProfile from '../../dashboard/UserProfile/UserProfile';
import '../ReminderFeature/ReminderTrack.css'

function ReminderTrack() {
    const [reminders, setReminders] = useState([]);
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        reminder_date: ''
    });
    const { id: userId } = useParams();

    const fetchReminders = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/reminder/${userId}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reminders');
            }
            const data = await response.json();
            setReminders(data);
        } catch (error) {
            console.error('Fetch Reminders Error:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const handleCreateReminder = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/reminder/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newReminder.title,
                    description: newReminder.description,
                    reminder_date: newReminder.reminder_date
                }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to create reminder');
            }
            await fetchReminders();
            setNewReminder({ title: '', description: '', reminder_date: '' });
        } catch (error) {
            console.error('Create Reminder Error:', error);
        }
    };

    return (
        <div className="App">
            <SideNav userId={userId} />
            <UserProfile userId={userId} />
            <div className="reminder-content">
                <h2>Reminders</h2>
                {reminders.map((reminder, index) => (
                    <div key={index} className="reminder-item">
                        <h3>{reminder.title}</h3>
                        <p>{reminder.description}</p>
                        <p>{reminder.reminder_date}</p>
                    </div>
                ))}
                <form onSubmit={handleCreateReminder} className="reminder-form">
                    <input 
                        type="text" 
                        value={newReminder.title} 
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })} 
                        placeholder="Title" 
                        required 
                    />
                    <textarea 
                        value={newReminder.description} 
                        onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })} 
                        placeholder="Description" 
                        required 
                    />
                    <input 
                        type="date" 
                        value={newReminder.reminder_date} 
                        onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })} 
                        required 
                    />
                    <button type="submit">Add Reminder</button>
                </form>
            </div>
        </div>
    );
}

export default ReminderTrack;
