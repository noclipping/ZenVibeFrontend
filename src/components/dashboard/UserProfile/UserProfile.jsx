import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './UserProfile.css'; // Ensure the path to your CSS file is correct

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [error, setError] = useState('');
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
          <p><span className="highlight">Username:</span> {userData.username}</p>
        <p><span className="highlight">Email:</span> {userData.email}</p>
          <p>Original Weight: {userData.original_weight} lbs</p>
          <p>Height: {userData.feet}&apos;{userData.inches}&quot; ({userData.height_inches} inches)</p>
          <p>Age: {userData.age}</p>
          <p>Goal Weight: {userData.goal_weight} lbs</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
