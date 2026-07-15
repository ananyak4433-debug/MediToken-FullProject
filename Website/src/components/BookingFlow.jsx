
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import {
  getHospitals,
  getDepartments,
  getDoctors,
  getBookedSlots,
  createAppointment,
} from '../api'
import styles from './BookingFlow.module.css'

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

import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PhoneIcon from '@mui/icons-material/Phone'
import CakeIcon from '@mui/icons-material/Cake'
import NoteAltIcon from '@mui/icons-material/NoteAlt'



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
const deptIcon = (name = '') =>
  departmentIcons[name.toLowerCase()] ?? departmentIcons['default']


// ─── steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: 'Hospital', sub: 'Choose facility' },
  { num: 2, label: 'Department', sub: 'Choose specialty' },
  { num: 3, label: 'Doctor & Time', sub: 'Select provider & slot' },
  { num: 4, label: 'Your Details', sub: 'Personal information' },
  { num: 5, label: 'Review & Confirm', sub: 'Verify your booking' },
]

const today = new Date().toISOString().split('T')[0]
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const todayName = DAYS[new Date().getDay()]
// ─── helpers ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14, padding: '24px 0' }}>
    <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    Loading…
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

const ErrBox = ({ msg, onRetry }) => (
  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 18px', color: '#b91c1c', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
    ⚠️ {msg}
    {onRetry && <button onClick={onRetry} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid #fca5a5', background: 'white', color: '#b91c1c', cursor: 'pointer' }}>Retry</button>}
  </div>
)


export default function BookingFlow({ onHome, initialDept }) {

  const { user: patient } = useAuth()

  // ✅ SEARCH STATE INSIDE COMPONENT
  const [hospitalSearch, setHospitalSearch] =
    useState('')

  const [hospitalPage, setHospitalPage] = useState(1)
  const HOSPITALS_PER_PAGE = 6

  const [showAuth, setShowAuth] = useState(false)

  const [step, setStep] = useState(1)
  // const [step, setStep] = useState(initialDept ? 3 : 1)

  // const [sel, setSel] = useState({
  //   hospital: null,
  //   dept: null,
  const [sel, setSel] = useState({
    hospital: null,
    dept: null,
    doctor: null,
    time: null,
    date: today,
    name: '',
    phone: '',
    age: '',
    gender: '',
    notes: '',
  })

  // ── raw data from backend ──
  const [hospitals, setHospitals] = useState([])
  const [allDepts, setAllDepts] = useState([])
  const [allDoctors, setAllDoctors] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])

  const [loadingH, setLoadingH] = useState(false)
  const [loadingD, setLoadingD] = useState(false)
  const [loadingDoc, setLoadingDoc] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingBook, setLoadingBook] = useState(false)

  const [errH, setErrH] = useState('')
  const [errD, setErrD] = useState('')
  const [errDoc, setErrDoc] = useState('')
  const [errBook, setErrBook] = useState('')

  const [confirmed, setConfirmed] = useState(false)
  const [tokenNum, setTokenNum] = useState(null)
  const [bookingId, setBookingId] = useState(null)

  // ✅ FILTERED HOSPITALS
  const filteredHospitals = hospitals.filter((h) => {
    const q = hospitalSearch.toLowerCase()

    return (
      h.organisationName
        ?.toLowerCase()
        .includes(q) ||
      h.address
        ?.toLowerCase()
        .includes(q)
    )
  })





  // ADD after filteredHospitals:
  // const vendorIdsForDept = initialDept
  //   ? [...new Set(
  //     allDoctors
  //       .filter(doc =>
  //         doc.specialization?.toLowerCase() === initialDept.departmentName?.toLowerCase()
  //       )
  //       .map(doc => String(doc.vendorId?._id ?? doc.vendorId))
  //       .filter(Boolean)
  //   )]
  //   : null

  // const displayedHospitals = vendorIdsForDept
  //   ? hospitals.filter(h => vendorIdsForDept.includes(String(h._id)))
  //   : filteredHospitals




  const vendorIdsForDept = useMemo(() => {
    if (!initialDept || allDoctors.length === 0) return null
    return [...new Set(
      allDoctors
        .filter(doc =>
          doc.specialization?.toLowerCase() === initialDept.departmentName?.toLowerCase()
        )
        .map(doc => String(doc.vendorId?._id ?? doc.vendorId))
        .filter(Boolean)
    )]
  }, [allDoctors, initialDept])

  const displayedHospitals = useMemo(() => {
    if (vendorIdsForDept && vendorIdsForDept.length > 0) {
      return hospitals.filter(h => vendorIdsForDept.includes(String(h._id)))
    }
    return filteredHospitals
  }, [vendorIdsForDept, hospitals, filteredHospitals])



  const totalPages = Math.ceil(displayedHospitals.length / HOSPITALS_PER_PAGE)
  const paginatedHospitals = displayedHospitals.slice(
    (hospitalPage - 1) * HOSPITALS_PER_PAGE,
    hospitalPage * HOSPITALS_PER_PAGE
  )



  // ── fetch on mount ────────────────────────────────────────────────────────
  const fetchHospitals = async () => {
    setLoadingH(true); setErrH('')
    try { setHospitals(await getHospitals()) }
    catch { setErrH('Failed to load hospitals.') }
    setLoadingH(false)
  }
  const fetchDepts = async () => {
    setLoadingD(true); setErrD('')
    try { setAllDepts(await getDepartments()) }
    catch { setErrD('Failed to load departments.') }
    setLoadingD(false)
  }
  const fetchDoctors = async () => {
    setLoadingDoc(true); setErrDoc('')
    try { setAllDoctors(await getDoctors()) }
    catch { setErrDoc('Failed to load doctors.') }
    setLoadingDoc(false)
  }

  useEffect(() => { fetchHospitals(); fetchDepts(); fetchDoctors() }, [])

  useEffect(() => {
    if (patient) {
      setSel(s => ({
        ...s,
        name: patient.name || s.name || '',
        phone: patient.phone || s.phone || '',
        age: patient.age ? String(patient.age) : s.age || '',
        gender: patient.gender || s.gender || '',
      }))
    }
  }, [patient])


  useEffect(() => { setHospitalPage(1) }, [hospitalSearch])
  // const totalPages = Math.ceil(filteredHospitals.length / HOSPITALS_PER_PAGE)
  // const paginatedHospitals = filteredHospitals.slice(


  // const totalPages = Math.ceil(displayedHospitals.length / HOSPITALS_PER_PAGE)
  // const paginatedHospitals = displayedHospitals.slice(
  //   (hospitalPage - 1) * HOSPITALS_PER_PAGE,
  //   hospitalPage * HOSPITALS_PER_PAGE
  // )

  // ── derived: depts available at selected hospital ─────────────────────────
  // doctors have vendorId populated → match by _id
  const deptNamesForHospital = sel.hospital
    ? [...new Set(
      allDoctors
        .filter(doc => String(doc.vendorId?._id ?? doc.vendorId) === String(sel.hospital._id))
        .map(doc => doc.specialization)
        .filter(Boolean)
    )]
    : []

  const deptsForHospital = allDepts.filter(d =>
    deptNamesForHospital.some(n => n.toLowerCase() === d.departmentName.toLowerCase())
  )

  // ── derived: doctors for selected hospital + dept ─────────────────────────
  // const doctorsForSlot = (sel.hospital && sel.dept)
  //   ? allDoctors.filter(doc => {
  //     const sameVendor = String(doc.vendorId?._id ?? doc.vendorId) === String(sel.hospital._id)
  //     const sameDept = doc.specialization?.toLowerCase() === sel.dept.departmentName?.toLowerCase()
  //     return sameVendor && sameDept
  //   })
  //   : []


  const doctorsForSlot = sel.dept
    ? allDoctors.filter(doc => {
      const sameDept = doc.specialization?.toLowerCase() === sel.dept.departmentName?.toLowerCase()
      if (!sel.hospital) return sameDept
      const sameVendor = String(doc.vendorId?._id ?? doc.vendorId) === String(sel.hospital._id)
      return sameVendor && sameDept
    })
    : []




  // ── fetch booked slots when doctor/date changes ───────────────────────────
  useEffect(() => {
    if (!sel.doctor || !sel.date) return
    const load = async () => {
      setLoadingSlots(true);

      try {
        const slots = await getBookedSlots(sel.doctor._id, sel.date);

        console.log("Booked Slots API:", slots);

        setBookedSlots(slots);
      } catch (err) {
        console.log(err);
        setBookedSlots([]);
      }

      setLoadingSlots(false);
    };
    load()
  }, [sel.doctor?._id, sel.date])


  // const generateSlots = (doctor, date) => {
  //   if (!doctor || !date) return []

  //   const dayName = new Date(date + 'T12:00:00')
  //     .toLocaleDateString('en-US', { weekday: 'long' })

  //   const avail = doctor.availability?.find(
  //     a => a.day?.toLowerCase() === dayName.toLowerCase()
  //   )

  //   const parseMins = (str) => {
  //     if (!str) return null
  //     const [h, m] = str.split(':').map(Number)
  //     return h * 60 + m
  //   }

  //   const fmtTime = (mins) => {
  //     let h = Math.floor(mins / 60)
  //     const m = mins % 60

  //     const ap = h >= 12 ? 'PM' : 'AM'
  //     h = h % 12 || 12

  //     return `${h}:${String(m).padStart(2, '0')} ${ap}`
  //   }

  //   if (avail?.startTime && avail?.endTime) {
  //     const start = parseMins(avail.startTime)
  //     const end = parseMins(avail.endTime)

  //     const bS = avail.breakStart
  //       ? parseMins(avail.breakStart)
  //       : null

  //     const bE = avail.breakEnd
  //       ? parseMins(avail.breakEnd)
  //       : null

  //     // ✅ interval from backend
  //     const interval = avail.slotInterval || 15
  //     const slots = []
  //     for (let t = start; t < end; t += interval) {
  //       if (bS && bE && t >= bS && t < bE) continue
  //       slots.push(fmtTime(t))
  //     }
  //     return slots
  //   }
  //   return [
  //     '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
  //     '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  //     '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  //     '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  //     '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
  //     '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM','5.00 PM'
  //   ]
  // }
  const generateSlots = (doctor, date) => {
    if (!doctor || !date) return []

    const dayName = new Date(date + 'T12:00:00')
      .toLocaleDateString('en-US', { weekday: 'long' })

    const avail = doctor.availability?.find(
      a => a.day?.toLowerCase() === dayName.toLowerCase()
    )

    if (!avail?.startTime || !avail?.endTime) {
      // no availability set for this day — return empty, not defaults
      return []
    }

    // parse 24hr format "HH:MM" → minutes
    const toMins = (str) => {
      if (!str) return null
      const [h, m] = str.split(':').map(Number)
      return h * 60 + m
    }

    // format minutes → "9:00 AM" style
    const toLabel = (mins) => {
      let h = Math.floor(mins / 60)
      const m = mins % 60
      const ap = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      return `${h}:${String(m).padStart(2, '0')} ${ap}`
    }

    const start = toMins(avail.startTime)
    const end = toMins(avail.endTime)
    const bS = avail.breakStart ? toMins(avail.breakStart) : null
    const bE = avail.breakEnd ? toMins(avail.breakEnd) : null

    const slots = []
    for (let t = start; t < end; t += 15) {  // 15-min intervals
      if (bS !== null && bE !== null && t >= bS && t < bE) continue
      slots.push(toLabel(t))
    }
    return slots
  }
  console.log('📅 Doctor availability:', JSON.stringify(sel.doctor?.availability))
  const timeSlots = generateSlots(sel.doctor, sel.date)

  // ── validation ────────────────────────────────────────────────────────────
  const canContinue = () => {
    if (step === 1) return !!sel.hospital
    if (step === 2) return !!sel.dept
    if (step === 3) return !!sel.doctor && !!sel.time
    if (step === 4) return sel.name.trim() && sel.phone.trim() && sel.age.trim() && sel.gender.trim()
    return true
  }

  // const handleBack = () => {
  //   if (step === 1) { onHome(); return }
  //   if (step === 2) setSel(s => ({ ...s, dept: null, doctor: null, time: null }))
  //   if (step === 3) setSel(s => ({ ...s, doctor: null, time: null }))
  //   setStep(s => s - 1)
  // }


  const handleBack = () => {
    if (step === 1) { onHome(); return }
    if (step === 2) setSel(s => ({ ...s, dept: null, doctor: null, time: null }))
    // if (step === 3) {
    //   if (initialDept) { onHome(); return }  // came from dept click → go home
    //   setSel(s => ({ ...s, doctor: null, time: null }))
    // }
    if (step === 3) {
      if (initialDept) {
        setSel(s => ({ ...s, hospital: null, doctor: null, time: null }))
        setStep(1)
        return
      }
      setSel(s => ({ ...s, doctor: null, time: null }))
    }




    setStep(s => s - 1)
  }



  // ── confirm ───────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!patient) { setShowAuth(true); return }
    setLoadingBook(true); setErrBook('')
    try {
      const res = await createAppointment({
        vendorId: sel.hospital._id,
        doctorId: sel.doctor._id,
        specialization: sel.dept.departmentName,
        patientName: sel.name.trim(),
        phone: sel.phone.trim(),
        age: Number(sel.age),
        gender: sel.gender,
        notes: sel.notes.trim(),
        appointmentDate: sel.date,
        appointmentTime: sel.time,
      })
      console.log('📦 Full response:', JSON.stringify(res))

      const appt = res.appointment ?? res.data ?? res
      if (res.success || appt._id) {
        setTokenNum(String(appt.tokenNumber ?? res.tokenNumber ?? '—'))
        setBookingId(String(appt._id ?? ''))
        setConfirmed(true)
      } else {
        setErrBook(res.message || 'Booking failed. Please try again.')
      }
    } catch { setErrBook('Network error. Please try again.') }
    setLoadingBook(false)
  }

  if (!patient) {
    return (
      <>
        <div style={{
          minHeight: '60vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '40px 16px'
        }}>
          <div style={{
            textAlign: 'center', maxWidth: 380,
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: 16, padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>
              Login to Book
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              You need to be logged in to book an appointment.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: 'var(--green)', color: 'white', border: 'none',
                fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12
              }}
            >
              Login / Register
            </button>
            <button
              onClick={onHome}
              style={{
                width: '100%', padding: '11px', borderRadius: 10,
                background: 'transparent', color: 'var(--text-muted)',
                border: '1.5px solid var(--border)', fontSize: 14,
                cursor: 'pointer', fontWeight: 600
              }}
            >
              ← Back to Home
            </button>
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

  // ══════════════════════════════════════════════════════════════════════════
  // CONFIRMED SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (confirmed) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmed}>
          <div className={styles.checkCircle}>✓</div>
          <h2 className={styles.confirmedTitle}>Booking Confirmed!</h2>
          <p className={styles.confirmedSub}>Your token has been issued successfully.</p>
          <div className={styles.tokenCard}>
            <span className={styles.tokenLabel}>Token Number</span>
            <span className={styles.tokenNum}>#{tokenNum}</span>
            <div className={styles.tokenMeta}>
              <span>{sel.hospital.organisationName}</span><span>·</span>
              <span>{sel.dept.departmentName}</span><span>·</span>
              <span>{sel.doctor.name}</span><span>·</span>
              <span>{sel.time}</span>
            </div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#166534', lineHeight: 1.7 }}>
            📅 <strong>Date:</strong> {new Date(sel.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br />
            👤 <strong>Patient:</strong> {sel.name} &nbsp;|&nbsp; 📞 {sel.phone}
            {/* {bookingId && <><br />🆔 <strong>Booking ID:</strong> <code style={{ fontSize: 11 }}>{bookingId}</code></>} */}
          </div>
          {bookingId && (
            <div className={styles.tokenId}>
              <span>Appointment ID</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{bookingId}</code>
                <button
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(bookingId)

                      alert('Copied!')
                    } catch (err) {
                      // fallback
                      const textArea = document.createElement('textarea')
                      textArea.value = bookingId
                      document.body.appendChild(textArea)

                      textArea.select()
                      document.execCommand('copy')

                      document.body.removeChild(textArea)

                      alert('Copied!')
                    }
                  }}
                  style={{
                    padding: '2px 10px',
                    fontSize: 12,
                    borderRadius: 6,
                    border: '1px solid #38c1b3',
                    background: 'white',
                    color: '#38c1b3',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >Copy</button>
              </div>
              <p className={styles.tokenIdHint}>Use this ID in Track Token to check your status anytime.</p>
            </div>
          )}
          <p className={styles.confirmedHint}>Show this token at the counter. You'll be notified when it's your turn.</p>
          <button className={styles.homeBtn} onClick={onHome}>← Back to Home</button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <div className={styles.page}>
        <div className={styles.layout}>

          {/* ── Sidebar ── */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <p className={styles.sidebarLabel}>BOOKING STEPS</p>
              <div className={styles.stepsList}>
                {STEPS.map(s => (
                  <div key={s.num} className={`${styles.stepItem} ${step === s.num ? styles.active : ''} ${step > s.num ? styles.done : ''}`}>
                    <div className={styles.stepCircle}>{step > s.num ? '✓' : s.num}</div>
                    <div>
                      <div className={styles.stepLabel}>{s.label}</div>
                      <div className={styles.stepSub}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {step > 1 && (
              <div className={styles.tip} style={{ flexDirection: 'column', gap: 7 }}>
                <strong style={{ fontSize: 11, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Selection</strong>
                {sel.hospital && <div style={{ fontSize: 13 }}>🏥 {sel.hospital.organisationName}</div>}
                {sel.dept && <div style={{ fontSize: 13 }}>{deptIcon(sel.dept.departmentName)} {sel.dept.departmentName}</div>}
                {sel.doctor && <div style={{ fontSize: 13 }}>👨‍⚕️ {sel.doctor.name}</div>}
                {sel.time && <div style={{ fontSize: 13 }}>🕐 {sel.time} · {new Date(sel.date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>}
              </div>
            )}

            <div className={styles.tip}>
              <span>💡</span>
              <div><strong>Tip</strong><p>Arrive 10 minutes before your token is called. You'll receive a live update when you're next in line.</p></div>
            </div>
          </div>

          {/* ── Main ── */}
          <div className={styles.main}>

            {/* ━━━━ STEP 1 : HOSPITAL ━━━━ */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon}>🏥</div>

                  <div>
                    <h2>Choose a Hospital</h2>
                    <p>Select the facility you'd like to visit</p>
                  </div>
                </div>

                {/* SEARCH BAR */}
                <div className={styles.searchWrap}>
                  <input
                    type="text"
                    placeholder="Search hospital or location..."
                    value={hospitalSearch}
                    onChange={(e) =>
                      setHospitalSearch(e.target.value)
                    }
                    className={styles.searchInput}
                  />
                </div>

                {/* LOADING */}
                {loadingH && <Spinner />}

                {/* ERROR */}
                {errH && (
                  <ErrBox
                    msg={errH}
                    onRetry={fetchHospitals}
                  />
                )}

                {/* EMPTY */}
                {!loadingH &&
                  !errH &&
                  displayedHospitals.length === 0 && (
                    <div className={styles.emptyBox}>
                      No hospitals found.
                    </div>
                  )}

                {/* HOSPITAL GRID */}
                {!loadingH && !errH && displayedHospitals.length === 0 && (
                  <div className={styles.emptyBox}>No hospitals found.</div>
                )}

                {!loadingH && !errH && paginatedHospitals.length > 0 && (
                  <>
                    <div className={styles.hospitalGrid}>
                      {paginatedHospitals.map((h) => (
                        <button
                          key={h._id}
                          className={`${styles.hospitalCard} ${sel.hospital?._id === h._id ? styles.hospitalSelected : ''}`}
                          // onClick={() => setSel((s) => ({
                          //   ...s,
                          //   hospital: h,
                          //   dept: null,
                          //   doctor: null,
                          //   time: null,
                          // }))}
                          onClick={() => setSel((s) => ({
                            ...s,
                            hospital: h,
                            dept: initialDept || null,
                            doctor: null,
                            time: null,
                          }))}


                        >
                          {/* SELECTED CHECK */}
                          {sel.hospital?._id === h._id && (
                            <div className={styles.hospitalCheck}>✓</div>
                          )}

                          {/* ICON */}
                          <div className={styles.hospitalIcon}>🏥</div>

                          {/* NAME */}
                          <div className={styles.hospitalName}>{h.organisationName}</div>

                          {/* ADDRESS */}
                          {h.address && (
                            <div className={styles.hospitalInfo}>📍 {h.address}</div>
                          )}

                          {/* PHONE */}
                          {h.phone && (
                            <div className={styles.hospitalInfo}>📞 {h.phone}</div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 8, marginTop: 24
                      }}>
                        <button
                          onClick={() => setHospitalPage(p => Math.max(1, p - 1))}
                          disabled={hospitalPage === 1}
                          style={{
                            padding: '7px 16px', borderRadius: 8,
                            border: '1.5px solid var(--border)',
                            background: hospitalPage === 1 ? '#f3f4f6' : 'white',
                            color: hospitalPage === 1 ? '#9ca3af' : 'var(--text)',
                            cursor: hospitalPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: 13, fontWeight: 600
                          }}
                        >← Prev</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                          <button
                            key={pg}
                            onClick={() => setHospitalPage(pg)}
                            style={{
                              width: 36, height: 36, borderRadius: 8,
                              border: `1.5px solid ${pg === hospitalPage ? 'var(--green)' : 'var(--border)'}`,
                              background: pg === hospitalPage ? 'var(--green)' : 'white',
                              color: pg === hospitalPage ? 'white' : 'var(--text)',
                              cursor: 'pointer', fontSize: 13, fontWeight: 700
                            }}
                          >{pg}</button>
                        ))}

                        <button
                          onClick={() => setHospitalPage(p => Math.min(totalPages, p + 1))}
                          disabled={hospitalPage === totalPages}
                          style={{
                            padding: '7px 16px', borderRadius: 8,
                            border: '1.5px solid var(--border)',
                            background: hospitalPage === totalPages ? '#f3f4f6' : 'white',
                            color: hospitalPage === totalPages ? '#9ca3af' : 'var(--text)',
                            cursor: hospitalPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: 13, fontWeight: 600
                          }}
                        >Next →</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ━━━━ STEP 2 : DEPARTMENT ━━━━ */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon}>🏷️</div>
                  <div><h2>Choose a Department</h2><p>Departments available at {sel.hospital?.organisationName}</p></div>
                </div>
                {(loadingD || loadingDoc) && <Spinner />}
                {errD && <ErrBox msg={errD} onRetry={fetchDepts} />}
                {errDoc && <ErrBox msg={errDoc} onRetry={fetchDoctors} />}
                {!loadingD && !loadingDoc && deptsForHospital.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No departments found for this hospital.</p>
                )}
                {!loadingD && !loadingDoc && (
                  <div className={styles.deptGrid}>
                    {deptsForHospital.map(d => (
                      <button key={d._id}
                        className={`${styles.deptCard} ${sel.dept?._id === d._id ? styles.deptSelected : ''}`}
                        onClick={() => setSel(s => ({ ...s, dept: d, doctor: null, time: null }))}>
                        <span className={styles.deptIcon}>{deptIcon(d.departmentName)}</span>
                        <span className={styles.deptName}>{d.departmentName}</span>
                        {d.description && <span className={styles.deptWait} style={{ fontSize: '0.68rem' }}>{d.description.slice(0, 28)}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ━━━━ STEP 3 : DOCTOR & TIME ━━━━ */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon}>👨‍⚕️</div>
                  <div>
                    <h2>Select Doctor & Time</h2>
                    <p>
                      Choose your preferred doctor and slot for today ({todayName})
                    </p>
                  </div>
                </div>

                <h3 className={styles.subLabel}>Available Doctors</h3>

                {loadingDoc ? (
                  <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Loading doctors...</p>
                  </div>
                ) : errDoc ? (
                  <div className={styles.errorBox}>
                    <p>{errDoc}</p>
                    <button onClick={fetchDoctors}>Retry</button>
                  </div>
                ) : doctorsForSlot.length === 0 ? (
                  <div className={styles.emptyBox}>
                    No doctors available for {sel.dept?.departmentName} at the moment.
                  </div>
                ) : (
                  <div className={styles.doctorGrid}>
                    {doctorsForSlot.map((doc) => (
                      <button
                        key={doc._id}
                        className={`${styles.doctorCard} ${sel.doctor?._id === doc._id
                          ? styles.doctorSelected
                          : ''
                          }`}
                        onClick={() => {
                          setSel((s) => ({
                            ...s,
                            doctor: doc,
                            time: null,
                          }))
                        }}
                      >
                        {sel.doctor?._id === doc._id && (
                          <div className={styles.docCheckBadge}>✓</div>
                        )}

                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className={styles.docPhoto}
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'%3E%3Cpath d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z'/%3E%3C/svg%3E"
                          }}
                        />

                        <div className={styles.docName}>{doc.name}</div>

                        <div className={styles.docSpec}>
                          {doc.specialization}
                        </div>

                        <div className={styles.docClinic}>
                          🏥 {doc.vendorId?.organisationName || 'N/A'}
                        </div>

                        <div className={styles.docClinic}>
                          📅{' '}
                          {doc.availability?.length > 0
                            ? doc.availability
                              .map((a) => a.day.slice(0, 3))
                              .join(', ')
                            : 'N/A'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* DATE SELECTOR */}
                {sel.doctor && (
                  <>
                    <h3
                      className={styles.subLabel}
                      style={{ marginTop: 28 }}
                    >
                      Select Date
                    </h3>

                    <input
                      type="date"
                      min={today}
                      value={sel.date}
                      onChange={(e) =>
                        setSel((s) => ({
                          ...s,
                          date: e.target.value,
                          time: null,
                        }))
                      }
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.92rem',
                        border: '1.5px solid var(--border)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        outline: 'none',
                        background: 'var(--bg)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: 240,
                        marginBottom: 20,
                      }}
                    />

                    <h3 className={styles.subLabel}>
                      Available Slots
                    </h3>

                    {loadingSlots ? (
                      <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Loading slots...</p>
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className={styles.timeGrid}>
                        {timeSlots.map((t, i) => {
                          const normalizeTime = (time) => {
                            if (!time) return "";

                            const [clock, period] = time.trim().split(" ");
                            let [h, m] = clock.split(":");

                            return `${Number(h)}:${m} ${period.toUpperCase()}`;
                          };

                          const isBooked = bookedSlots.some(
                            (slot) => normalizeTime(slot) === normalizeTime(t)
                          );

                          const now = new Date()

                          const selectedDate = new Date(
                            sel.date + 'T00:00:00'
                          )

                          const isToday =
                            selectedDate.toDateString() ===
                            now.toDateString()

                          const slotTimeInMin = (time) => {
                            const [tm, period] = time.split(' ')
                            let [h, m] = tm.split(':').map(Number)

                            if (period === 'PM' && h !== 12) h += 12
                            if (period === 'AM' && h === 12) h = 0

                            return h * 60 + m
                          }

                          const currentMin =
                            now.getHours() * 60 + now.getMinutes()

                          const isPast =
                            isToday &&
                            slotTimeInMin(t) < currentMin

                          const isDisabled = isBooked || isPast

                          return (
                            <button
                              key={i}
                              disabled={isDisabled}
                              className={`${styles.timeSlot}
                    ${sel.time === t
                                  ? styles.timeSelected
                                  : ''
                                }
                    ${isBooked || isPast
                                  ? styles.timeBooked
                                  : ''
                                }`}
                              onClick={() =>
                                !isDisabled &&
                                setSel((s) => ({
                                  ...s,
                                  time: t,
                                }))
                              }
                            >
                              {t}{' '}
                              {isBooked
                                ? '🔴'
                                : isPast
                                  ? '⏰'
                                  : ''}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className={styles.emptyBox}>
                        No slots available for this date.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ━━━━ STEP 4 : YOUR DETAILS ━━━━ */}
            {step === 4 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon}>👤</div>
                  <div><h2>Your Details</h2><p>Please enter your personal information</p></div>
                </div>
                <div className={styles.form}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className={styles.field}>
                      <label>Full Name *</label>
                      <input type="text" placeholder="Enter your full name" value={sel.name}
                        onChange={e => setSel(s => ({ ...s, name: e.target.value }))} />
                    </div>
                    <div className={styles.field}>
                      <label>Phone Number *</label>
                      <input type="tel" placeholder="+91 XXXXX XXXXX" value={sel.phone}
                        onChange={e => setSel(s => ({ ...s, phone: e.target.value }))} />
                    </div>
                    <div className={styles.field}>
                      <label>Age *</label>
                      <input type="number" placeholder="Your age" min="1" max="120" value={sel.age}
                        onChange={e => setSel(s => ({ ...s, age: e.target.value }))} />
                    </div>
                    <div className={styles.field}>
                      <label>Gender *</label>
                      <select value={sel.gender} onChange={e => setSel(s => ({ ...s, gender: e.target.value }))}
                        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', outline: 'none', background: 'var(--bg)', color: sel.gender ? 'var(--text)' : 'var(--text-muted)', cursor: 'pointer' }}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Notes (optional)</label>
                    <textarea placeholder="Any symptoms or information for the doctor..." rows={3}
                      value={sel.notes} onChange={e => setSel(s => ({ ...s, notes: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}

            {/* ━━━━ STEP 5 : REVIEW ━━━━ */}
            {step === 5 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon}>📋</div>
                  <div><h2>Review & Confirm</h2><p>Please verify your booking details before confirming</p></div>
                </div>
                <div className={styles.review}>
                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LocalHospitalIcon style={{ fontSize: 18, color: '#0369a1' }} /> Hospital
                    </span>
                    <strong>{sel.hospital?.organisationName}</strong>
                  </div>

                  {sel.hospital?.address && (
                    <div className={styles.reviewRow}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LocationOnIcon style={{ fontSize: 18, color: '#15803d' }} /> Location
                      </span>
                      <strong>{sel.hospital.address}</strong>
                    </div>
                  )}

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MedicalServicesIcon style={{ fontSize: 18, color: '#7e22ce' }} /> Department
                    </span>
                    <strong>{sel.dept?.departmentName}</strong>
                  </div>

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PersonIcon style={{ fontSize: 18, color: '#c2410c' }} /> Doctor
                    </span>
                    <strong>{sel.doctor?.name}</strong>
                  </div>

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CalendarMonthIcon style={{ fontSize: 18, color: '#15803d' }} /> Date
                    </span>
                    <strong>{new Date(sel.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </div>

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AccessTimeIcon style={{ fontSize: 18, color: '#1d4ed8' }} /> Time Slot
                    </span>
                    <strong>{sel.time}</strong>
                  </div>

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AccountCircleIcon style={{ fontSize: 18, color: '#9d174d' }} /> Patient
                    </span>
                    <strong>{sel.name}</strong>
                  </div>

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PhoneIcon style={{ fontSize: 18, color: '#15803d' }} /> Phone
                    </span>
                    <strong>{sel.phone}</strong>
                  </div>

                  <div className={styles.reviewRow}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CakeIcon style={{ fontSize: 18, color: '#c2410c' }} /> Age / Gender
                    </span>
                    <strong>{sel.age} yrs · {sel.gender}</strong>
                  </div>

                  {sel.notes && (
                    <div className={styles.reviewRow}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <NoteAltIcon style={{ fontSize: 18, color: '#374151' }} /> Notes
                      </span>
                      <strong style={{ maxWidth: 280, textAlign: 'right' }}>{sel.notes}</strong>
                    </div>
                  )}
                </div>
                {errBook && <div style={{ marginBottom: 12 }}><ErrBox msg={errBook} /></div>}
                <div className={styles.reviewNotice}>
                  ✅ Your token will be confirmed after clicking "Confirm Booking". The slot will be reserved immediately.
                </div>
              </div>
            )}

            {/* ── Footer ── */}
            <div className={styles.footer}>
              <button className={styles.backBtn} onClick={handleBack}>
                {step === 1 ? '← Home' : '← Back'}
              </button>
              {step < 5
                // ? <button className={styles.continueBtn} disabled={!canContinue()} onClick={() => setStep(s => s + 1)}>Continue →</button>
                ? <button className={styles.continueBtn} disabled={!canContinue()} onClick={() => {
                  if (step === 1 && initialDept) { setStep(3); return }
                  setStep(s => s + 1)
                }}>Continue →</button>
                : <button className={styles.continueBtn} disabled={loadingBook} onClick={handleConfirm}>{loadingBook ? 'Booking…' : 'Confirm Booking ✓'}</button>
              }
            </div>

          </div>
        </div>
      </div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); handleConfirm() }} />
      )}
    </>
  )
}
