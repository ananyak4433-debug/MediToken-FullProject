import styles from './Footer.module.css'

export default function Footer({ onNav }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img src='/logo3.jpeg' alt='logo' width={'250px'}></img>
          <p className={styles.tagline}>Trusted digital healthcare solutions for patients and hospitals across Kerala.</p>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>QUICK LINKS</p>
          <button onClick={() => onNav('home')}>Home</button>
          <button onClick={() => onNav('book')}>Book Token</button>
          <button onClick={() => onNav('track')}>Track Status</button>
          <button onClick={() => onNav('departments')}>Departments</button>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>DEPARTMENTS</p>
          <button onClick={() => onNav('book', 'Cardiology')}>Cardiology</button>
          <button onClick={() => onNav('book', 'Orthopaedics')}>Orthopaedics</button>
          <button onClick={() => onNav('book', 'General OPD')}>General OPD</button>
          <button onClick={() => onNav('book', 'Paediatrics')}>Paediatrics</button>
          <button onClick={() => onNav('book', 'Neurology')}>Neurology</button>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>COMPANY</p>
          <button onClick={() => onNav('about')}>About Us</button>
          <button onClick={() => onNav('hospitals')}>Hospitals</button>
          <button onClick={() => onNav('contact')}>Contact Us</button>
          <button onClick={() => onNav('faq')}>FAQ</button>
        </div>

        {/* <div className={styles.col}>
          <p className={styles.colTitle}>SUPPORT</p>
          <span>Help Centre</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Us</span>
        </div> */}
      </div>

      <div className={styles.bottom}>
        <p>© 2025 MediToken. All rights reserved.</p>
      </div>
    </footer>
  )
}
