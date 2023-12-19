import './SideNav.css';


function SideNav() {
    const navigationLinks = [
        { id: 1, title: 'Home'},
        { id: 2, title: 'Budget' },
        { id: 3, title: 'Transactions' }, // Replace with actual image
        { id: 4, title: 'Subscriptions'}, // Replace with actual image
        // ... more links ...
    ];

    return (
        <div className="side-nav">
            <ul className="nav-links">
                {navigationLinks.map(link => (
                    <li key={link.id} className="nav-item">
                        <img src={link.image} alt={link.title} className="nav-icon" />
                        <span className="nav-title">{link.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SideNav;
