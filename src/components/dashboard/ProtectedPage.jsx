import ContentMain from './ContentMain';
import "./ProtectedPage.css"; 
import UserProfile from './UserProfile/UserProfile';
import SideNav from './sidebar/SideNav';

function ProtectedPage() {
  return (

    <div className="protected-page">
      <div className="dashboard-container">
        <SideNav />
        <ContentMain /> 
        <UserProfile />
      </div>
    </div>
  );
}

export default ProtectedPage;