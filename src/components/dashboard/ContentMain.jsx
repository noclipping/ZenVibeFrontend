import { useState, useEffect } from 'react';
import WeightLog from "../FeaturePage/WeightLog/WeightLog";
import ReminderTrack from "../FeaturePage/ReminderFeature/ReminderTrack";
import ActivityTrack from "../FeaturePage/ActivityFeature/ActivityReport";
import PropTypes from 'prop-types';
import "./ContentMain.css";

const ContentMain = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = 'hidden';

    // Enable scrolling back when the component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

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
          placeholder="Search views"
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

ContentMain.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ContentMain;
