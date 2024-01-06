import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  // Retrieve the user's ID from session storage. Ensure it's set there during the login process.
  let { id } = useParams();

  useEffect(() => {
    console.log(id);
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          credentials: "include", // Necessary for including the HTTP-only cookie
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [id]); // Rerun when userId changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <p>Original Weight: {userData.original_weight} lbs</p>
      <p>
        Height: {userData.feet}&apos; {userData.inches}&quot; (
        {userData.height_inches} inches)
      </p>
      <p>Age: {userData.age}</p>
      <p>Goal Weight: {userData.goal_weight} lbs</p>
    </div>
  );
}

export default UserProfile;
