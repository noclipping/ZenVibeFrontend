// SidebarData.jsx
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const getSidebarData = (userId) => [
    {
        title: 'Dashboard Overview',
        path: `/protected/${userId}`,
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Weight Goal',
        path: `/weight-goal/${userId}`,
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Reminders',
        path: `/reminders/${userId}`,
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Activity Report',
        path: `/activity/${userId}`,
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Settings',
        path: `/settings/${userId}`,
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
    // You can add more items here as needed.
];

// Export this function to use it in your SideNav component to generate dynamic links.
