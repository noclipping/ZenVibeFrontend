import { useState } from "react";
import WeightLog from "../FeaturePage/WeightLog/WeightLog";
import ReminderTrack from "../FeaturePage/ReminderFeature/ReminderTrack";
import ActivityTrack from "../FeaturePage/ActivityFeature/ActivityReport";
import PropTypes from "prop-types";
import "./ContentMain.css";
import MoodLog from "../FeaturePage/MoodTracker/MoodLog";
import FoodLog from "../FeaturePage/Food/FoodLog";

const ContentMain = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const components = [
    <WeightLog showInputs={false} key="WeightLog" />,

    <MoodLog showInputs={false} key="MoodLog" />, // Add a comma here

    <ReminderTrack key="ReminderTrack" />,
    <ActivityTrack key="ActivityTrack" />,
    <FoodLog showInputs={false} key="FoodLog" />,
  ];

  const handleDropdownChange = (index) => {
    setActiveIndex(index);
    setShowDropdown(false); // Hide dropdown after selection
  };

  const renderComponent = () => {
    return components[activeIndex];
  };

  return (
    <div>
      <div
        className="search-container"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <input type="text" placeholder="Search views" readOnly />
        {showDropdown && (
          <ul className="dropdown-menu">
            <li onClick={() => handleDropdownChange(0)}>Weight Log</li>
            <li onClick={() => handleDropdownChange(1)}>Reminder Track</li>
            <li onClick={() => handleDropdownChange(1)}>Mood Log</li>
            <li onClick={() => handleDropdownChange(2)}>Activity Track</li>
            <li onClick={() => handleDropdownChange(4)}>Food Log</li>
          </ul>
        )}
      </div>
      <div className="main-content-holder">{renderComponent()}</div>
    </div>
  );
};

ContentMain.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ContentMain;
