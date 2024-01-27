import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import ActivityCard from "../ActivityFeature/ActivityCard";
import SideNav from "../../../components/dashboard/sidebar/SideNav";
import UserProfile from "../../dashboard/UserProfile/UserProfile";
import "../ActivityFeature/ActivityReport.css";

function ActivityTrack() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    activity_name: "",
    sets: 0,
    reps: 0,
    lift_weight: 0,
    duration: 0,
    entry_date: "",
  });
  const [selectedActivityType, setSelectedActivityType] = useState(""); // Define selectedActivityType state
  const [activityStreak, setActivityStreak] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["red", "gray", "blue"], // Colors for Weights, Other, and Cardio respectively
        hoverBackgroundColor: ["red", "gray", "blue"], // Hover colors
      },
    ],
  });
  const { id: userId } = useParams();

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/activity/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data);
      preparePieChartData(data); // Call to prepare pie chart data
    } catch (error) {
      console.error("Fetch Activities Error:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

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

  const preparePieChartData = (activities) => {
    const activityCategories = {
      Weights: 0,
      Cardio: 0,
      Other: 0,
    };

    activities.forEach((activity) => {
      const activityName = activity.activity_name || "Other"; // Default to 'Other' if no name is provided
      const lowercaseActivityName = activityName.toLowerCase();

      // Categorize activities based on keywords in the name
      if (lowercaseActivityName.includes("weight")) {
        activityCategories.Weights++;
      } else if (
        lowercaseActivityName.includes("cardio") ||
        lowercaseActivityName.includes("running")
      ) {
        activityCategories.Cardio++;
      } else {
        activityCategories.Other++;
      }
    });

    const chartData = {
      labels: Object.keys(activityCategories),
      datasets: [
        {
          label: "Activity Types",
          data: Object.values(activityCategories),
          backgroundColor: ["red", "gray", "blue"], // Colors for Weights, Other, and Cardio respectively
          hoverBackgroundColor: ["red", "gray", "blue"], // Hover colors
        },
      ],
    };

    setPieChartData(chartData);
  };

  useEffect(() => {
    preparePieChartData(activities);
  }, [activities]);

  // Calculate Activity Streak
  useEffect(() => {
    if (activities.length === 0) {
      setActivityStreak(0);
      return;
    }

    const sortedActivities = [...activities].sort(
      (a, b) => new Date(b.entry_date) - new Date(a.entry_date)
    );
    let streak = 1;
    let previousDate = new Date(sortedActivities[0].entry_date);

    for (let i = 1; i < sortedActivities.length; i++) {
      const currentDate = new Date(sortedActivities[i].entry_date);
      const diffTime = Math.abs(currentDate - previousDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
      previousDate = currentDate;
    }

    setActivityStreak(streak);
  }, [activities]);

  return (
    <div className="App">
      <SideNav userId={userId} />
      <UserProfile userId={userId} />
      <div className="activity-content">
        <h2>Activities</h2>
        <div>Activity Streak: {activityStreak} days</div>
        {pieChartData && pieChartData.labels.length > 0 ? (
          <div className="activity-spacing">
            <Pie data={pieChartData} />
          </div>
        ) : (
          <p>Loading chart data...</p>
        )}
        {/* Integrate ActivityCard component */}
        <ActivityCard activities={activities} setActivities={setActivities} selectedActivityType={selectedActivityType}/>
        <form onSubmit={handleCreateActivity}>
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity.activity_name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_name: e.target.value })
            }
            className="activity-input"
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
            }
          />
          <select
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="weight_training">Weight Training</option>
            <option value="cardio">Cardio</option>
            <option value="cross_training">Cross Training</option>
            <option value="flexibility_mobility">
              Flexibility and Mobility
            </option>
          </select>
          <button type="submit" className="activity-button">
            Add Activity
          </button>
        </form>
      </div>
    </div>
  );
}

export default ActivityTrack;
