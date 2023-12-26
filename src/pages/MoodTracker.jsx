import MoodLog from "../components/FeaturePage/MoodTracker/MoodLog";
import SideNav from "../components/dashboard/sidebar/SideNav";


function MoodTracker() {
    return (
        <div className="App">
            <SideNav/>
            <MoodLog/>
        </div>
    );
}

export default MoodTracker;