import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import ActivityCard from "../ActivityFeature/ActivityCard";
import SideNav from "../../../components/dashboard/sidebar/SideNav";
import UserProfile from "../../dashboard/UserProfile/UserProfile";
import "../ActivityFeature/ActivityReport.css";

function ActivityTrack() {
  const [activities, setActivities] = useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState(""); // Define selectedActivityType state
  const [newActivity, setNewActivity] = useState({
    activity_name: "",
    sets: 0,
    reps: 0,
    lift_weight: 0,
    duration: 0,
    entry_date: "",
  });
  const [activityStreak, setActivityStreak] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["red", "gray", "blue", "white"], // Colors for Weights, Other, and Cardio respectively
        hoverBackgroundColor: ["red", "gray", "blue", "white"], // Hover colors
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
      selectedActivityType: selectedActivityType,
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
        selectedActivityType: "",
        entry_date: "",
      });
      await fetchActivities();
    } catch (error) {
      console.error("Create Activity Error:", error);
    }
  };

  const preparePieChartData = (activities, setPieChartData) => {
    const activityTypes = {
      "Weight Training": 0,
      "Cardio": 0,
      "Cross-Training": 0,
      "Flexibility and Mobility": 0
    };

    activities.forEach(selectedActivityType => {

      switch(selectedActivityType) {
        case "weight_training":
        activityTypes["Weight Training"]++
        break;
        case "cardio":
        activityTypes["Cardio"]++
        break;
        case "cross_training":
        activityTypes["Cross-Training"]++
        break;
        case "flexibility_mobility":
        activityTypes["Flexibility and Mobility"]++
        break;
      }
    })
      console.log(activities, "activities")

    const chartData = {
      labels: Object.keys(activityTypes),
      datasets: [
        {
          label: "Activity Types",
          data: Object.values(activityTypes),
          backgroundColor: ["red", "gray", "blue", "white"], // Colors for Weights, Other, and Cardio respectively
          hoverBackgroundColor: ["red", "gray", "blue", "white"], // Hover colors
        },
      ],
    };

    setPieChartData(chartData);
  };

  useEffect(() => {
    preparePieChartData(activities, setPieChartData);
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
              setNewActivity({ ...newActivity, lift_weight: e.target.value })
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
              required
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
