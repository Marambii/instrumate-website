import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoArrowUpRight, GoChevronDown } from 'react-icons/go';
import { gsap } from 'gsap';
import './CardNav.css';

interface CardNavLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface CardNavItem {
  label: string;
  bgColor: string; // Retained if you want to color code dots/dropdown elements
  textColor: string;
  links: CardNavLink[];
}

interface CardNavProps {
  items: CardNavItem[];
  logoAlt?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  items,
  logoAlt = 'Instrumate',
  buttonBgColor = '#5E3BEE',
  buttonTextColor = '#fff'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navInnerRef = useRef<HTMLElement>(null);

  // Monitor scroll behavior to trigger morph state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animation smooth morph transitions when state changes
  useLayoutEffect(() => {
    if (!navInnerRef.current) return;

    if (isScrolled) {
      // Morphing into floating fixed header style
      gsap.to(navInnerRef.current, {
        maxWidth: '900px',
        borderRadius: '2rem',
        padding: '0.5rem 1.5rem',
        boxShadow: '0 10px 30px rgba(45, 26, 74, 0.08)',
        backgroundColor: '#ffffff',
        duration: 0.4,
        ease: 'power2.out'
      });
    } else {
      // Morphing back to full inline/natural layout
      gsap.to(navInnerRef.current, {
        maxWidth: '1200px',
        borderRadius: '0px',
        padding: '1.2rem 2rem',
        boxShadow: '0 0px 0px rgba(0,0,0,0)',
        backgroundColor: 'transparent',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isScrolled]);

  return (
    <div ref={navContainerRef} className={`nav-wrapper ${isScrolled ? 'scrolled' : 'at-top'}`}>
      <nav ref={navInnerRef} className="main-navbar">
        
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="nav-logo">
            {logoAlt}
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown(idx)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-dropdown-trigger">
                {item.label} <GoChevronDown className={`chevron-icon ${activeDropdown === idx ? 'rotate' : ''}`} />
              </button>
              
              <div className={`nav-dropdown-menu ${activeDropdown === idx ? 'visible' : ''}`}>
                {item.links.map((lnk, i) => (
                  <Link key={i} className="dropdown-link-item" to={lnk.href}>
                    <span>{lnk.label}</span>
                    <GoArrowUpRight className="link-arrow" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Standalone Direct Team Link */}
          <Link to="/team" className="nav-dropdown-trigger" style={{ textDecoration: 'none' }}>
            Team
          </Link>
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="nav-actions">
          <Link to='/SignUp' className="card-nav-cta-button" style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
            Join Us
          </Link>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className={`burger-line ${mobileMenuOpen ? 'open-line-1' : ''}`} />
            <div className={`burger-line ${mobileMenuOpen ? 'open-line-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? 'active' : ''}`}>
          {items.map((item, idx) => (
            <div key={idx} className="mobile-drawer-section">
              <h4 className="mobile-section-title">{item.label}</h4>
              <div className="mobile-section-links">
                {item.links.map((lnk, i) => (
                  <Link key={i} to={lnk.href} onClick={() => setMobileMenuOpen(false)}>
                    {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          {/* Mobile Team Section Link */}
          <div className="mobile-drawer-section">
            <div className="mobile-section-links">
              <Link to="/team" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>
                Team
              </Link>
            </div>
          </div>
        </div>

      </nav>
    </div>
  );
};

export default CardNav;