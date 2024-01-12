import WeightLog from "../FeaturePage/WeightLog/WeightLog";
import MoodLog from "../FeaturePage/ReminderFeature/ReminderTrack";
import "./ContentMain.css";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <div className="chart-container">
        <WeightLog showInputs={false} />
      </div>
      <div className="chart-container">
        <MoodLog />
      </div>
      {/* Additional components can be added here */}
    </div>
  );
};

export default ContentMain;
