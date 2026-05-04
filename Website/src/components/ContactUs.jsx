import { useState } from 'react'
import styles from './ContactUs.module.css'

const contactInfo = [
  {
    icon: '📧',
    title: 'Email Us',
    desc: 'For general queries and support',
    value: 'support@meditoken.com',
    link: 'mailto:support@meditoken.com'
  },
  {
    icon: '📞',
    title: 'Call Us',
    desc: 'Mon–Fri, 9AM to 6PM IST',
    value: '+91 98765 43210',
    link: 'tel:+919876543210'
  },
  {
    icon: '📍',
    title: 'Office',
    desc: 'Come visit us',
    value: 'Kochi, Kerala, India',
    link: 'https://maps.google.com'
  },
  {
    icon: '💬',
    title: 'Live Chat',
    desc: 'Mon–Sat, 9AM to 5PM IST',
    value: 'Start a chat',
    link: '#'
  },
]

export default function Contact({ onNav }) {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>CONTACT US</span>
          <h2 className={styles.heading}>We'd love to<br />hear from you</h2>
          <p className={styles.sub}>
            Have a question, feedback, or want to partner with us?
            Reach out and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Contact info cards */}
        <div className={styles.infoGrid}>
          {contactInfo.map((item, i) => (
            <a key={i} href={item.link} className={styles.infoCard}>
              <div className={styles.infoIcon}>{item.icon}</div>
              <div>
                <div className={styles.infoTitle}>{item.title}</div>
                <div className={styles.infoDesc}>{item.desc}</div>
                <div className={styles.infoValue}>{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Form + extra info */}
        <div className={styles.main}>

          {/* Form */}
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Send us a message</h3>

            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✅</div>
                <h4>Message sent!</h4>
                <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  className={styles.resetBtn}
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us more about your query..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className={styles.side}>

            {/* Response time */}
            <div className={styles.sideCard}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>⏱️</div>
                <span className={styles.stepNum}>01</span>
              </div>
              <h3 className={styles.stepTitle}>Quick response</h3>
              <p className={styles.stepDesc}>
                We respond to all emails within 24 hours on business days.
                For urgent issues, please call us directly.
              </p>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>🏥</div>
                <span className={styles.stepNum}>02</span>
              </div>
              <h3 className={styles.stepTitle}>Hospital partnerships</h3>
              <p className={styles.stepDesc}>
                Want to integrate MediToken with your hospital?
                Write to us at <strong>partners@meditoken.com</strong>
              </p>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>🐛</div>
                <span className={styles.stepNum}>03</span>
              </div>
              <h3 className={styles.stepTitle}>Report an issue</h3>
              <p className={styles.stepDesc}>
                Found a bug or facing a technical issue?
                Use the form or email <strong>tech@meditoken.com</strong>
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}