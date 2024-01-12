// SideNav.jsx
import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSidebarData } from './SidebarData'; // Adjust the import path as needed
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import logo from '../../../../assets/zenvibe.png'; // Update the path to your logo
import './SideNav.css';

function SideNav({ userId }) {
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(true);
    const sidebarData = getSidebarData(userId);

    const showSidebar = () => setSidebar(!sidebar);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to log out');
            navigate('/login');
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <div className='sidenav'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <div className='nav-menu-header'>
                        <img src={logo} alt='ZenVibe Logo' className='sidebar-logo' />
                        <h2>ZenVibe</h2>
                    </div>
                    {sidebarData.map((item, index) => (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    <li className='nav-text'>
                        <Link to='#' onClick={handleLogout}>
                            <FaIcons.FaSignOutAlt />
                            <span>Sign Out</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </IconContext.Provider>
    );
}

SideNav.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default SideNav;
