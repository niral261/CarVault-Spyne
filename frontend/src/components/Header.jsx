import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';

const Header = () => {
  const { user } = useUser();
  const [hoveredLink, setHoveredLink] = useState(null); // Track the hovered link

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#000000', // Black background
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffffff', // White text for the logo
    textDecoration: 'none',
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const navLinkStyle = {
    color: '#ffffff', // White text for links
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const navLinkHoverStyle = {
    color: '#e91e63', // Highlight color on hover (Persian Blue)
  };

  return (
    <header style={headerStyle}>
      <Link to="/myproducts" style={logoStyle}>
        CarVault
      </Link>

      <nav style={navLinksStyle}>
        <Link
          to="/myproducts"
          style={hoveredLink === 'mycars' ? { ...navLinkStyle, ...navLinkHoverStyle } : navLinkStyle}
          onMouseEnter={() => setHoveredLink('mycars')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          My Cars
        </Link>
        <Link
          to="/create-product"
          style={hoveredLink === 'publishcar' ? { ...navLinkStyle, ...navLinkHoverStyle } : navLinkStyle}
          onMouseEnter={() => setHoveredLink('publishcar')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Publish Car
        </Link>

        {user && <UserButton />}
      </nav>
    </header>
  );
};

export default Header;
