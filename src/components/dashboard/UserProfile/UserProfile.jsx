import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css"; // Ensure the path to your CSS file is correct

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include", // or specify other credentials mode
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

  const toggleProfileModal = () => {
    setIsProfileVisible(!isProfileVisible);
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
        src="../../../../assets/zenvibe.png" // Replace with the actual image source
        alt="Profile"
        className="profile-pic-btn"
        onClick={toggleProfileModal}
      />
      {isProfileVisible && (
        <div className="profile-modal">
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
          {/* Add more rows as needed */}
        </div>
      )}
    </div>
  );
  
}

export default UserProfile;
