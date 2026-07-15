import styles from './AboutUs.module.css'
import { Crown, Cpu, Workflow, PenTool } from "lucide-react";

const values = [
  {
    icon: '⚡',
    title: 'Speed',
    desc: 'We eliminate unnecessary waiting. From booking to consultation, every step is optimised for speed.'
  },
  {
    icon: '🔒',
    title: 'Privacy',
    desc: 'Your medical and personal data is handled with strict confidentiality and never shared with third parties.'
  },
  {
    icon: '💡',
    title: 'Simplicity',
    desc: 'Anyone with a smartphone can use MediToken. No complicated steps, no training required.'
  },
  {
    icon: '🤝',
    title: 'Trust',
    desc: 'We partner only with verified hospitals and clinics to ensure every booking leads to genuine care.'
  },
]

const stats = [
  { num: '2,400+', label: 'Patients served daily' },
  { num: '12+',    label: 'Departments covered' },
  { num: '4+',     label: 'Partner hospitals' },
  { num: '~18 min', label: 'Average wait time' },
]

const team = [
  {
    name: "Ananya",
    role: "Co-founder & CEO",
    icon: <Crown size={28} />
  },
  {
    name: "Krishnapriya",
    role: "Co-founder & CTO",
    icon: <Cpu size={28} />
  },
  {
    name: "Shadin",
    role: "Head of Operations",
    icon: <Workflow size={28} />
  },
  {
    name: "Claudy Chatty",
    role: "Head of Product Design",
    icon: <PenTool size={28} />
  }
];

export default function AboutUs({ onNav }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>ABOUT US</span>
          <h2 className={styles.heading}>Healthcare that works<br />around your time</h2>
          <p className={styles.sub}>
            MediToken was built to solve one of the most frustrating parts of healthcare —
            the waiting room. We believe your time is as valuable as your health.
          </p>
        </div>

        {/* Mission */}
        <div className={styles.mission}>
          <div className={styles.missionLeft}>
            <span className={styles.missionTag}>OUR MISSION</span>
            <h3 className={styles.missionHeading}>
              Connecting patients to doctors — faster, smarter, simpler.
            </h3>
            <p className={styles.missionText}>
              Founded in Kerala, MediToken is a smart healthcare token management system
              that lets patients book hospital appointments online, track their queue
              position in real time, and arrive only when it is their turn.
            </p>
            <p className={styles.missionText}>
              We work directly with hospitals and clinics to digitise their queuing
              systems — reducing patient wait times, improving hospital efficiency,
              and making healthcare more accessible for everyone.
            </p>
            <button className={styles.ctaBtn} onClick={() => onNav('book')}>
              Book a Token Now →
            </button>
          </div>
          <div className={styles.missionRight}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className={styles.valuesSection}>
          <div className={styles.sectionLabel}>
            <span className={styles.tag}>OUR VALUES</span>
            <h3 className={styles.sectionHeading}>What we stand for</h3>
          </div>
          <div className={styles.grid}>
            {values.map((v, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.iconBox}>{v.icon}</div>
                  <span className={styles.stepNum}>0{i + 1}</span>
                </div>
                <h3 className={styles.stepTitle}>{v.title}</h3>
                <p className={styles.stepDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={styles.teamSection}>
          <div className={styles.sectionLabel}>
            <span className={styles.tag}>OUR TEAM</span>
            <h3 className={styles.sectionHeading}>The people behind MediToken</h3>
          </div>
          <div className={styles.teamGrid}>
            {team.map((t, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{t.icon}</div>
                <div className={styles.teamName}>{t.name}</div>
                <div className={styles.teamRole}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <h3>Ready to skip the wait?</h3>
          <p>Join thousands of patients who book smarter with MediToken.</p>
          <div className={styles.ctaBtns}>
            <button className={styles.primaryBtn} onClick={() => onNav('book')}>
              Book a Token
            </button>
            <button className={styles.secondaryBtn} onClick={() => onNav('contact')}>
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}