
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import styles from './Navbar.module.css'
import { jwtDecode } from 'jwt-decode';

export default function Navbar({ onNav, activePage }) {
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'How it works', page: 'how' },
    { label: 'Departments', page: 'departments' },
    // { label: 'Track Token', page: 'track' },
  ]

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      setMenuOpen(false);
      onNav('home');
    } else {
      console.error(res.message);
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* LOGO */}
          <img src='/logo3-bg.png' alt='logo' width={'250px'} />

          {/* NAV LINKS */}
          <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            {navLinks.map(l => (
              <button
                key={l.page}
                className={`${styles.link} ${activePage === l.page ? styles.active : ''}`}
                onClick={() => { onNav(l.page); setMenuOpen(false) }}
              >
                {l.label}
              </button>
            ))}

            {/* 👇 My Bookings — mobile, only when logged in */}
            {/* {user && (
              <button
                className={`${styles.link} ${activePage === 'my-bookings' ? styles.active : ''}`}
                onClick={() => { onNav('my-bookings'); setMenuOpen(false) }}
              >
                My Bookings
              </button>
            )} */}
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>

            <button
              className={styles.trackBtn}
              onClick={() => onNav('track')}
            >
              Track Status
            </button>

            {/* 👇 My Bookings — desktop, only when logged in */}
            {user && (
              <button
                className={`${styles.trackBtn} ${activePage === 'my-bookings' ? styles.active : ''}`}
                onClick={() => onNav('my-bookings')}
              >
                My Bookings
              </button>
            )}

            {/* USER LOGGED IN */}
            {user ? (
              <div className={styles.patientMenu}>
                <div className={styles.avatar}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className={styles.patientName}>
                  {user.name?.split(' ')[0]}
                </span>
                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className={styles.bookBtn}
                onClick={() => setShowAuth(true)}
              >
                Login
              </button>
            )}

            {/* BOOK TOKEN */}
            <button
              className={styles.bookBtn}
              onClick={() => onNav('book')}
            >
              Book a Token
            </button>

          </div>

          {/* MOBILE MENU */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>

        </div>
      </nav>

      {/* AUTH MODAL */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </>
  )
}