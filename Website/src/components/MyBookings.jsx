// import { useState, useEffect } from 'react'
// import { useAuth } from '../context/AuthContext'
// import AuthModal from './AuthModal'
// import { getMyAppointments } from '../api'
// import styles from './BookingFlow.module.css'

// const statusColors = {
//   pending:   { bg: '#fff7ed', color: '#c2410c', label: '⏳ Pending' },
//   confirmed: { bg: '#f0fdf4', color: '#15803d', label: '✅ Confirmed' },
//   completed: { bg: '#eff6ff', color: '#1d4ed8', label: '✔️ Completed' },
//   cancelled: { bg: '#fef2f2', color: '#b91c1c', label: '❌ Cancelled' },
// }

// const getStatus = (status) =>
//   statusColors[status?.toLowerCase()] || { bg: '#f9fafb', color: '#374151', label: status }

// export default function MyBookings({ onHome }) {
//   const { user: patient } = useAuth()
//   const [showAuth, setShowAuth] = useState(false)
//   const [appointments, setAppointments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [copiedId, setCopiedId] = useState(null)

//   useEffect(() => {
//     if (!patient) return
//     fetchAppointments()
//   }, [patient])

//   const fetchAppointments = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       const res = await getMyAppointments()
//       // handle different response shapes
//       const list = Array.isArray(res)
//         ? res
//         : Array.isArray(res.appointments)
//         ? res.appointments
//         : Array.isArray(res.data)
//         ? res.data
//         : []
//       // latest first
//       setAppointments(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
//     } catch {
//       setError('Failed to load bookings. Please try again.')
//     }
//     setLoading(false)
//   }

//   const handleCopy = (id) => {
//     navigator.clipboard.writeText(id)
//     setCopiedId(id)
//     setTimeout(() => setCopiedId(null), 2000)
//   }

//   // Auth gate
//   if (!patient) {
//     return (
//       <>
//         <div className={styles.authGate}>
//           <div className={styles.authGateInner}>
//             <div className={styles.lockIcon}>🔒</div>
//             <h2>Login to View Bookings</h2>
//             <p>You need to be logged in to see your appointments.</p>
//             <button className={styles.loginBtn} onClick={() => setShowAuth(true)}>
//               Login / Register
//             </button>
//             <button className={styles.backLink} onClick={onHome}>← Back to Home</button>
//           </div>
//         </div>
//         {showAuth && (
//           <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
//         )}
//       </>
//     )
//   }

//   return (
//     <div className={styles.page}>
//       <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>📋 My Bookings</h2>
//             <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
//               All your appointment history with token & tracking IDs
//             </p>
//           </div>
//           <button className={styles.backBtn} onClick={onHome}>← Home</button>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className={styles.loading}>
//             <div className={styles.spinner} />
//             <p>Loading your bookings...</p>
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className={styles.errorBox}>
//             <p>{error}</p>
//             <button onClick={fetchAppointments}>Retry</button>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && appointments.length === 0 && (
//           <div className={styles.emptyBox} style={{ textAlign: 'center', padding: 48 }}>
//             <div style={{ fontSize: 48, marginBottom: 12 }}>🗓️</div>
//             <p style={{ fontWeight: 600, fontSize: 16 }}>No bookings yet</p>
//             <p style={{ color: '#6b7280', fontSize: 14 }}>Your appointments will appear here after booking.</p>
//             <button className={styles.continueBtn} style={{ marginTop: 16 }} onClick={onHome}>
//               Book an Appointment
//             </button>
//           </div>
//         )}

//         {/* Appointment Cards */}
//         {!loading && appointments.map((appt) => {
//           const { bg, color, label } = getStatus(appt.status)
//           return (
//             <div
//               key={appt._id}
//               style={{
//                 background: '#fff',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: 12,
//                 padding: '20px 24px',
//                 marginBottom: 16,
//                 boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
//               }}
//             >
//               {/* Top row: token + status */}
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <div style={{
//                     background: '#f0fdf4',
//                     border: '2px solid #38c1b3',
//                     borderRadius: 10,
//                     padding: '6px 16px',
//                     textAlign: 'center',
//                     minWidth: 64
//                   }}>
//                     <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, letterSpacing: 1 }}>TOKEN</div>
//                     <div style={{ fontSize: 22, fontWeight: 800, color: '#38c1b3' }}>#{appt.tokenNumber}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: 700, fontSize: 16 }}>{appt.doctorId?.name || 'Doctor'}</div>
//                     <div style={{ color: '#6b7280', fontSize: 13 }}>{appt.doctorId?.specialization || appt.specialization}</div>
//                   </div>
//                 </div>
//                 <span style={{
//                   background: bg, color, borderRadius: 20,
//                   padding: '4px 12px', fontSize: 13, fontWeight: 600
//                 }}>
//                   {label}
//                 </span>
//               </div>

//               {/* Details grid */}
//               <div style={{
//                 display: 'grid', gridTemplateColumns: '1fr 1fr',
//                 gap: '6px 24px', fontSize: 13, color: '#374151',
//                 borderTop: '1px solid #f3f4f6', paddingTop: 12, marginBottom: 12
//               }}>
//                 {/* <div>🏥 <strong>Hospital:</strong> {appt.vendorId?.organisationName || 'N/A'}</div> */}
//                 <div>📅 <strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : appt.appointmentDay}</div>
//                 <div>🕐 <strong>Time:</strong> {appt.appointmentTime}</div>
//                 <div>👤 <strong>Patient:</strong> {appt.patientName}</div>
//               </div>

//               {/* Appointment ID row */}
//               <div style={{
//                 background: '#f9fafb', borderRadius: 8,
//                 padding: '10px 14px',
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'space-between', gap: 8,
//                 flexWrap: 'wrap'
//               }}>
//                 <div>
//                   <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 2 }}>
//                     APPOINTMENT ID (use this to track your token)
//                   </div>
//                   <code style={{ fontSize: 12, color: '#374151', wordBreak: 'break-all' }}>{appt._id}</code>
//                 </div>
//                 <button
//                   onClick={() => handleCopy(appt._id)}
//                   style={{
//                     padding: '4px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
//                     border: '1px solid #38c1b3',
//                     background: copiedId === appt._id ? '#38c1b3' : 'white',
//                     color: copiedId === appt._id ? 'white' : '#38c1b3',
//                     fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s'
//                   }}
//                 >
//                   {copiedId === appt._id ? '✓ Copied!' : 'Copy ID'}
//                 </button>
//               </div>

//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }




import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import { getMyAppointments, cancelAppointment } from '../api'
import styles from './BookingFlow.module.css'

const statusColors = {
  booked:    { bg: '#f0fdf4', color: '#15803d', label: '✅ Booked' },
  pending:   { bg: '#fff7ed', color: '#c2410c', label: '⏳ Pending' },
  confirmed: { bg: '#f0fdf4', color: '#15803d', label: '✅ Confirmed' },
  serving:   { bg: '#eff6ff', color: '#1d4ed8', label: '🔔 Serving' },
  completed: { bg: '#eff6ff', color: '#1d4ed8', label: '✔️ Completed' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c', label: '❌ Cancelled' },
}

// const getStatus = (status) =>
//   statusColors[status?.toLowerCase()] || { bg: '#f9fafb', color: '#374151', label: status }

const getStatus = (status) => {
  const key = String(status || '').toLowerCase()

  return (
    statusColors[key] || {
      bg: '#f9fafb',
      color: '#374151',
      label: status || 'Unknown'
    }
  )
}

export default function MyBookings({ onHome }) {
  const { user: patient } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null) // 👈 tracks which is being cancelled

  useEffect(() => {
    if (!patient) return
    fetchAppointments()
  }, [patient])

  // const fetchAppointments = async () => {
  //   setLoading(true)
  //   setError('')
  //   try {
  //     const res = await getMyAppointments()
  //     const list = Array.isArray(res)
  //       ? res
  //       : Array.isArray(res.appointments)
  //       ? res.appointments
  //       : Array.isArray(res.data)
  //       ? res.data
  //       : []
  //     setAppointments(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  //   } catch {
  //     setError('Failed to load bookings. Please try again.')
  //   }
  //   setLoading(false)
  // }

  const fetchAppointments = async () => {
  setLoading(true)
  setError('')

  try {
    const res = await getMyAppointments()

    console.log('📦 Appointments response:', res)

    let list = []

    if (Array.isArray(res)) {
      list = res
    } else if (res?.appointments && Array.isArray(res.appointments)) {
      list = res.appointments
    } else if (res?.data && Array.isArray(res.data)) {
      list = res.data
    }

    setAppointments(
      list.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    )

  } catch (err) {
    console.error(err)
    setError('Failed to load bookings. Please try again.')
  }

  setLoading(false)
}

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 👇 Cancel handler
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    setCancellingId(id)
    try {
      const res = await cancelAppointment(id)
      if (res._id || res.success) {
        // update locally — no need to refetch
        setAppointments(prev =>
          prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a)
        )
      } else {
        alert(res.message || 'Failed to cancel. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    }
    setCancellingId(null)
  }

  if (!patient) {
    return (
      <>
        <div className={styles.authGate}>
          <div className={styles.authGateInner}>
            <div className={styles.lockIcon}>🔒</div>
            <h2>Login to View Bookings</h2>
            <p>You need to be logged in to see your appointments.</p>
            <button className={styles.loginBtn} onClick={() => setShowAuth(true)}>
              Login / Register
            </button>
            <button className={styles.backLink} onClick={onHome}>← Back to Home</button>
          </div>
        </div>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
        )}
      </>
    )
  }

  return (
    <div className={styles.page}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>📋 My Bookings</h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
              All your appointment history with token & tracking IDs
            </p>
          </div>
          <button className={styles.backBtn} onClick={onHome}>← Home</button>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading your bookings...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button onClick={fetchAppointments}>Retry</button>
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className={styles.emptyBox} style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗓️</div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>No bookings yet</p>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Your appointments will appear here after booking.</p>
            <button className={styles.continueBtn} style={{ marginTop: 16 }} onClick={onHome}>
              Book an Appointment
            </button>
          </div>
        )}

        {!loading && appointments.map((appt) => {
          const isCancelled = appt.status?.toLowerCase() === 'cancelled'
          const isCompleted = appt.status?.toLowerCase() === 'completed'
          const canCancel = !isCancelled && !isCompleted // 👈 only show cancel if active
          const { bg, color, label } = getStatus(appt.status)

          return (
            <div
              key={appt._id}
              style={{
                background: isCancelled ? '#fafafa' : '#fff',
                border: `1px solid ${isCancelled ? '#fecaca' : '#e5e7eb'}`,
                borderRadius: 12,
                padding: '20px 24px',
                marginBottom: 16,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                opacity: isCancelled ? 0.75 : 1,  // 👈 dim cancelled cards
                transition: 'opacity 0.2s'
              }}
            >
              {/* Top row: token + status + cancel */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    background: isCancelled ? '#f3f4f6' : '#f0fdf4',
                    border: `2px solid ${isCancelled ? '#d1d5db' : '#38c1b3'}`,
                    borderRadius: 10,
                    padding: '6px 16px',
                    textAlign: 'center',
                    minWidth: 64
                  }}>
                    <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, letterSpacing: 1 }}>TOKEN</div>
                    <div style={{
                      fontSize: 22, fontWeight: 800,
                      color: isCancelled ? '#9ca3af' : '#38c1b3',
                      textDecoration: isCancelled ? 'line-through' : 'none' // 👈 strikethrough
                    }}>
                      #{appt.tokenNumber}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700, fontSize: 16,
                      textDecoration: isCancelled ? 'line-through' : 'none', // 👈 strikethrough
                      color: isCancelled ? '#9ca3af' : 'inherit'
                    }}>
                      {appt.doctorId?.name || 'Doctor'}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>
                      {appt.doctorId?.specialization || appt.specialization}
                    </div>
                  </div>
                </div>

                {/* Status + Cancel */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{
                    background: bg, color, borderRadius: 20,
                    padding: '4px 12px', fontSize: 13, fontWeight: 600
                  }}>
                    {label}
                  </span>
                  {/* 👇 Cancel button */}
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(appt._id)}
                      disabled={cancellingId === appt._id}
                      style={{
                        padding: '3px 12px', fontSize: 12, borderRadius: 6,
                        border: '1px solid #fca5a5',
                        background: cancellingId === appt._id ? '#fca5a5' : '#fff',
                        color: '#b91c1c', cursor: 'pointer', fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      {cancellingId === appt._id ? 'Cancelling...' : '✕ Cancel'}
                    </button>
                  )}
                </div>
              </div>

              {/* Details grid — strikethrough when cancelled */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '6px 24px', fontSize: 13,
                color: isCancelled ? '#9ca3af' : '#374151',
                textDecoration: isCancelled ? 'line-through' : 'none', // 👈 strikethrough
                borderTop: '1px solid #f3f4f6', paddingTop: 12, marginBottom: 12
              }}>
                <div>🏥 <strong>Hospital:</strong> {appt.vendorId?.organisationName || 'N/A'}</div>
                <div>📅 <strong>Date:</strong> {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : appt.appointmentDay}</div>
                <div>🕐 <strong>Time:</strong> {appt.appointmentTime}</div>
                <div>👤 <strong>Patient:</strong> {appt.patientName}</div>
              </div>

              {/* Appointment ID row */}
              <div style={{
                background: '#f9fafb', borderRadius: 8,
                padding: '10px 14px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 8,
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 2 }}>
                    APPOINTMENT ID (use this to track your token)
                  </div>
                  <code style={{
                    fontSize: 12, color: '#374151',
                    wordBreak: 'break-all',
                    textDecoration: isCancelled ? 'line-through' : 'none' // 👈 strikethrough
                  }}>
                    {appt._id}
                  </code>
                </div>
                <button
                  onClick={() => handleCopy(appt._id)}
                  style={{
                    padding: '4px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
                    border: '1px solid #38c1b3',
                    background: copiedId === appt._id ? '#38c1b3' : 'white',
                    color: copiedId === appt._id ? 'white' : '#38c1b3',
                    fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s'
                  }}
                >
                  {copiedId === appt._id ? '✓ Copied!' : 'Copy ID'}
                </button>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}