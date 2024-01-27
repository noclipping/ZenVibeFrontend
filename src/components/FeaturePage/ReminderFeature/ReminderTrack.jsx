import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import SideNav from "../../../components/dashboard/sidebar/SideNav";
import UserProfile from "../../dashboard/UserProfile/UserProfile";
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

  // Additional functionality to handle reminder updates and deletions
  const handleUpdateReminder = async (updatedReminder) => {
    // Implement update logic here
  };

  const handleDeleteReminder = async (reminderId) => {
    // Implement delete logic here
  };

  return (
    <div className="App">
      <SideNav userId={userId} />
      <UserProfile userId={userId} />
      <div className="reminder-content">
        <h1>Health Reminders</h1>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          // Add more event handlers if needed
          style={{ height: 500 }}
          onSelectSlot={handleDateChange}
          selectable
          className="custom-calendar"
        />
        <p>
          Effortlessly log your health-related reminders and utilize our
          interactive calendar to stay on top of your wellness journey. From
          medication schedules to workout plans, let this space be your personal
          assistant in tracking and managing all your health activities
          efficiently.
        </p>
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