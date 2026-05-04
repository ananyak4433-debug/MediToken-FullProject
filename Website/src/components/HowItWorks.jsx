import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '01',
    icon: '🏥',
    title: 'Choose department & doctor',
    desc: 'Select from 12 specialties. See real-time availability and estimated wait times before you book.',
  },
  {
    num: '02',
    icon: '📋',
    title: 'Enter your details & confirm',
    desc: 'Fill in your basic information, pick a convenient time slot, and confirm your booking instantly.',
  },
  {
    num: '03',
    icon: '📍',
    title: 'Track your token live',
    desc: 'Watch your queue position update in real time. Arrive at the hospital only when you\'re about to be called.',
  },
  {
    num: '04',
    icon: '✅',
    title: 'Walk in & consult',
    desc: 'Show your token number at the counter and proceed directly to your doctor. Zero waiting room time.',
  },
]

export default function HowItWorks({ onNav }) {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>HOW IT WORKS</span>
          <h2 className={styles.heading}>Appointment in<br />three simple steps</h2>
          <p className={styles.sub}>No phone calls, no standing in queues. Book from your phone and walk in at the right time.</p>
        </div>

        <div className={styles.grid}>
          {steps.map((step, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>{step.icon}</div>
                <span className={styles.stepNum}>{step.num}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
