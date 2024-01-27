// UserBMR.jsx
import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import "../../FeaturePage/Food/UserBMR.css"

export default function UserBMR({ consumedCalories }) {
    const [BMR, setBMR] = useState(0);
    const [activityLevel] = useState("sedentary");
    const [calorieDeficit, setCalorieDeficit] = useState(500);
    const [remainingDailyCalories, setRemainingDailyCalories] = useState(0);

    const { id } = useParams();

    const calculateBMR = useCallback((gender, weight, height, age) => {
        return gender === 'Female'
            ? Math.floor(655.1 + (4.35 * weight) + (4.7 * height) - (4.676 * age))
            : Math.floor(66.47 + (6.24 * weight) + (12.7 * height) - (6.755 * age));
    }, []);

    const getActivityFactor = useCallback((level) => {
        const activityFactors = {
            sedentary: 1.2,
            lightlyActive: 1.375,
            moderatelyActive: 1.55,
            veryActive: 1.725,
            extremelyActive: 1.9,
        };
        return activityFactors[level];
    }, []);

    const TDEE = useCallback(() => {
        return Math.floor(BMR * getActivityFactor(activityLevel));
    }, [BMR, activityLevel, getActivityFactor]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) {
                console.error("No user ID available.");
                return;
            }

            try {
                const userResponse = await fetch(`http://localhost:3000/user/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                const userData = await userResponse.json();

                const calculatedBMR = calculateBMR(userData.gender, userData.original_weight, userData.height_inches, userData.age);
                setBMR(calculatedBMR);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserData();
    }, [id, calculateBMR]);

    useEffect(() => {
        const totalCalories = TDEE() - calorieDeficit;
        const remainingCalories = totalCalories - consumedCalories;
        setRemainingDailyCalories(remainingCalories);
    }, [TDEE, calorieDeficit, consumedCalories]);

    return (
      <div className="user-bmr-container">
          <div className="user-bmr-stats">
              <div className="stat-item">
                  <label>Daily Target Calories:</label>
                  <span>{TDEE() - calorieDeficit}</span>
              </div>
              <div className="stat-item">
                  <label>Consumed Calories:</label>
                  <span>{consumedCalories}</span>
              </div>
              <div className="stat-item">
                  <label>Remaining Daily Calories:</label>
                  <span>{remainingDailyCalories}</span>
              </div>
          </div>
          <div className="user-bmr-controls">
              <div className="control-item">
              </div>
              <div className="control-item">
                  <label>Calorie Deficit/Surplus:</label>
                  <input type="number" value={calorieDeficit} onChange={(e) => setCalorieDeficit(parseInt(e.target.value, 10))} className="user-bmr-input"/>
              </div>
          </div>
      </div>
  );
}


UserBMR.propTypes = {
    consumedCalories: PropTypes.number.isRequired
};
