import { useState, useEffect } from "react";
import FoodEntryCard from "./FoodEntryCard";
import UserBMR from "./UserBMR";

import { useParams } from "react-router-dom";
import "../../FeaturePage/Food/FoodLog.css";
import "./CalorieBar.css"


function FoodLog() {
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState(0);
    const [foodEntries, setFoodEntries] = useState([]);
    const [consumedCalories, setConsumedCalories] = useState(0)


//const { entry_id } = useParams();

    const { id } = useParams()

    

    useEffect(() => {
        const fetchFoodEntries = async () => {
            if (!id) {
                console.error("No food entry available.");
                return;
            }

            try {
                const foodResponse = await fetch(`http://localhost:3000/food/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                const foodEntries = await foodResponse.json();
                setFoodEntries(foodEntries);

                const consumedCalories = foodEntries.reduce((total, entry) => total + entry.calories, 0)
                setConsumedCalories(consumedCalories)
            } catch (error) {
                console.error("Error fetching food data:", error);
            }
        };

        fetchFoodEntries();
    }, [id]);

    const handleFoodSubmit = async (e) => {
        e.preventDefault();

        if (!foodName || !calories) {
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setFoodName("");
            setCalories("");
        } catch (error) {
            console.error("Error submitting food entry:", error);
        }


    };

    const deleteFoodEntries = async (foodEntryId) => {
        console.log(foodEntryId)
        
    try {
        const response = await fetch(`http://localhost:3000/food/${foodEntryId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        console.log("Delete response:", response);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
        }

        // Update the state by filtering out the deleted entry
        setFoodEntries((prevFoodEntries) =>
            prevFoodEntries.filter((foodEntry) => foodEntry.id !== foodEntryId)
        );
    } catch (error) {
        console.error("Error deleting food entry:", error);
    }
};

const editFoodEntries = async (foodEntryId, updatedFoodName, updatedCalories) => {

        console.log(foodEntries, "all food entries");
           
        try {

            if (!foodEntryId) {
                console.error("Food entry ID is undefined.");
                return;
            }
            const payload = {
                food_name: updatedFoodName,
                calories: parseFloat(updatedCalories),
            };

            const response = await fetch(`http://localhost:3000/food/${foodEntryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setFoodEntries((prevFoodEntries) =>
            prevFoodEntries.map((foodEntry) =>
                foodEntry.entry_id === foodEntryId
                    ? { ...foodEntry, ...payload } // Update only the relevant fields
                    : foodEntry
            )
        );
        } catch (error) {
            console.log("Error updating food entry:", error)
        }
    }

//    const updateProgressBar = () => {
//         const percentage = (totalCalories / 2000) * 100;
//         return { width: `${percentage}%` };
//       };
    
//       const updateProgressBarColor = () => {
//         if (totalCalories < 500) {
//           return { backgroundColor: "#fff" }; 
//         } else if (totalCalories < 1000) {
//           return { backgroundColor: "#fff" }; 
//         } else if (totalCalories < 1500) {
//         } else {
//           return { backgroundColor: "#0e2853" }; // medical red
//         }
//       };
    return (
            <div className="weight-log-container">
                <h1>Food Entries</h1>
                <UserBMR consumedCalories={consumedCalories} foodEntries={foodEntries} />
                {foodEntries.map((foodEntry) => (
                    <FoodEntryCard
                        key={foodEntry.entry_id}
                        entry={foodEntry}
                        editFoodEntries={editFoodEntries}
                        deleteFoodEntries={deleteFoodEntries}
                    />
                ))}
       <form onSubmit={handleFoodSubmit} className="weight-log-form">
        <label>
          Food Name:
          <input
            type="text"
            value={foodName}
            placeholder="Enter Food"
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
            onChange={(e) => setCalories(parseInt(e.target.value, 10))}
            placeholder="Enter Calories"
            required
          />
        </label>
        <br />
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
}


export default FoodLog;