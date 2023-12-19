import SideNav from "./sidebar/SideNav"; // Update with the correct path
import "./ProtectedPage.css"; // Your existing or new CSS file for ProtectedPage

function ProtectedPage() {
  return (
    <div className="protected-page">
      <SideNav />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-content">{/* Your content here */}</div>
      </div>
    </div>
  );
}

export default ProtectedPage;
