import { useState } from 'react'
import styles from './FAQ.module.css'

const faqs = [
  {
    category: 'Booking',
    icon: '📋',
    questions: [
      {
        q: 'How do I book a token?',
        a: 'Click "Book a Token" from the home page, choose your department and doctor, select a time slot, fill in your details and confirm. You will receive a token number instantly.'
      },
      {
        q: 'Can I book a token for someone else?',
        a: 'Yes. In Step 3 (Your Details), you can edit the patient name, age and gender to book on behalf of a family member or friend.'
      },
      {
        q: 'How far in advance can I book?',
        a: 'You can book for any available day that your chosen doctor is available. Available days are shown in the booking flow.'
      },
      {
        q: 'Is there a fee to book a token?',
        a: 'No. Booking a token on MediToken is completely free. Consultation fees are paid directly at the hospital.'
      },
    ]
  },
  {
    category: 'Token & Queue',
    icon: '🎫',
    questions: [
      {
        q: 'What is a token number?',
        a: 'A token number is your unique queue position for a specific doctor and time slot. It tells the hospital counter in what order to call patients.'
      },
      {
        q: 'How do I track my token?',
        a: 'Click "Track My Token" in the navbar, enter your Appointment ID (given after booking), and you will see your current queue position in real time.'
      },
      {
        q: 'What happens if I arrive late?',
        a: 'Your token may be skipped if you are not present when called. We recommend arriving at least 10 minutes before your slot time.'
      },
      {
        q: 'Can I cancel my token?',
        a: 'Currently cancellations can be done by contacting the hospital directly. An in-app cancellation feature is coming soon.'
      },
    ]
  },
  {
    category: 'Account',
    icon: '👤',
    questions: [
      {
        q: 'Do I need an account to book?',
        a: 'Yes. You need to register or log in before booking a token. This helps us keep your booking history and send you updates.'
      },
      {
        q: 'How do I reset my password?',
        a: 'On the login screen, click "Forgot password" and enter your registered email. You will receive a reset link within a few minutes.'
      },
      {
        q: 'Is my personal data safe?',
        a: 'Yes. We do not share your personal data with any third parties. Your data is used only to manage your appointments.'
      },
    ]
  },
  {
    category: 'Technical',
    icon: '⚙️',
    questions: [
      {
        q: 'Which browsers are supported?',
        a: 'MediToken works on all modern browsers including Chrome, Firefox, Safari and Edge. We recommend keeping your browser up to date.'
      },
      {
        q: 'Does MediToken have a mobile app?',
        a: 'Not yet. MediToken is currently a web application that works well on mobile browsers. A dedicated app is planned for future release.'
      },
      {
        q: 'What do I do if the page is not loading?',
        a: 'Try refreshing the page or clearing your browser cache. If the problem continues, contact us at support@meditoken.com.'
      },
    ]
  },
]

export default function FAQ({ onNav }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...faqs.map(f => f.category)]

  const filtered = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  const toggle = (key) => setOpenIndex(openIndex === key ? null : key)

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>FAQ</span>
          <h2 className={styles.heading}>Frequently asked<br />questions</h2>
          <p className={styles.sub}>
            Everything you need to know about booking tokens, tracking your queue,
            and using MediToken.
          </p>
        </div>

        {/* Category filter */}
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ groups */}
        <div className={styles.groups}>
          {filtered.map((group, gi) => (
            <div key={gi} className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.groupIcon}>{group.icon}</span>
                <span className={styles.groupTitle}>{group.category}</span>
              </div>
              <div className={styles.list}>
                {group.questions.map((item, qi) => {
                  const key = `${gi}-${qi}`
                  const isOpen = openIndex === key
                  return (
                    <div
                      key={qi}
                      className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                    >
                      <button
                        className={styles.question}
                        onClick={() => toggle(key)}
                      >
                        <span>{item.q}</span>
                        <span className={styles.chevron}>{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className={styles.answer}>{item.a}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.cta}>
          <p>Still have questions?</p>
          <button className={styles.ctaBtn} onClick={() => onNav('contact')}>
            Contact Us →
          </button>
        </div>

      </div>
    </section>
  )
}