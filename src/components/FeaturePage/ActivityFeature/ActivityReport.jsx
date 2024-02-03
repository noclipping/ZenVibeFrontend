import  { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import ActivityCard from "../ActivityFeature/ActivityCard";
import SideNav from "../../../components/dashboard/sidebar/SideNav";
import UserProfile from "../../dashboard/UserProfile/UserProfile";
import "../ActivityFeature/ActivityReport.css";

function ActivityTrack() {
  const { id: userId } = useParams();
  const [activities, setActivities] = useState(() => {
    return JSON.parse(localStorage.getItem(`activities_${userId}`)) || [];
  });

  const [newActivity, setNewActivity] = useState({
    activity_name: "",
    sets: "",
    reps: "",
    lift_weight: "",
    duration: "",
    entry_date: "",
    category: "",
  });

  const [selectedActivityType, setSelectedActivityType] = useState("");

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#007bff", // Blue
          "#dc3545", // Red
          "#28a745", // Light Green
        ],
        hoverBackgroundColor: [
          "#0056b3", // Darker Blue
          "#c82333", // Darker Red
          "#1e7e34", // Darker Light Green
        ],
      },
    ],
  });

  const preparePieChartData = useCallback(() => {
    const categoryCounts = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {});

    setPieChartData((prevData) => ({
      ...prevData,
      labels: Object.keys(categoryCounts),
      datasets: prevData.datasets.map((dataset) => ({
        ...dataset,
        data: Object.values(categoryCounts),
      })),
    }));
  }, [activities]);

  useEffect(() => {
    preparePieChartData();
  // Including preparePieChartData in the dependency array as it's defined outside but used inside useEffect
  }, [activities, preparePieChartData]);

  const handleCreateActivity = (event) => {
    event.preventDefault();
    const activityWithId = {
      ...newActivity,
      entry_id: Date.now().toString(),
      category: selectedActivityType,
    };
    const updatedActivities = [...activities, activityWithId];
    updateLocalStorageActivities(updatedActivities);
    resetNewActivityForm();
  };

  const updateLocalStorageActivities = (updatedActivities) => {
    localStorage.setItem(`activities_${userId}`, JSON.stringify(updatedActivities));
    setActivities(updatedActivities);
  };

  const resetNewActivityForm = () => {
    setNewActivity({
      activity_name: "",
      sets: "",
      reps: "",
      lift_weight: "",
      duration: "",
      entry_date: "",
      category: "",
    });
    setSelectedActivityType("");
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  return (
    <div className="App">
      <SideNav userId={userId} />
      <UserProfile userId={userId} />
      <div className="activity-content">
        <h2>Activities</h2>
        <p>Welcome to your activities dashboard! This section allows you to track and manage your fitness activities.</p>
        {pieChartData && pieChartData.labels.length > 0 ? (
          <div className="activity-spacing">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        ) : (
          <p>No activity data available.</p>
        )}
        <ActivityCard
          activities={activities}
          setActivities={setActivities}
          onDeleteActivity={(entryId) => {
            const updatedActivities = activities.filter((activity) => activity.entry_id !== entryId);
            updateLocalStorageActivities(updatedActivities);
          }}
          onUpdateActivity={(updatedActivity) => {
            const updatedActivities = activities.map((activity) =>
              activity.entry_id === updatedActivity.entry_id ? updatedActivity : activity
            );
            updateLocalStorageActivities(updatedActivities);
          }}
          userId={userId}
        />
        <form onSubmit={handleCreateActivity} className="activity-form">
          <input
            type="text"
            placeholder="Enter Activity"
            value={newActivity.activity_name}
            onChange={(e) => setNewActivity({ ...newActivity, activity_name: e.target.value })}
            className="activity-input"
            required
          />
          <select
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            className="activity-input"
            required
          >
            <option value="">Select Category</option>
            <option value="Cardio">Cardio</option>
            <option value="Weight Training">Weight Training</option>
            <option value="Cross Training">Cross Training</option>
            <option value="Flexibility and Mobility">Flexibility and Mobility</option>
          </select>
          <button type="submit" className="activity-button">Add Activity</button>
        </form>
      </div>
    </div>
  );
}

export default ActivityTrack;
