import ContentMain from './ContentMain';
import "./ProtectedPage.css"; 


function ProtectedPage() {
  return (

    <div className="protected-page">
      <div className="dashboard-container">
        <ContentMain /> {}
      </div>
    </div>
  );
}

export default ProtectedPage;