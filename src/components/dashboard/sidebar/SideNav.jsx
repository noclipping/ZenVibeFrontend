// SideNav.jsx
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSidebarData } from './SidebarData'; // Adjust the import path as needed
import * as FaIcons from 'react-icons/fa';
import logo from '../../../../assets/zenvibe.png'; // Update the path to your logo
import './SideNav.css';

function SideNav({ userId }) {
    const navigate = useNavigate();
    const sidebarData = getSidebarData(userId);

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
        <nav className='nav-menu active'> {/* Always active */}
            <ul className='nav-menu-items'>
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
    );
}

SideNav.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default SideNav;
