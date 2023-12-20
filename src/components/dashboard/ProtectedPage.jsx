import ContentMain from './ContentMain'; // Import ContentMain
import SideNav from "./sidebar/SideNav"; // Update with the correct path
import "./ProtectedPage.css"; // Your existing or new CSS file for ProtectedPage


function ProtectedPage() {
  return (
    <div className="protected-page">
      <SideNav />
      <div className="dashboard-container">
        <ContentMain /> {/* Include ContentMain component here */}
      </div>
    </div>
  );
}

export default ProtectedPage;