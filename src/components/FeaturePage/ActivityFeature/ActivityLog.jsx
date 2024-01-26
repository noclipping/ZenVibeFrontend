import { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import { useParams } from "react-router-dom";

function ActivityLog({activities, fetchActivities}){

    const [newActivity, setNewActivity] = useState({
        activity_name: "",
        sets: 0,
        reps: 0,
        lift_weight: 0,
        duration: 0
    })
    const [selectedCategory, setSelectedCategory] = useState("")

    const { id: userId } = useParams();
   
    
  const handleCreateActivity = async (event) => {
    event.preventDefault();
    const activityData = {
      ...newActivity,
      sets: newActivity.sets || null,
      reps: newActivity.reps || null,
      lift_weight: newActivity.lift_weight || null,
      duration: newActivity.duration || null,
      entry_date:
        newActivity.entry_date || new Date().toISOString().split("T")[0], // default to current date if not provided
    };

    try {
      const response = await fetch(`http://localhost:3000/activity/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
        credentials: "include",
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to create activity");
      }
      setNewActivity({
        activity_name: "",
        sets: 0,
        reps: 0,
        lift_weight: 0,
        duration: 0,
        entry_date: "",
      });
      await fetchActivities();
    } catch (error) {
      console.error("Create Activity Error:", error);
    }
  };

return (
        <div>
     
        <ActivityCard activities={activities}/>

        {/* {activities.map((activities, index) => (
        <ActivityCard
          key={index}
          activities={activities}
          editActivity={editActivity}
          deleteActivity={deleteActivity}
          isEditing={isEditing}  // Pass isEditing as a prop to ActivityCard
        />
      ))} */}
        
        
        <form onSubmit={handleCreateActivity}>
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity.activity_name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Sets"
            value={newActivity.sets}
            onChange={(e) =>
              setNewActivity({ ...newActivity, sets: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Reps"
            value={newActivity.reps}
            onChange={(e) =>
              setNewActivity({ ...newActivity, reps: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Weight Lifted"
            value={newActivity.lift_weight}
            onChange={(e) =>
              setNewActivity({ ...newActivity, lifted_weight: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Duration"
            value={newActivity.duration}
            onChange={(e) =>
              setNewActivity({ ...newActivity, duration: e.target.value })
            } />
            <select
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
            >
          <option value="">Select Category</option>
          <option value="weight_training">Weight Training</option>
          <option value="cardio">Cardio</option>
          <option value="cross_training">Cross Training</option>
          <option value="flexibility_mobility">Flexibility and Mobility</option>
        </select>
            <button type="submit">Add Activity</button>
            </form>
            </div>
    )
}

export default ActivityLog