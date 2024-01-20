import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { calculateBMR } from "./bmrCalculator";
import "./CalorieBar.css";

function UserBMR() {
  const [BMR, setBMR] = useState(0);
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calorieDeficit, setCalorieDeficit] = useState(500);
  const { id } = useParams();


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
        const calculatedBMR = calculateBMR(userData.gender, userData.original_weight, userData.height_inches, userData.age);
        setBMR(calculatedBMR);

        console.log(userData.gender, userData.original_weight, userData.height_inches, userData.age)

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id])

  const calculateTDEE = () => BMR * getActivityFactor(activityLevel);
  const calculateDailyCalories = () => calculateTDEE() - calorieDeficit;

  const getActivityFactor = (level) => {
    const activityFactors = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extremelyActive: 1.9,
    };
    return activityFactors[level];
  }
  return (
    <div>
      
        <>
          <h2>Calorie Calculator</h2>
          <p>BMR: {BMR}</p>
          <p>TDEE: {calculateTDEE()}</p>
          <p>Daily Calories for Weight Loss: {calculateDailyCalories()}</p>

          <label>
            Activity Level:
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              <option value="sedentary">Sedentary</option>
              <option value="lightlyActive">Lightly Active</option>
              <option value="moderatelyActive">Moderately Active</option>
              <option value="veryActive">Very Active</option>
              <option value="extremelyActive">Extremely Active</option>
            </select>
          </label>

          <label>
            Calorie Deficit:
            <input
              type="number"
              value={calorieDeficit}
              onChange={(e) => setCalorieDeficit(parseInt(e.target.value, 10))}
            />
          </label>
        </>
      
    </div>
  );
  }

  export default UserBMR;