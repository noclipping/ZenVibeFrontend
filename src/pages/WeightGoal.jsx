import { useParams } from 'react-router-dom'; // Import useParams
import WeightLog from '../components/FeaturePage/WeightLog/WeightLog';
import SideNav from '../components/dashboard/sidebar/SideNav';

function WeightGoal() {
    const { id } = useParams(); // Extract user ID from URL

    return (
        <div className="App">
            <WeightLog showInputs={true} />
            <SideNav userId={id} /> {/* Pass the extracted user ID */}
        </div>
    );
}

export default WeightGoal;
