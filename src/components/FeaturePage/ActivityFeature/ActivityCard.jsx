import  { useState } from "react";
import PropTypes from "prop-types";

function ActivityCard({ activities, setActivities, userId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editActivityId, setEditActivityId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // State to manage collapsible section
  const [updatedActivity, setUpdatedActivity] = useState({
    activity_name: "",
    sets: 0,
    reps: 0,
    lift_weight: 0,
    duration: 0,
  });

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleUpdateField = (field, value) => {
    setUpdatedActivity({ ...updatedActivity, [field]: value });
  };

  const editActivity = () => {
    const updatedActivities = activities.map((activity) =>
      activity.entry_id === editActivityId ? { ...activity, ...updatedActivity } : activity
    );
    setActivities(updatedActivities);
    localStorage.setItem(`activities_${userId}`, JSON.stringify(updatedActivities));
    setIsEditing(false);
    setEditActivityId(null);
  };

  const deleteActivity = (entryId) => {
    const updatedActivities = activities.filter((activity) => activity.entry_id !== entryId);
    setActivities(updatedActivities);
    localStorage.setItem(`activities_${userId}`, JSON.stringify(updatedActivities));
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
      <button onClick={toggleCollapse} className="collapse-toggle-button">
        {isCollapsed ? "Show Activities" : "Hide Activities"}
      </button>
      {!isCollapsed && activities.map((activity) => (
        <div key={activity.entry_id} className="activity-entry">
          {isEditing && editActivityId === activity.entry_id ? (
            <div>
              <input
                type="text"
                value={updatedActivity.activity_name}
                onChange={(e) => handleUpdateField("activity_name", e.target.value)}
              />
              {/* Insert additional input fields for sets, reps, etc., here as needed */}
              <button onClick={editActivity}>Update Activity</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Activity Name: {activity.activity_name}</p>
              {/* Insert display of other activity details here */}
              <button onClick={() => startEditing(activity)}>Edit ✎</button>
              <button onClick={() => deleteActivity(activity.entry_id)}>Delete ❌</button>
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
  userId: PropTypes.string.isRequired,
};

export default ActivityCard;
