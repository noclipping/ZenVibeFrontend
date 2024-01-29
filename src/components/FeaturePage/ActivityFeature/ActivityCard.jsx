import PropTypes from "prop-types";
import { useState } from "react";

export default function ActivityCard({ activities, setActivities, onActivitiesChange, userId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editActivityId, setEditActivityId] = useState(null);
  const [updatedActivity, setUpdatedActivity] = useState({
    activity_name: "",
    sets: 0,
    reps: 0,
    lift_weight: 0,
    duration: 0,
  });

  // Update handler for each field
  const handleUpdateField = (field, value) => {
    setUpdatedActivity({ ...updatedActivity, [field]: value });
  };

  const editActivity = async () => {
    try {
      if (!userId) {
        console.error("userId is undefined");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/activity/${userId}/${editActivityId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedActivity),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.entry_id === editActivityId
            ? { ...activity, ...updatedActivity }
            : activity
        )
      );

      setIsEditing(false);
      setEditActivityId(null);
      onActivitiesChange(); // Notify parent component to update the pie chart
    } catch (error) {
      console.error("Error updating activity entry:", error);
    }
  };

  const deleteActivity = async (entryId) => {
    try {
      if (!userId) {
        console.error("userId is undefined");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/activity/${userId}/${entryId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }

      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.entry_id !== entryId)
      );

      onActivitiesChange(); // Notify parent component to update the pie chart
    } catch (error) {
      console.error("Error deleting activity entry:", error);
    }
  };

  const startEditing = (activity) => {
    setEditActivityId(activity.entry_id);
    setUpdatedActivity({
      activity_name: activity.activity_name,
      sets: activity.sets,
      reps: activity.reps,
      lift_weight: activity.lift_weight,
      duration: activity.duration,
    });
    setIsEditing(true);
  };

  return (
    <div>
      {activities && activities.map((activity) => (
        <div key={activity.entry_id}>
          {isEditing && editActivityId === activity.entry_id ? (
            <div>
              <input
                value={updatedActivity.activity_name}
                onChange={(e) => handleUpdateField("activity_name", e.target.value)}
              />
              {/* Other input fields for sets, reps, etc. */}
              <button onClick={editActivity}>Update Activity</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Activity Name: {activity.activity_name}</p>
              {/* Display other activity details */}
              <button onClick={() => startEditing(activity)}>✎</button>
              <button onClick={() => deleteActivity(activity.entry_id)}>❌</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

ActivityCard.propTypes = {
  activities: PropTypes.array.isRequired,
  setActivities: PropTypes.func.isRequired,
  onActivitiesChange: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
