import WeightLog from "../FeaturePage/WeightLog/WeightLog";
import "./ContentMain.css";
import ReminderTrack from "../FeaturePage/ReminderFeature/ReminderTrack";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <div className="chart-container">
        <WeightLog showInputs={false} />
      </div>
      <div className="chart-container">
        <ReminderTrack />
      </div>
      {/* Additional components can be added here */}
    </div>
  );
};

export default ContentMain;
