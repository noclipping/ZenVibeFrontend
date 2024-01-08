import ContentMain from './ContentMain';
import "./ProtectedPage.css"; 
import UserProfile from './UserProfile/UserProfile';




function ProtectedPage() {
  return (

    <div className="protected-page">
      <div className="dashboard-container">
        <ContentMain /> 
        <UserProfile />
      </div>
    </div>
  );
}

export default ProtectedPage;