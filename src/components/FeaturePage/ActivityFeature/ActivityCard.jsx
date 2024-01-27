
import { useState } from "react";
import PropTypes from "prop-types";

export default function ActivityCard({
  activities,
  setActivities
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [updatedActivity, setUpdatedActivity] = useState({
    activity_name: "",
    sets: "",
    reps: "",
    lift_weight: "",
    duration: "",
  });

  const deleteActivity = async (activityEntryId) => {
    // Your deleteActivity function implementation here
  };

  const editActivity = async (activityEntryId) => {
    // Your editActivity function implementation here
  };

  const startEditing = (activity) => {
    setIsEditing(true);
    setCurrentActivityId(activity.entry_id);
    setUpdatedActivity({
      activity_name: activity.activity_name,
      sets: activity.sets,
      reps: activity.reps,
      lift_weight: activity.lift_weight,
      duration: activity.duration,
    });
  };

  const handleUpdate = () => {
    editActivity(currentActivityId, updatedActivity);
    setIsEditing(false);
  };

  return (
    <div>
      {activities.map((activity) => (
        <div key={activity.entry_id}>
          {!isEditing || currentActivityId !== activity.entry_id ? (
            <div>
              <p>Activity Name: {activity.activity_name}</p>
              <p>Sets: {activity.sets}</p>
              <p>Reps: {activity.reps}</p>
              <p>Weight Lifted: {activity.lift_weight}</p>
              <p>Duration: {activity.duration}</p>
              <button onClick={() => startEditing(activity)}>Edit</button>
              <button onClick={() => deleteActivity(activity.entry_id)}>Delete</button>
            </div>
          ) : (
            <div>
              <input
                placeholder="Activity Name"
                value={updatedActivity.activity_name}
                onChange={(e) =>
                  setUpdatedActivity({ ...updatedActivity, activity_name: e.target.value })
                }
              />
              <input
                placeholder="Sets"
                value={updatedActivity.sets}
                onChange={(e) =>
                  setUpdatedActivity({ ...updatedActivity, sets: e.target.value })
                }
              />
              <input
                placeholder="Reps"
                value={updatedActivity.reps}
                onChange={(e) =>
                  setUpdatedActivity({ ...updatedActivity, reps: e.target.value })
                }
              />
              <input
                placeholder="Weight Lifted"
                value={updatedActivity.lift_weight}
                onChange={(e) =>
                  setUpdatedActivity({ ...updatedActivity, lift_weight: e.target.value })
                }
              />
              <input
                placeholder="Duration"
                value={updatedActivity.duration}
                onChange={(e) =>
                  setUpdatedActivity({ ...updatedActivity, duration: e.target.value })
                }
              />
              <button onClick={handleUpdate}>Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
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
};
