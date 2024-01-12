import ContentMain from './ContentMain';
import "./ProtectedPage.css";
import { useParams } from 'react-router-dom';
import UserProfile from './UserProfile/UserProfile';
import SideNav from './sidebar/SideNav';

function ProtectedPage() {
  const { id: userId } = useParams();

  return (
    <div className="protected-page">
      <div className="dashboard-container">
        <SideNav userId={userId} />
        <ContentMain />
        <UserProfile />
      </div>
    </div>
  );
}

export default ProtectedPage;
