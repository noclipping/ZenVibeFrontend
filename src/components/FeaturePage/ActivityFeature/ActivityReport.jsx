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
    sets: "",
    reps: "",
    lift_weight: "",
    duration: "",
    entry_date: "",
  });
  const [selectedActivityType, setSelectedActivityType] = useState("");

  const [activityStreak] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
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
      preparePieChartData(data);
    } catch (error) {
      console.error("Fetch Activities Error:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, activities]);

  const handleCreateActivity = async (event) => {
    event.preventDefault();
    const activityData = {
      activity_name: newActivity.activity_name, // Use the inputted activity name
      sets: newActivity.sets || null,
      reps: newActivity.reps || null,
      lift_weight: newActivity.lift_weight || null,
      duration: newActivity.duration || null,
      entry_date: new Date().toISOString().split("T")[0],
      category: selectedActivityType, // Include the selected category
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
      await fetchActivities();
    } catch (error) {
      console.error("Create Activity Error:", error);
    }
  };

  const preparePieChartData = (data) => {
    const counts = data.reduce((acc, activity) => {
      const name = activity.activity_name; // Use the actual activity name
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    setPieChartData({
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    });
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Add this to prevent aspect ratio distortion
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  useEffect(() => {
    preparePieChartData(activities);
  }, [activities]);

  useEffect(() => {
    // Activity streak calculation logic...
  }, [activities]);

  return (
    <div className="App">
      <SideNav userId={userId} />
      <UserProfile userId={userId} />
      <div className="activity-content">
        <h2>Activities</h2>
        <p>
          Welcome to your activities dashboard! This section allows you to track
          and manage your fitness activities. You can view your activity streak,
          analyze your activity distribution through the pie chart, and add new
          activities to your log. Stay motivated and achieve your fitness goals
          with our easy-to-use tracking tool.
        </p>

        <div>Activity Streak: {activityStreak} days</div>
        {pieChartData && pieChartData.labels.length > 0 ? (
          <div className="activity-spacing">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        ) : (
          <p>Loading chart data...</p>
        )}
        <ActivityCard
          activities={activities}
          setActivities={setActivities}
          // selectedActivityType={selectedActivityType}
        />
        <form onSubmit={handleCreateActivity}>
          <input
            type="text"
            placeholder="Enter Activity"
            value={newActivity.activity_name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_name: e.target.value })
            }
            className="activity-input"
            required
          />

          {/* Other form inputs for sets, reps, etc. */}
          <select
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Weight Training">Weight Training</option>
            <option value="Cardio">Cardio</option>
            <option value="Cross Training">Cross Training</option>
            <option value="Flexibility and Mobility">
              Flexibility and Mobility
            </option>
            {/* Add more categories as needed */}
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
