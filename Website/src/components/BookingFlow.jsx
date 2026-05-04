import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
// import { getDoctors, createAppointment, getBookedSlots } from '../api'
import AuthModal from './AuthModal'
import styles from './BookingFlow.module.css'
import { getDoctors, createAppointment, getBookedSlots, getDepartments } from '../api'

import FavoriteIcon from '@mui/icons-material/Favorite'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import PsychologyIcon from '@mui/icons-material/Psychology'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import ScienceIcon from '@mui/icons-material/Science'
import BiotechIcon from '@mui/icons-material/Biotech'
import FemaleIcon from '@mui/icons-material/Female'
import MedicationIcon from '@mui/icons-material/Medication'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import HearingIcon from '@mui/icons-material/Hearing'


const generateTimeSlots = (startTime, endTime, breakStart, breakEnd, interval = 30) => {
  const slots = []
  const toMin = (t) => {
    if (!t) return null
    const [h, m] = t.split(':').map(Number) // ✅ 24hr format
    return h * 60 + m
  }
  const toLabel = (min) => {
    let h = Math.floor(min / 60)
    const m = min % 60
    const period = h >= 12 ? 'PM' : 'AM'
    if (h > 12) h -= 12
    if (h === 0) h = 12
    return `${h}:${m.toString().padStart(2, '0')} ${period}`
  }
  const start = toMin(startTime)
  const end = toMin(endTime)
  const bStart = toMin(breakStart)
  const bEnd = toMin(breakEnd)
  if (start === null || end === null) return []
  for (let t = start; t < end; t += interval) {
    if (bStart !== null && bEnd !== null && t >= bStart && t < bEnd) continue
    slots.push(toLabel(t))
  }
  return slots
}

const steps = [
  { num: 1, label: 'Department', sub: 'Choose specialty' },
  { num: 2, label: 'Doctor & Time', sub: 'Select provider & slot' },
  { num: 3, label: 'Your Details', sub: 'Personal information' },
  { num: 4, label: 'Review & Confirm', sub: 'Verify your booking' },
]

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const departmentIcons = {
  'cardiology': <FavoriteIcon style={{ fontSize: 28, color: '#ef4444' }} />,
  'orthopaedics': <AccessibilityNewIcon style={{ fontSize: 28 }} />,
  'orthopedics': <AccessibilityNewIcon style={{ fontSize: 28 }} />,
  'neurology': <PsychologyIcon style={{ fontSize: 28, color: '#6c5ce7' }} />,
  'ophthalmology': <VisibilityIcon style={{ fontSize: 28 }} />,
  'paediatrics': <ChildCareIcon style={{ fontSize: 28 }} />,
  'pediatrics': <ChildCareIcon style={{ fontSize: 28 }} />,
  'dental': <MedicalServicesIcon style={{ fontSize: 28 }} />,
  'general opd': <LocalHospitalIcon style={{ fontSize: 28 }} />,
  'dermatology': <ScienceIcon style={{ fontSize: 28 }} />,
  'radiology': <BiotechIcon style={{ fontSize: 28 }} />,
  'gynaecology': <FemaleIcon style={{ fontSize: 28, color: '#e84393' }} />,
  'gynecology': <FemaleIcon style={{ fontSize: 28, color: '#e84393' }} />,
  'pharmacy': <MedicationIcon style={{ fontSize: 28 }} />,
  'ent': <HearingIcon style={{ fontSize: 28 }} />,
  'default': <LocalHospitalIcon style={{ fontSize: 28, color: '#1D9E75' }} />
};

const getIcon = (name) =>
  departmentIcons[name?.toLowerCase().trim()] || departmentIcons.default;

export default function BookingFlow({ onHome, initialDept  }) {
  const { user: patient } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [step, setStep] = useState(1)
  const [allDoctors, setAllDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [doctorError, setDoctorError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [selected, setSelected] = useState({
    specialization: null, doctor: null, time: null, notes: ''
  })

  // ✅ todayName and selectedDay defined inside component
  const todayName = DAYS[new Date().getDay()]
  const [selectedDay, setSelectedDay] = useState(todayName)

  const getDateFromDay = (dayName) => {
    const today = new Date()
    const todayIndex = today.getDay()
    const targetIndex = DAYS.indexOf(dayName)
    const diff = targetIndex - todayIndex
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    return targetDate.toISOString().split('T')[0] // "2026-04-28"
  }

  const availableDays = selected.doctor?.availability?.map(a => a.day) || []

  const selectedAvailability = selected.doctor?.availability?.find(
    a => a.day.toLowerCase() === selectedDay.toLowerCase()
  )
  const timeSlots = selectedAvailability
    ? generateTimeSlots(
      selectedAvailability.startTime,
      selectedAvailability.endTime,
      selectedAvailability.breakStart,
      selectedAvailability.breakEnd,
      15
    )
    : []

  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    if (patient && selected.specialization) {
      fetchDoctorsByDept(selected.specialization)
    }
  }, [patient, selected.specialization])

  useEffect(() => {
    if (selected.doctor && selectedDay) {
      fetchBookedSlots(selected.doctor._id, selectedDay)
    }
  }, [selected.doctor, selectedDay])

  useEffect(() => {
    getDepartments()
      .then(data => setDepartments(data.filter(d => d.status === 'active')))
      .catch(() => setDepartments([]))
      .finally(() => setLoadingDepts(false));
  }, []);

  useEffect(() => {
    if (initialDept) {
      setSelected(s => ({ ...s, specialization: initialDept, doctor: null, time: null }))
      setStep(2)  
    }
  }, [initialDept])


  const fetchBookedSlots = async (doctorId, day) => {
    try {
      const slots = await getBookedSlots(doctorId, day)
      setBookedSlots(slots)
    } catch {
      setBookedSlots([])
    }
  }

  const currentTimeInMin = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  const slotTimeInMin = (t) => {
    // t is like "10:30 AM" or "2:00 PM"
    const [time, period] = t.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return h * 60 + m
  }

  const fetchDoctorsByDept = async (dept) => {
    setLoadingDoctors(true)
    setDoctorError('')
    try {
      const data = await getDoctors()
      console.log('🔍 Selected dept:', dept)                    // ADD
    console.log('🩺 All doctors:', data.map(d => ({           // ADD
      name: d.name,
      specialization: d.specialization,
      vendorId: d.vendorId
    })))
      const active = Array.isArray(data)
        ? data.filter(d => d.status === 'active' && d.specialization === dept) // ✅
        : []
      setAllDoctors(active)
    } catch {
      setDoctorError('Failed to load doctors. Please try again.')
    }
    setLoadingDoctors(false)
  }

  const filteredDoctors = allDoctors

  const canContinue = () => {
    if (step === 1) return !!selected.specialization
    if (step === 2) return !!selected.doctor && !!selected.time
    return true
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      const result = await createAppointment({
        vendorId: selected.doctor.vendorId?._id || selected.doctor.vendorId, // ✅ handles populated or plain
        staffId: selected.doctor.staffId || null,  // ✅ null for vendor doctors
        doctorId: selected.doctor._id,
        patientName: selected.patientName ?? patient.name,
        patientAge: selected.patientAge ?? patient.age,
        patientGender: selected.patientGender ?? patient.gender,
        appointmentDate: getDateFromDay(selectedDay),
        appointmentDay: selectedDay,   // ✅
        appointmentTime: selected.time, // ✅
        notes: selected.notes
      })
      if (result.success) {
        setConfirmed(result.appointment)
      } else {
        alert(result.message || 'Booking failed. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  // Auth gate
  if (!patient) {
    return (
      <>
        <div className={styles.authGate}>
          <div className={styles.authGateInner}>
            <div className={styles.lockIcon}>🔒</div>
            <h2>Login to Book</h2>
            <p>You need to be logged in to book an appointment.</p>
            <button className={styles.loginBtn} onClick={() => setShowAuth(true)}>
              Login / Register
            </button>
            <button className={styles.backLink} onClick={onHome}>← Back to Home</button>
          </div>
        </div>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        )}
      </>
    )
  }

  // Confirmed screen
  if (confirmed) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmed}>
          <div className={styles.checkCircle}>✓</div>
          <h2 className={styles.confirmedTitle}>Booking Confirmed!</h2>
          <p className={styles.confirmedSub}>Your token has been issued successfully.</p>
          <div className={styles.tokenCard}>
            <span className={styles.tokenLabel}>Token Number</span>
            <span className={styles.tokenNum}>#{confirmed.tokenNumber}</span>
            <div className={styles.tokenMeta}>
              <span>{selected.specialization}</span>
              <span>·</span>
              <span>{selected.doctor?.name}</span>
              <span>·</span>
              <span>{selected.time}</span>
            </div>
          </div>
          <div className={styles.tokenId}>
            <span>Appointment ID</span>
            <code>{confirmed._id}</code>
            <p className={styles.tokenIdHint}>Save this ID to track your token status later.</p>
          </div>
          <button className={styles.homeBtn} onClick={onHome}>← Back to Home</button>
        </div>
      </div>
    )
  }

  // Main booking flow
  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <p className={styles.sidebarLabel}>BOOKING STEPS</p>
            <div className={styles.stepsList}>
              {steps.map(s => (
                <div
                  key={s.num}
                  className={`${styles.stepItem} ${step === s.num ? styles.active : ''} ${step > s.num ? styles.done : ''}`}
                >
                  <div className={styles.stepCircle}>{step > s.num ? '✓' : s.num}</div>
                  <div>
                    <div className={styles.stepLabel}>{s.label}</div>
                    <div className={styles.stepSub}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.patientInfo}>
            <div className={styles.patientAvatar}>{patient.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className={styles.patientName}>{patient.name}</div>
              <div className={styles.patientEmail}>{patient.email}</div>
            </div>
          </div>
          <div className={styles.tip}>
            <span>💡</span>
            <div>
              <strong>Tip</strong>
              <p>Arrive 10 minutes before your token is called.</p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className={styles.main}>

          {/* STEP 1 — Department */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <div className={styles.stepIcon}>🏥</div>
                <div>
                  <h2>Choose a Specialization</h2>
                  <p>Select the type of doctor you need</p>
                </div>
              </div>

              {loadingDepts ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <p>Loading departments...</p>
                </div>
              ) : departments.length === 0 ? (
                <div className={styles.emptyBox}>No departments available at the moment.</div>
              ) : (
                <div className={styles.deptGrid}>
                  {departments.map((d, i) => (
                    <button
                      key={d._id || i}
                      className={`${styles.deptCard} ${selected.specialization === d.departmentName ? styles.deptSelected : ''}`}
                      onClick={() => setSelected(s => ({
                        ...s, specialization: d.departmentName, doctor: null, time: null
                      }))}
                    >
                      <div className={styles.deptIcon}>{getIcon(d.departmentName)}</div>  {/* ← add icon */}
                      <span className={styles.deptName}>{d.departmentName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Doctor & Time */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <div className={styles.stepIcon}>👨‍⚕️</div>
                <div>
                  <h2>Select Doctor & Time</h2>
                  <p>Choose your preferred doctor and slot for today ({todayName})</p>
                </div>
              </div>
              <h3 className={styles.subLabel}>Available Doctors</h3>

              {loadingDoctors ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <p>Loading doctors...</p>
                </div>
              ) : doctorError ? (
                <div className={styles.errorBox}>
                  <p>{doctorError}</p>
                  <button onClick={() => fetchDoctorsByDept(selected.specialization)}>Retry</button>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className={styles.emptyBox}>
                  No doctors available for {selected.specialization} at the moment.
                </div>
              ) : (
                <div className={styles.doctorGrid}>
                  {filteredDoctors.map((doc) => (
                    <button
                      key={doc._id}
                      className={`${styles.doctorCard} ${selected.doctor?._id === doc._id ? styles.doctorSelected : ''}`}
                      onClick={() => {
                        const firstAvailableDay = doc.availability?.[0]?.day || todayName // ✅
                        setSelected(s => ({ ...s, doctor: doc, time: null }))
                        setSelectedDay(firstAvailableDay) // ✅ set to doctor's first available day
                      }}
                    >
                      {selected.doctor?._id === doc._id && (
                        <div className={styles.docCheckBadge}>✓</div>
                      )}
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className={styles.docPhoto}
                        onError={e => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'%3E%3Cpath d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z'/%3E%3C/svg%3E"
                        }}
                      />
                      <div className={styles.docName}>{doc.name}</div>
                      <div className={styles.docSpec}>{doc.specialization}</div>
                      <div className={styles.docClinic}>
                        🏥 {doc.vendorId?.organisationName || 'N/A'}
                      </div>
                      <div className={styles.docClinic}>
                        📅 {doc.availability?.length > 0
                          ? doc.availability.map(a => a.day.slice(0, 3)).join(', ')
                          : 'N/A'}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ✅ DAY SELECTOR + TIME SLOTS */}
              {selected.doctor && (
                <>
                  <h3 className={styles.subLabel} style={{ marginTop: 28 }}>Select Day</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {DAYS.map(day => {
                      const isAvailable = availableDays.includes(day)
                      const isToday = day === todayName
                      return (
                        <button
                          key={day}
                          disabled={!isAvailable}
                          onClick={() => {
                            setSelectedDay(day)
                            setSelected(s => ({ ...s, time: null }))
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 20,
                            border: '1px solid',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            fontWeight: selectedDay === day ? 'bold' : 'normal',
                            backgroundColor: selectedDay === day ? '#38c1b3' : isAvailable ? '#fff' : '#f5f5f5',
                            color: selectedDay === day ? '#fff' : isAvailable ? '#333' : '#bbb',
                            borderColor: selectedDay === day ? '#38c1b3' : isAvailable ? '#38c1b3' : '#ddd',
                          }}
                        >
                          {day.slice(0, 3)} {isToday ? '(Today)' : ''}
                        </button>
                      )
                    })}
                  </div>

                  <h3 className={styles.subLabel}>Available Slots — {selectedDay}</h3>
                  {timeSlots.length > 0 ? (
                    <div className={styles.timeGrid}>
                      {timeSlots.map((t, i) => {
                        const isBooked = bookedSlots.includes(t)
                        const isPast = selectedDay === todayName && slotTimeInMin(t) < currentTimeInMin() // ✅ only disable past slots for today
                        const isDisabled = isBooked || isPast

                        return (
                          <button
                            key={i}
                            disabled={isDisabled}
                            className={`${styles.timeSlot} 
        ${selected.time === t ? styles.timeSelected : ''} 
        ${isBooked ? styles.timeBooked : ''} 
        ${isPast ? styles.timeBooked : ''}`}
                            onClick={() => !isDisabled && setSelected(s => ({ ...s, time: t }))}
                          >
                            {t} {isBooked ? '🔴' : isPast ? '⏰' : ''}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className={styles.emptyBox}>
                      No slots available for {selectedDay}. Please choose another day.
                    </div>
                  )}
                </>
              )}
            </div>
          )}



          {/* STEP 3 — Your Details */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <div className={styles.stepIcon}>👤</div>
                <div><h2>Your Details</h2><p>Edit if booking for someone else</p></div>
              </div>
              <div className={styles.review}>

                {/* Editable Name */}
                <div className={styles.reviewRow}>
                  <span>Name</span>
                  <input
                    style={{
                      border: 'none', borderBottom: '1px solid #38c1b3',
                      outline: 'none', textAlign: 'right', fontWeight: 'bold',
                      fontSize: 'inherit', background: 'transparent', width: '60%'
                    }}
                    value={selected.patientName ?? patient.name}
                    onChange={e => setSelected(s => ({ ...s, patientName: e.target.value }))}
                  />
                </div>

                {/* Fixed Email */}
                <div className={styles.reviewRow}>
                  <span>Email</span>
                  <strong>{patient.email}</strong>
                </div>

                {/* Fixed Phone */}
                <div className={styles.reviewRow}>
                  <span>Phone</span>
                  <strong>{patient.phone}</strong>
                </div>

                {/* Editable Age */}
                <div className={styles.reviewRow}>
                  <span>Age</span>
                  <input
                    type="number"
                    style={{
                      border: 'none', borderBottom: '1px solid #38c1b3',
                      outline: 'none', textAlign: 'right', fontWeight: 'bold',
                      fontSize: 'inherit', background: 'transparent', width: '60%'
                    }}
                    value={selected.patientAge ?? patient.age ?? ''}
                    onChange={e => setSelected(s => ({ ...s, patientAge: e.target.value }))}
                  />
                </div>

                {/* Editable Gender */}
                <div className={styles.reviewRow}>
                  <span>Gender</span>
                  <select
                    style={{
                      border: 'none', borderBottom: '1px solid #38c1b3',
                      outline: 'none', textAlign: 'right', fontWeight: 'bold',
                      fontSize: 'inherit', background: 'transparent',
                      cursor: 'pointer', color: 'inherit'
                    }}
                    value={selected.patientGender ?? patient.gender ?? ''}
                    onChange={e => setSelected(s => ({ ...s, patientGender: e.target.value }))}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

              </div>

              <div className={styles.field} style={{ marginTop: 20 }}>
                <label>Notes for Doctor (optional)</label>
                <textarea
                  placeholder="Describe your symptoms..."
                  rows={3}
                  value={selected.notes}
                  onChange={e => setSelected(s => ({ ...s, notes: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* STEP 4 — Review & Confirm */}
          {step === 4 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <div className={styles.stepIcon}>📋</div>
                <div><h2>Review & Confirm</h2><p>Please verify your booking details</p></div>
              </div>
              <div className={styles.review}>
                <div className={styles.reviewRow}>
                  <span>Specialization</span><strong>{selected.specialization}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Doctor</span><strong>{selected.doctor?.name}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Hospital</span><strong>{selected.doctor?.vendorId?.organisationName || 'N/A'}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Day</span><strong>{selectedDay}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Time Slot</span><strong>{selected.time}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Patient</span>
                  <strong>{selected.patientName ?? patient.name}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Age</span>
                  <strong>{selected.patientAge ?? patient.age}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Gender</span>
                  <strong style={{ textTransform: 'capitalize' }}>
                    {selected.patientGender ?? patient.gender}
                  </strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Phone</span><strong>{patient.phone}</strong>
                </div>
                {selected.notes && (
                  <div className={styles.reviewRow}>
                    <span>Notes</span><strong>{selected.notes}</strong>
                  </div>
                )}
              </div>
              <div className={styles.reviewNotice}>
                ✅ Your token will be confirmed after clicking "Confirm Booking".
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className={styles.footer}>
            {step > 1
              ? <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
              : <button className={styles.backBtn} onClick={onHome}>← Home</button>
            }
            {step < 4
              ? <button className={styles.continueBtn} disabled={!canContinue()} onClick={() => setStep(s => s + 1)}>
                Continue →
              </button>
              : <button className={styles.continueBtn} disabled={submitting} onClick={handleConfirm}>
                {submitting ? 'Booking...' : 'Confirm Booking ✓'}
              </button>
            }
          </div>

        </div>
      </div>
    </div>
  )
}