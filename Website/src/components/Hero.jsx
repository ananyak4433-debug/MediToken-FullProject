
import styles from './Hero.module.css'
import heroImg from '/hero-image.jpeg' // adjust path

export default function Hero({ onNav }) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Real-time queue management
          </div>

          <h1 className={styles.heading}>
            Skip the wait,<br />
            <em>not the care.</em>
          </h1>

          <p className={styles.sub}>
            Book your hospital token online, track your queue position in real time,
            and arrive only when it's your turn. Healthcare made effortless.
          </p>

          <div className={styles.ctas}>
            <button className={styles.primaryBtn} onClick={() => onNav('book')}>
              Book a Token Now
            </button>
            <button className={styles.secondaryBtn} onClick={() => onNav('track')}>
              Track My Token
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <img src={heroImg} alt="hero" className={styles.image} />
        </div>
      </div>

      {/* STATS (reuse yours) */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>2,400+</span>
          <span className={styles.statLabel}>Patients served daily</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>~18 min</span>
          <span className={styles.statLabel}>Average wait time</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>12 depts</span>
          <span className={styles.statLabel}>Available now</span>
        </div>
      </div>
    </section>
  )
}