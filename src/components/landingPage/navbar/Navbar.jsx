import logo from '../../../../assets/zenvibe.png';

function Navbar() {
    return (
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <h1>ZenVibe</h1>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#docs">Docs</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#reviews">Reviews</a></li>
        </ul>
        <button className="zen-vibe-btn">Zen Vibe+</button>
      </nav>
    );
  }

  export default Navbar;

