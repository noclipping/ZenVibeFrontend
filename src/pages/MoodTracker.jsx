import MoodLog from "../components/FeaturePage/MoodTracker/MoodLog";
import UserProfile from "../components/dashboard/UserProfile/UserProfile";
import SideNav from "../components/dashboard/sidebar/SideNav";
import { useParams } from 'react-router-dom';


function MoodTracker() {
    const { id: userId } = useParams();
    return (
        <div className="App">
            <SideNav userId={userId}/>
            <MoodLog userId={userId}/>
            <UserProfile/>
        </div>
    );
}

export default MoodTracker;