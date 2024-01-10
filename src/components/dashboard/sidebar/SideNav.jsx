// SideNav.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import logo from "../../../../assets/zenvibe.png"; // Update the path as necessary
import "./SideNav.css";

function SideNav() {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  const handleLogout = async () => {
    // Attempt to log out by sending a request to the backend
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include", // Required to include the HTTP-only cookie
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      // Clear any client-side storage here if used (e.g., localStorage, sessionStorage)
      // localStorage.removeItem('userToken'); // Uncomment if you use localStorage

      // Redirect to the login page or any other public page
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
      // Handle logout errors (show an error message to the user, log the error, etc.)
    }
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="sidenav">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <div className="nav-menu-header">
              <img src={logo} alt="ZenVibe Logo" className="sidebar-logo" />
              <h2>ZenVibe</h2> {/* Name next to the logo */}
            </div>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            {/* Add Sign Out button */}
            <li className="nav-text">
              <Link to="#" onClick={handleLogout}>
                <FaIcons.FaSignOutAlt />
                <span>Sign Out</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default SideNav;
