import { useState } from 'react'
import { getAppointmentById } from '../api'
import styles from './TrackToken.module.css'

export default function TrackToken() {
  const [tokenInput, setTokenInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!tokenInput.trim()) return
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const data = await getAppointmentById(tokenInput.trim())
      if (data.appointment) {
        setResult(data)
      } else {
        setError(data.message || 'Appointment not found. Please check the ID.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const appt = result?.appointment
  const ahead = result?.patientsAhead ?? 0
  // const waitMin = ahead * 15

  // const calcWaitMin = (appt) => {
  //   if (!appt?.appointmentTime) return 0

  //   // parse "2:00 PM" → minutes since midnight
  //   const [time, period] = appt.appointmentTime.split(' ')
  //   let [h, m] = time.split(':').map(Number)
  //   if (period === 'PM' && h !== 12) h += 12
  //   if (period === 'AM' && h === 12) h = 0
  //   const apptMin = h * 60 + m

  //   const now = new Date()
  //   const nowMin = now.getHours() * 60 + now.getMinutes()

  //   const diff = apptMin - nowMin
  //   return diff > 0 ? diff : 0
  // }

  const calcWaitMin = (appt) => {
  if (!appt?.appointmentDate || !appt?.appointmentTime) return 0;

  // Parse appointment time
  const [time, period] = appt.appointmentTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  // Create full appointment datetime
  const appointmentDate = new Date(appt.appointmentDate);

  appointmentDate.setHours(hours);
  appointmentDate.setMinutes(minutes);
  appointmentDate.setSeconds(0);
  appointmentDate.setMilliseconds(0);

  // Current datetime
  const now = new Date();

  // Difference in minutes
  const diffMs = appointmentDate - now;
  const diffMin = Math.floor(diffMs / (1000 * 60));

  return diffMin > 0 ? diffMin : 0;
};

  const waitMin = calcWaitMin(appt)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.tag}>TRACK TOKEN</span>
        <h2 className={styles.heading}>Track your token live</h2>
        <p className={styles.sub}>
          Enter your Appointment ID (shown after booking) to see your current queue position.
        </p>

        <div className={styles.inputRow}>
          <input
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            type="text"
            placeholder="Paste your Appointment ID (e.g. 664abc...)"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
          />
          <button className={styles.trackBtn} onClick={handleTrack} disabled={loading}>
            {loading ? '...' : 'Track →'}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {appt && (
          <div className={styles.resultCard}>

            {/* TOKEN + STATUS */}
            <div className={styles.resultTop}>
              <div>
                <p className={styles.resultLabel}>Token</p>
                <p className={styles.resultToken}>#{appt.tokenNumber}</p>
              </div>
              <div className={`${styles.statusBadge} ${appt.status === 'completed' ? styles.statusDone
                  : ahead === 0 ? styles.statusNow : ''
                }`}>
                {appt.status === 'completed' ? '✅ Completed'
                  : appt.status === 'cancelled' ? '❌ Cancelled'
                    : appt.status === 'serving' ? '🔔 Your Turn!'
                      : ahead === 0 ? '🔔 Your Turn!'
                        : '⏳ In Queue'}
              </div>
            </div>

            {/* QUEUE BAR */}
            <div className={styles.queueBar}>
              <div
                className={styles.queueFill}
                style={{ width: `${Math.max(10, 100 - (ahead / 8) * 100)}%` }}
              />
            </div>

            {/* META */}
            <div className={styles.resultMeta}>
              <div className={styles.metaItem}>
                <span>Queue Position</span>
                <strong>#{appt.tokenNumber}</strong>
              </div>
              <div className={styles.metaItem}>
                <span>Patients Ahead</span>
                <strong>{ahead}</strong>
              </div>
              <div className={styles.metaItem}>
                <span>Est. Wait</span>
                {/* <strong>{waitMin === 0 ? 'Soon!' : `~${waitMin} min`}</strong> */}
                <strong>
                  {waitMin === 0
                    ? 'Soon!'
                    : waitMin < 60
                      ? `~${waitMin} min`
                      : `~${Math.floor(waitMin / 60)}h ${waitMin % 60}m`}
                </strong>
              </div>
            </div>

            {/* DETAILS */}
            <div className={styles.resultDetails}>
              <div className={styles.detailRow}>
                <span>Doctor</span>
                <strong>{appt.doctorId?.name || 'N/A'}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Specialization</span>
                <strong>{appt.doctorId?.specialization || 'N/A'}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Hospital</span>
                <strong>{appt.vendorId?.organisationName || 'N/A'}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Appointment Day</span>
                <strong>{appt.appointmentDay}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Appointment Time</span>
                <strong>{appt.appointmentTime}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Status</span>
                <strong style={{ textTransform: 'capitalize' }}>{appt.status}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Booked At</span>
                <strong>{new Date(appt.bookedAt).toLocaleString()}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Appointment ID</span>
                <strong style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {appt._id}
                </strong>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  )
}


