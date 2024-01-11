import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ReminderTrack() {
    const [reminders, setReminders] = useState([]);
    const [newReminder, setNewReminder] = useState({ title: '', description: '', reminder_date: '' });
    const { id } = useParams();

    useEffect(() => {
        fetchReminders();
    }, [id]);

    const fetchReminders = async () => {
        try {
            const response = await fetch(`http://localhost:3000/reminder/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch reminders');
            const data = await response.json();
            setReminders(data);
        } catch (error) {
            console.error('Fetch Reminders Error:', error);
        }
    };

    const handleCreateReminder = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/reminder/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReminder),
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to create reminder');
            await fetchReminders();
            setNewReminder({ title: '', description: '', reminder_date: '' });
        } catch (error) {
            console.error('Create Reminder Error:', error);
        }
    };

    // Define delete and update functions here

    return (
        <div>
            <h2>Reminders</h2>
            {reminders.map((reminder, index) => (
                <div key={index}>
                    <h3>{reminder.title}</h3>
                    <p>{reminder.description}</p>
                    <p>{reminder.reminder_date}</p>
                    {/* Add buttons for update and delete */}
                </div>
            ))}

            <form onSubmit={handleCreateReminder}>
                <input type="text" value={newReminder.title} onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })} placeholder="Title" required />
                <textarea value={newReminder.description} onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })} placeholder="Description" required />
                <input type="date" value={newReminder.reminder_date} onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })} required />
                <button type="submit">Add Reminder</button>
            </form>
        </div>
    );
}

export default ReminderTrack;
