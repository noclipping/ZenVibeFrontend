import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css'; // Ensure this path is correct

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isIntermediateVisible, setIsIntermediateVisible] = useState(false);
  const [isFullProfileVisible, setIsFullProfileVisible] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
      } catch (e) {
        setError(`Failed to load user data: ${e.message}`);
      }
    };

    fetchUserData();
  }, [id]);

  const toggleIntermediateModal = () => {
    setIsIntermediateVisible(!isIntermediateVisible);
  };

  const toggleFullProfileModal = () => {
    setIsFullProfileVisible(!isFullProfileVisible);
    setIsIntermediateVisible(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <img
        src="../../../../assets/default_img.webp" // Replace with the actual image source
        alt="Profile"
        className="profile-pic-btn"
        onClick={toggleIntermediateModal}
      />
      {isIntermediateVisible && (
        <div className="intermediate-modal">
          <button onClick={toggleFullProfileModal} className="option-btn">
            View Profile
          </button>
          {/* Additional buttons like 'Settings' can be added here */}
        </div>
      )}
      {isFullProfileVisible && (
        <div className="full-profile-modal" onClick={toggleFullProfileModal}>
          <div className="profile-modal-content">
            <div className="profile-modal-row">
              <span className="profile-modal-label">Username:</span>
              <span className="profile-modal-value">{userData.username}</span>
            </div>
            <div className="profile-modal-row">
              <span className="profile-modal-label">Original Weight:</span>
              <span className="profile-modal-value">{userData.original_weight} lbs</span>
            </div>
            <div className="profile-modal-row">
              <span className="profile-modal-label">Height:</span>
              <span className="profile-modal-value">
                {userData.feet}&apos;{userData.inches}&quot; ({userData.height_inches} inches)
              </span>
            </div>
            <div className="profile-modal-row">
              <span className="profile-modal-label">Age:</span>
              <span className="profile-modal-value">{userData.age}</span>
            </div>
            <div className="profile-modal-row">
              <span className="profile-modal-label">Goal Weight:</span>
              <span className="profile-modal-value">{userData.goal_weight} lbs</span>
            </div>
            {/* You can add more user details here if needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;