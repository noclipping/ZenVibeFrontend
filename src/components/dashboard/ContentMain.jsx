import './ContentMain.css'; // Your CSS file for styling

const ContentMain = () => {
  return (
    <div className="main-content-holder">
        <div className="content-grid-one">
            <div className="placeholder">Health Metrics Placeholder</div>
            <div className="placeholder">Goal Tracker Placeholder</div>
            <div className="placeholder">Progress Report Placeholder</div>
        </div>
        <div className="content-grid-two">
            <div className="placeholder">Diet Plan Placeholder</div>
            <div className="grid-two-item">
              <div className="subgrid-two">
                <div className="placeholder">Exercise Routine Placeholder</div>
                <div className="placeholder">User Settings Placeholder</div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default ContentMain;
