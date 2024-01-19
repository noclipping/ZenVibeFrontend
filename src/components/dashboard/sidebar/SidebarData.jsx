// SidebarData.jsx
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { FaBolt } from 'react-icons/fa';
import { FaSmile } from 'react-icons/fa';

export const getSidebarData = (userId) => [
    {
        title: 'Dashboard Overview',
        path: `/protected/${userId}`,
        icon: <AiIcons.AiFillHome />, // Icon for home/dashboard
        cName: 'nav-text'
    },
    {
        title: 'Weight Goal',
        path: `/weight-goal/${userId}`,
        icon: <FaIcons.FaBalanceScale />, // Icon representing a scale for weight
        cName: 'nav-text'
    },
    {
        title: 'Reminders',
        path: `/reminders/${userId}`,
        icon: <AiIcons.AiOutlineBell />, // Icon for reminders/notifications
        cName: 'nav-text'
    },
    {
        title: 'Mood Tracker',
        path: `/protected/${userId}`,
        icon: <FaSmile />, // Using a smiley face icon to symbolize mood tracking
        cName: 'nav-text'
    },
    {
        title: 'Activity Report',
        path: `/activity/${userId}`,
        icon: <FaIcons.FaRunning />, // Icon representing physical activity
        cName: 'nav-text'
    },
    {
        title: 'Ask Zen',
        path: `/chat/${userId}`,
        icon: <FaBolt />, // Using a lightning bolt icon to symbolize energy or power
        cName: 'nav-text'
    },
    {
      title: 'Food Log',
      path: `/food/${userId}`,
      icon: <FaIcons.FaUtensils />,
      cName: 'nav-text'
    },
    {
        title: 'Settings',
        path: `/settings/${userId}`,
        icon: <AiIcons.AiFillSetting />, // Icon for settings
        cName: 'nav-text'
    }
    // Add more items as needed
];

