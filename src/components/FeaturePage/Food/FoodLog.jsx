import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "../../FeaturePage/Food/FoodLog.css";

function FoodLog() {
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState(0);
    const [foodEntries, setFoodEntries] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0)
    const { entry_id } = useParams();
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

                const totalCalories = foodEntries.reduce((total, entry) => total + entry.calories, 0)
                setTotalCalories(totalCalories)
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

    const handleDelete = async (foodEntryId) => {
        try {
            //   console.log("Deleting entry with ID:", entry_id);
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

            setFoodEntries((prevEntries) => prevEntries.filter(entry => entry.entry_id!== foodEntryId));
            console.log("Deletion successful");
        } catch (error) {
            console.error("Error deleting food entry:", error);
        }
    };



    return (
        <div className="weight-log-container">
            <div>
                <h3>Food Log</h3>
                <p>Total Daily Calories: {totalCalories}</p>
                {foodEntries.map((entry, index) => {
                    console.log(entry, "ENTRY")
                    return (
                        <div key={index}>
                            <p>{entry.foodEntryId}</p>
                            <p>Food Name: {entry.food_name}</p>
                            <p>Calories: {entry.calories}</p>
                            <button type="button">Update Food</button>
                            <button type="button" onClick={() => handleDelete(entry.entry_id)}>Delete</button>
                        </div>
                    )
                })}
            </div>

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
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="Enter Calories"
                        required
                    />
                </label>
                <br />
                <button type="submit" onSubmit={handleDelete}>Add Food</button>


            </form>
        </div>
    );
}

export default FoodLog;
