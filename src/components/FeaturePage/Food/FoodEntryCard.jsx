import { useState } from "react";

export default function FoodEntryCard({
    entry,
    editFoodEntries,
    deleteFoodEntries
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [updatedFoodName, setUpdatedFoodName] = useState("");
    const [updatedCalories, setUpdatedCalories] = useState(0);

    return (
        <div>
            {!isEditing ? (
                <div>
                    <h3>Food Entry</h3>
                    <p>Food Name: {entry.food_name}</p>
                    <p>Calories: {entry.calories}</p>
                </div>
            ) : (
                <div>
                    <input
                        placeholder="Enter Food"
                        onChange={(e) => {
                            setUpdatedFoodName(e.target.value)
                        }}
                    />
                    <input
                        placeholder="Enter Calories"
                        onChange={(e) => {
                            setUpdatedCalories(e.target.value)
                        }}
                    />
                    <button
                        onClick={(e) => {
                            editFoodEntries(entry.entry_id, updatedFoodName, updatedCalories)
                            setIsEditing(!isEditing)
                           
                        }}
                    > Update Food
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel
                    </button>
                </div>
            )}

            <button
                onClick={() => {
                    setIsEditing(!isEditing)
                }}
            >
                Edit Food
            </button>
            <button
                onClick={() => {
                    deleteFoodEntries(entry.entry_id)
                }}
            >
                Delete
            </button>
        </div>
    );
}    
