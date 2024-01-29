import { useParams } from 'react-router-dom';
import UserProfile from '../components/dashboard/UserProfile/UserProfile';
import ActivityReport from '../components/FeaturePage/ActivityFeature/ActivityReport';
import SideNav from "../components/dashboard/sidebar/SideNav";
function ActivityPage() {
  const { id: userId } = useParams();

  return (
      <div className="main-content">
        <ActivityReport userId={userId} />
        <UserProfile userId={userId} />
        <SideNav userId={userId}  />
      </div>
  );
}

export default ActivityPage;
