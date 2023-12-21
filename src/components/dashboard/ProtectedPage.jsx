import ContentMain from './ContentMain';
import SideNav from "./sidebar/SideNav"; 
import "./ProtectedPage.css"; 


function ProtectedPage() {
  return (

    <div className="protected-page">
      <SideNav />
      <div className="dashboard-container">
        <ContentMain /> {}
      </div>
    </div>
  );
}

export default ProtectedPage;