import styles from './WhyMediToken.module.css'

const features = [
  {
    icon: '⚡',
    title: 'Instant confirmation',
    desc: 'Your token is issued in seconds. No waiting on hold or visiting the hospital just to register.',
  },
  {
    icon: '📡',
    title: 'Live queue tracking',
    desc: 'See exactly how many patients are ahead of you. Get notified when it\'s almost your turn.',
  },
  {
    icon: '🔒',
    title: 'Secure & private',
    desc: 'Your health data is encrypted and never shared. Full compliance with healthcare privacy standards.',
  },
  {
    icon: '📱',
    title: 'Works on any device',
    desc: 'No app download needed. Access MediToken from your phone, tablet, or computer instantly.',
  },
]

export default function WhyMediToken() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>WHY MEDITOKEN</span>
          <h2 className={styles.heading}>Built for patients,<br />trusted by hospitals</h2>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconBox}>{f.icon}</div>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
