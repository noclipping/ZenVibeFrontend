import { useState } from 'react';
import WeightLog from "../FeaturePage/WeightLog/WeightLog";
import ReminderTrack from "../FeaturePage/ReminderFeature/ReminderTrack";
import ActivityTrack from "../FeaturePage/ActivityFeature/ActivityReport";
import "./ContentMain.css";

const ContentMain = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Determine which components to render based on the search term
  const renderComponents = () => {
    if (searchTerm === "weight") {
      return <WeightLog showInputs={false} />;
    } else if (searchTerm === "reminders") {
      return <ReminderTrack />;
    } else if (searchTerm === "activity") {
      return <ActivityTrack />;
    } else {
      return (
        <>
          <WeightLog showInputs={false} />
          <ReminderTrack />
          <ActivityTrack />
        </>
      );
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          value={searchTerm}
        />
      </div>
      <div className="main-content-holder">
        {renderComponents()}
      </div>
    </div>
  );
};

export default ContentMain;

