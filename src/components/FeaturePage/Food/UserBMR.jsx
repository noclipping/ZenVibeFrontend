import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types'; // Import PropTypes
// import FoodEntryCard from "./FoodEntryCard";
import "../../FeaturePage/Food/UserBMR.css"
import "./CalorieBar.css";

export default function UserBMR({foodEntries}) {
   
    
    
  const calculateBMR = (gender, weight, height, age) => {
    return gender === 'Female'
      ? Math.floor(655.1 + (4.35 * weight) + (4.7 * height) - (4.676 * age))
      : Math.floor(66.47 + (6.24 * weight) + (12.7 * height) - (6.755 * age));
  };

  const getActivityFactor = (level) => {
    const activityFactors = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extremelyActive: 1.9,
    };
    return activityFactors[level];
  };

  const [BMR, setBMR] = useState(0);
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calorieDeficit, setCalorieDeficit] = useState(500);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [remainingDailyCalories, setRemainingDailyCalories] = useState(0);

  const { id } = useParams();

  const TDEE = useCallback(() => {
    return Math.floor(BMR * getActivityFactor(activityLevel));
  }, [BMR, activityLevel]);

  const totalDailyCalories = useCallback(() => {
    return TDEE() - calorieDeficit;
  }, [TDEE, calorieDeficit]); // Add dependencies here


    useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        console.error("No user ID available.");
        return;
      }

      try {
        // Fetching user data from API
        const userResponse = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const userData = await userResponse.json();

        // Calculate and set BMR
        const BMR = calculateBMR(userData.gender, userData.original_weight, userData.height_inches, userData.age);
        setBMR(BMR);

        const consumedCalories = foodEntries.reduce((total, entry) => total + entry.calories, 0);
        setConsumedCalories(consumedCalories);

        const remainingDailyCalories = totalDailyCalories() - consumedCalories;
        setRemainingDailyCalories(remainingDailyCalories);
      }

        //console.log(userData.gender, userData.original_weight, userData.height_inches, userData.age);

      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  },  [id, foodEntries, totalDailyCalories]);

  
  
  const updateProgressBar = () => {
    const percentage = Math.min(100, (consumedCalories / totalDailyCalories()) * 100);
    return { width: `${percentage}%` };
  };
  
  const updateProgressBarColor = () => {
    const percentage = (consumedCalories / totalDailyCalories()) * 100;
    if (percentage < 70) {
      return { backgroundColor: 'green' };
    } else if (percentage >= 70 && percentage <= 90) {
      return { backgroundColor: 'yellow' };
    } else {
      return { backgroundColor: 'red' };
    }
  };

  return (
    <div className="user-bmr-container">
    <div className="progress-bar">
        <div className="progress-bar-inner" style={{ ...updateProgressBar(), ...updateProgressBarColor() }}></div>
    </div>

    <div className="user-bmr-stats">
                <p>Daily Target Calories: {totalDailyCalories()}</p>
                <p>Consumed Calories: {consumedCalories}</p>
                <p>Remaining Daily Calories: {remainingDailyCalories}</p>
            </div>
            <div className="label-group">
            <label className="user-bmr-label">
          Activity Level:
          <select className="user-bmr-select" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
            <option value="sedentary">Sedentary</option>
            <option value="lightlyActive">Lightly Active</option>
            <option value="moderatelyActive">Moderately Active</option>
            <option value="veryActive">Very Active</option>
            <option value="extremelyActive">Extremely Active</option>
          </select>
        </label>

        <label>
          Calorie Deficit/Surplus:
          <input
            type="number"
            value={calorieDeficit}
            onChange={(e) => setCalorieDeficit(parseInt(e.target.value, 10))}
          />
        </label>
    </div>
    </div>
  );

}

  
  UserBMR.propTypes = {
    foodEntries: PropTypes.array.isRequired
  };

