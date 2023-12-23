import WeightLog from "../components/FeaturePage/WeightLog/WeightLog";
import SideNav from "../components/dashboard/sidebar/SideNav";


function WeightGoal() {
    return (
        <div className="App">
            <WeightLog />
            <SideNav/>
        </div>
    );
}

export default WeightGoal;