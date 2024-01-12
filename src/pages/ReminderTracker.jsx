import { useParams } from 'react-router-dom';
import ReminderTrack from "../components/FeaturePage/ReminderFeature/ReminderTrack";
import UserProfile from '../components/dashboard/UserProfile/UserProfile';

function ReminderTracker() {
  const { id: userId } = useParams();

  return (
      <div className="main-content">
        <ReminderTrack userId={userId} />
        <UserProfile userId={userId} />
      </div>
  );
}

export default ReminderTracker;
