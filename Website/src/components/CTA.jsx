import styles from './CTA.module.css'

export default function CTA({ onBook }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.tag}>READY TO BEGIN?</span>
        <h2 className={styles.heading}>
          Your doctor is waiting.<br />
          <em>Are you?</em>
        </h2>
        <p className={styles.sub}>Join thousands of patients who've already made hospital visits stress-free with MediToken.</p>
        <button className={styles.btn} onClick={onBook}>Book My Token Now →</button>
      </div>
    </section>
  )
}
