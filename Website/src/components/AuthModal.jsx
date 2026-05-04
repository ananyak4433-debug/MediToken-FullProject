import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthModal.module.css'

export default function AuthModal({ onClose, onSuccess }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', age: '', gender: 'male'
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      let result
      if (mode === 'login') {
        result = await login(form.email, form.password)
      } else {
        result = await register(form)
      }
      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.message || 'Something went wrong')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="white"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span><span style={{color:'var(--text)'}}>Medi</span><span style={{color:'var(--green)'}}>Token</span></span>
        </div> */}
        <img src='/logo3-bg.png' alt='logo' width={'250px'}></img>

        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className={styles.sub}>
          {mode === 'login'
            ? 'Login to book and track your appointments'
            : 'Register to get started with MediToken'}
        </p>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`} onClick={() => { setMode('login'); setError('') }}>Login</button>
          <button className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`} onClick={() => { setMode('register'); setError('') }}>Register</button>
        </div>

        <div className={styles.form}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label>Full Name</label>
              <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} />
            </div>
          )}

          <div className={styles.field}>
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>

          {mode === 'register' && (
            <>
              <div className={styles.field}>
                <label>Phone Number</label>
                <input name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Age</label>
                  <input name="age" type="number" placeholder="25" value={form.age} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login →' : 'Create Account →'}
          </button>
        </div>

        <p className={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className={styles.switchBtn} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
