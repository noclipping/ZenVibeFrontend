import { useParams } from 'react-router-dom'; // Import useParams
import WeightLog from '../components/FeaturePage/WeightLog/WeightLog';
import SideNav from '../components/dashboard/sidebar/SideNav';
import UserProfile from '../components/dashboard/UserProfile/UserProfile';

function WeightGoal() {
    const { id } = useParams(); // Extract user ID from URL

    return (
        <div className="App">
            <WeightLog showInputs={true} />
            <SideNav userId={id} /> {/* Pass the extracted user ID */}
            <UserProfile/>
        </div>
    );
}

export default WeightGoal;
