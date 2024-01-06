import WeightGoal from "../../pages/WeightGoal";
import "./ContentMain.css";
import UserProfile from "./UserProfile/UserProfile";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <div className="chart-container">
        <WeightGoal />
        <UserProfile />
      </div>
      {/* Additional components or placeholders can go here if needed */}
    </div>
  );
};

export default ContentMain;
