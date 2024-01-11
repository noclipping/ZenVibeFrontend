import { useParams } from 'react-router-dom';
import ReminderTrack from '../components/FeaturePage/ReminderTracker/ReminderTrack';
import SideNav from '../components/dashboard/sidebar/SideNav';
import UserProfile from '../components/dashboard/UserProfile/UserProfile';

function ReminderPage() {
    const { id } = useParams();
    console.log("User ID in ReminderPage:", id);

    return (
        <div className="App">
            <ReminderTrack userId={id} />
            <SideNav userId={id} />
            <UserProfile/>
        </div>
    );
}

export default ReminderPage;
