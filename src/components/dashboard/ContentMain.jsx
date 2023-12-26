import WeightGoal from "../../pages/WeightGoal";
import "./ContentMain.css";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <div className="chart-container">
        <WeightGoal />

      </div>
      {/* Additional components or placeholders can go here if needed */}
    </div>
  );
};

export default ContentMain;
