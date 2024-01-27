import { useState } from "react";

export default function FoodEntryCard({ entry, editFoodEntries, deleteFoodEntries }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedFoodName, setUpdatedFoodName] = useState(entry.food_name);
    const [updatedCalories, setUpdatedCalories] = useState(entry.calories);

    const handleUpdate = () => {
        editFoodEntries(entry.entry_id, updatedFoodName, updatedCalories);
        setIsEditing(false);
    };

    return (
        <div className="food-entry-card">
            {!isEditing ? (
                <div className="food-entry-display">
                    <p className="food-name">{entry.food_name}</p>
                    <p className="calories">{entry.calories} calories</p>
                    <button onClick={() => setIsEditing(true)}>✎ Edit</button>
                    <button onClick={() => deleteFoodEntries(entry.entry_id)}>❌ Delete</button>
                </div>
            ) : (
                <div className="food-entry-edit">
                    <input
                        placeholder="Enter Food"
                        value={updatedFoodName}
                        onChange={(e) => setUpdatedFoodName(e.target.value)}
                    />
                    <input
                        placeholder="Enter Calories"
                        value={updatedCalories}
                        onChange={(e) => setUpdatedCalories(e.target.value)}
                        type="number"
                    />
                    <button onClick={handleUpdate}>Update Food</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}
