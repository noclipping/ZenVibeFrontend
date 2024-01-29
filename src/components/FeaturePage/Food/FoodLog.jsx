// FoodLog.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import FoodEntryCard from "./FoodEntryCard";
import UserBMR from "./UserBMR";
import PropTypes from "prop-types";
import "../../FeaturePage/Food/FoodLog.css";

function FoodLog({ showInputs }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { id } = useParams();

  const calculateConsumedCalories = (entries) => {
    return entries.reduce((total, entry) => total + entry.calories, 0);
  };

  const fetchFoodEntries = useCallback(async () => {
    if (!id) {
      console.error("No user ID provided.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/food/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const fetchedEntries = await response.json();
      setFoodEntries(fetchedEntries);
      setConsumedCalories(calculateConsumedCalories(fetchedEntries));
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchFoodEntries();
  }, [fetchFoodEntries]);

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    if (!foodName || calories === 0) {
      console.log("Food name and calories are required.");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        food_name: foodName,
        calories: parseFloat(calories),
        entry_date: today,
      };

      const response = await fetch(`http://localhost:3000/food/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setFoodName("");
      setCalories(0);
      await fetchFoodEntries();
    } catch (error) {
      console.error("Error submitting food entry:", error);
    }
  };

  const deleteFoodEntries = async (foodEntryId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/food/${foodEntryId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const updatedEntries = foodEntries.filter(
        (entry) => entry.entry_id !== foodEntryId
      );
      setFoodEntries(updatedEntries);
      setConsumedCalories(calculateConsumedCalories(updatedEntries));
    } catch (error) {
      console.error("Error deleting food entry:", error);
    }
  };

  const editFoodEntries = async (
    foodEntryId,
    updatedFoodName,
    updatedCalories
  ) => {
    try {
      const payload = {
        food_name: updatedFoodName,
        calories: parseFloat(updatedCalories),
      };

      const response = await fetch(
        `http://localhost:3000/food/${foodEntryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const updatedEntries = foodEntries.map((entry) =>
        entry.entry_id === foodEntryId ? { ...entry, ...payload } : entry
      );
      setFoodEntries(updatedEntries);
      setConsumedCalories(calculateConsumedCalories(updatedEntries));
    } catch (error) {
      console.error("Error updating food entry:", error);
    }
  };

  const calculateProgressBarWidth = () => {
    const maxCalories = 2000;
    return (consumedCalories / maxCalories) * 100;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="food-log-container">
      <h1>Welcome to Your Food Diary</h1>
      <p>
        Keep track of your daily food intake, manage your diet, and achieve your
        health goals. Log your meals and snacks below to start your journey
        towards a healthier lifestyle.
      </p>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${calculateProgressBarWidth()}%` }}
        ></div>
      </div>
      <UserBMR consumedCalories={consumedCalories} />
      {!showInputs && (
        <button onClick={toggleCollapse} className="collapse-toggle-button">
          {isCollapsed ? "Show Food Entries" : "Hide Food Entries"}
        </button>
      )}
      {!isCollapsed && (
        <div className="food-entries">
          {foodEntries.map((foodEntry) => (
            <FoodEntryCard
              key={foodEntry.entry_id}
              entry={foodEntry}
              deleteFoodEntries={deleteFoodEntries}
              editFoodEntries={editFoodEntries}
            />
          ))}
        </div>
      )}
      {showInputs && (
        <form onSubmit={handleFoodSubmit} className="food-log-form">
          <label>
            Food Name:
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Calories:
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseFloat(e.target.value))}
              required
            />
          </label>
          <br />
          <button type="submit">Add Food</button>
        </form>
      )}
    </div>
  );
}

FoodLog.propTypes = {
  showInputs: PropTypes.bool.isRequired,
};

export default FoodLog;
