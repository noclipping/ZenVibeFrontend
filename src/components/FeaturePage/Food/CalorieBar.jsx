import React, { useState } from "react";


export default function CalorieBar({totalCalories, }) {






  return (
    <div className="progress-bar" style={{ ...updateProgressBar(), ...updateProgressBarColor() }}>
      {totalCalories}
      <div>
        <p>Daily Target Calories:</p>
        <p>Consumed Calories:</p>
        <p>Remaining Daily Calories:</p>
      </div>
    </div>
  );
}
