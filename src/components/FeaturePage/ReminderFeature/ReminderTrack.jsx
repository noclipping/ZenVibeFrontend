import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import SideNav from "../../../components/dashboard/sidebar/SideNav";
import UserProfile from "../../dashboard/UserProfile/UserProfile";
import Calendar from "react-calendar";
import "../ReminderFeature/ReminderTrack.css";
import "../ReminderFeature/CalendarStyles.css"

function ReminderTrack() {
    const [reminders, setReminders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newReminder, setNewReminder] = useState({
      title: '',
      description: '',
      reminder_date: new Date().toISOString().substr(0, 10), // Format the date as YYYY-MM-DD
    });
    const { id: userId } = useParams();


  const fetchReminders = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/reminder/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error("Fetch Reminders Error:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleCreateReminder = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/reminder/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newReminder.title,
          description: newReminder.description,
          reminder_date: newReminder.reminder_date,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to create reminder");
      }
      await fetchReminders();
      setNewReminder({ title: "", description: "", reminder_date: "" });
    } catch (error) {
      console.error("Create Reminder Error:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Update the reminder date in the form when a new date is selected
    setNewReminder((prevReminder) => ({
      ...prevReminder,
      reminder_date: date.toISOString().substr(0, 10),
    }));
  };

  const handleCheckboxChange = (id, checked) => {
    // Update the status of the reminder (this could involve an API call)
    // For demonstration, let's just log the action
    console.log(`Reminder ${id} completed status: ${checked}`);
};


  return (
    <div className="App">
    <SideNav userId={userId} />
    <UserProfile userId={userId} />
    <div className="reminder-content">
      <h2>Reminders</h2>
      <Calendar 
        onChange={handleDateChange} 
        value={selectedDate} 
        className="custom-calendar" // Apply custom styles
      />
        {reminders.map((reminder, index) => (
          <div key={index} className="reminder-item">
             <input
            type="checkbox"
            id={`checkbox-${index}`}
            onChange={(e) => handleCheckboxChange(reminder.id, e.target.checked)}
          />
          <label htmlFor={`checkbox-${index}`} className="reminder-label">
            <h3>{reminder.title}</h3>
            <p>{reminder.description}</p>
            <p>{reminder.reminder_date}</p>
          </label>
        </div>
      ))}
        <form onSubmit={handleCreateReminder} className="reminder-form">
          <input
            type="text"
            value={newReminder.title}
            onChange={(e) =>
              setNewReminder({ ...newReminder, title: e.target.value })
            }
            placeholder="Title"
            required
          />
          <textarea
            value={newReminder.description}
            onChange={(e) =>
              setNewReminder({ ...newReminder, description: e.target.value })
            }
            placeholder="Description"
            required
          />
          <input
            type="date"
            value={newReminder.reminder_date}
            onChange={(e) =>
              setNewReminder({ ...newReminder, reminder_date: e.target.value })
            }
            required
          />
          <button type="submit">Add Reminder</button>
        </form>
      </div>
=======
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Modal from "../../FeaturePage/ReminderFeature/Modal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../ReminderFeature/ReminderTrack.css";
import "../ReminderFeature/CalendarStyles.css";

const localizer = momentLocalizer(moment);

function ReminderTrack() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    reminder_date: new Date().toISOString().substr(0, 10),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id: userId } = useParams();

  const fetchReminders = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/reminder/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error("Fetch Reminders Error:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleCreateReminder = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/reminder/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to create reminder");
      }
      await fetchReminders();
      setNewReminder({ title: "", description: "", reminder_date: "" });
      closeModal();
    } catch (error) {
      console.error("Create Reminder Error:", error);
    }
  };

  const handleDateChange = (slotInfo) => {
    const { start } = slotInfo;
    setNewReminder((prevReminder) => ({
      ...prevReminder,
      reminder_date: moment(start).format("YYYY-MM-DD"),
    }));
    openModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const calendarEvents = reminders.map((reminder) => ({
    title: reminder.title,
    start: moment(reminder.reminder_date).toDate(),
    end: moment(reminder.reminder_date).toDate(),
    allDay: true,
  }));

  return (
    <div className="App">
      <SideNav userId={userId} />
      <UserProfile userId={userId} />
      <div className="reminder-content">
        <h2>Reminders</h2>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleDateChange}
          selectable
          className="custom-calendar" // Add this line
        />
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <form onSubmit={handleCreateReminder} className="reminder-form">
            <input
              type="text"
              value={newReminder.title}
              onChange={(e) =>
                setNewReminder({ ...newReminder, title: e.target.value })
              }
              placeholder="Title"
              required
            />
            <textarea
              value={newReminder.description}
              onChange={(e) =>
                setNewReminder({ ...newReminder, description: e.target.value })
              }
              placeholder="Description"
              required
            />
            <button type="submit">Add Reminder</button>
          </form>
        </Modal>
      )}

    </div>
  );
}

export default ReminderTrack;
