import { useParams } from 'react-router-dom'; // Import useParams
import ReminderTrack from '../components/FeaturePage/ReminderTracker/ReminderTrack';
import SideNav from '../components/dashboard/sidebar/SideNav';

function ReminderPage() {
    const { id } = useParams(); // Extract user ID from URL

    return (
        <div className="App">
            <ReminderTrack/>
            <SideNav userId={id} /> {/* Pass the extracted user ID */}
        </div>
    );
}

export default ReminderPage;
