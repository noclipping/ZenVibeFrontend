import { useState, useEffect } from "react";
import ContentMain from "./ContentMain";
import UserProfile from "./UserProfile/UserProfile";
import SideNav from "./sidebar/SideNav";
import { useParams } from "react-router-dom";
import "./ProtectedPage.css";

function ProtectedPage() {
  const { id: userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched User Data:", data); // Log for debugging
        setUserData(data);
      } catch (e) {
        setError(`Failed to load user data: ${e.message}`);
      }
    };

    fetchUserData();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="protected-page">
      <div className="content-below-top-bar">
        {" "}
        {/* Add this class to your next content container */}
        <div className="top-bar">
          <div className="greeting-container">
            Welcome!<span className="username-animation">{userData.username}</span>
            , this is your view for today
          </div>
        </div>
        <SideNav userId={userId} />
        <ContentMain userId={userId} />
        <UserProfile userData={userData} />
      </div>
    </div>
  );
}
export default ProtectedPage;
