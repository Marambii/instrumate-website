import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import './CardNav.css';

interface CardNavLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

interface CardNavProps {
  items: CardNavItem[];
  logoAlt?: string;
  baseColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  items,
  logoAlt = 'Instrumate',
  baseColor = '#FAF9F6',
  buttonBgColor = '#5E3BEE',
  buttonTextColor = '#fff'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!navRef.current) return;

    const tl = gsap.timeline({ paused: true });
    
    tl.to(navRef.current, {
      height: window.innerWidth < 768 ? 'auto' : 320,
      duration: 0.4,
      ease: "power3.out"
    });

    tl.to(cardsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.2");

    tlRef.current = tl;
    return () => { tl.kill(); };
  }, [items]);

  const toggleMenu = () => {
    if (!tlRef.current) return;
    if (!isExpanded) {
      setIsExpanded(true);
      tlRef.current.play();
    } else {
      tlRef.current.reverse().eventCallback("onReverseComplete", () => {
        setIsExpanded(false);
      });
    }
  };

  return (
    <div className="card-nav-container">
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-line transition-all ${isExpanded ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`hamburger-line transition-all ${isExpanded ? '-rotate-45 -translate-y-0.5' : ''}`} />
          </div>

          <div className="logo-container">
            {/* --- UPDATED: Logo is now a Link to Home --- */}
            <Link 
              to="/" 
              className="font-[800] text-[#2D1A4A] text-xl tracking-tighter hover:text-[#5E3BEE] transition-colors duration-300 no-underline"
            >
              {logoAlt}
            </Link>
          </div>

          <Link to='/SignUp' className="card-nav-cta-button" style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
            Join Us
          </Link>
        </div>

        <div className={`card-nav-content ${isExpanded ? 'flex' : 'hidden'}`}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="nav-card"
              ref={(el) => { cardsRef.current[idx] = el; }}
              style={{ backgroundColor: item.bgColor, color: item.textColor, opacity: 0, transform: 'translateY(30px)' }}
            >
              <div className="nav-card-label font-bold text-xl">{item.label}</div>
              <div className="nav-card-links">
                {item.links.map((lnk, i) => (
                  <Link key={i} className="nav-card-link" to={lnk.href} onClick={toggleMenu}>
                    <GoArrowUpRight /> {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;