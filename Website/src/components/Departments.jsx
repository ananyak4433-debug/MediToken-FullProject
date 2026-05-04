
import { useState, useEffect } from 'react'
import styles from './Departments.module.css'
import { getDepartments } from '../api'

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

const departmentIcons = {
  'cardiology':    <FavoriteIcon style={{ fontSize: 28, color: '#ef4444' }} />,
  'orthopaedics':  <AccessibilityNewIcon style={{ fontSize: 28 }} />,
  'orthopedics':   <AccessibilityNewIcon style={{ fontSize: 28 }} />,
  'neurology':     <PsychologyIcon style={{ fontSize: 28, color: '#6c5ce7' }} />,
  'ophthalmology': <VisibilityIcon style={{ fontSize: 28 }} />,
  'paediatrics':   <ChildCareIcon style={{ fontSize: 28 }} />,
  'pediatrics':    <ChildCareIcon style={{ fontSize: 28 }} />,
  'dental':        <MedicalServicesIcon style={{ fontSize: 28 }} />,
  'general opd':   <LocalHospitalIcon style={{ fontSize: 28 }} />,
  'dermatology':   <ScienceIcon style={{ fontSize: 28 }} />,
  'radiology':     <BiotechIcon style={{ fontSize: 28 }} />,
  'gynaecology':   <FemaleIcon style={{ fontSize: 28, color: '#e84393' }} />,
  'gynecology':    <FemaleIcon style={{ fontSize: 28, color: '#e84393' }} />,
  'pharmacy':      <MedicationIcon style={{ fontSize: 28 }} />,
  'ent':           <HearingIcon style={{ fontSize: 28 }} />,
  'default':       <LocalHospitalIcon style={{ fontSize: 28, color: '#1D9E75' }} />
};

const getIcon = (name) =>
  departmentIcons[name?.toLowerCase().trim()] || departmentIcons.default;

export default function Departments({ onBook }) {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments()
      .then(data => setDepts(data.filter(d => d.status === 'active')))
      .catch(() => setDepts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.section} id="departments">
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>DEPARTMENTS</span>
          <h2 className={styles.heading}>
            All specialties,<br />one platform
          </h2>
          <p className={styles.sub}>
            Browse all available departments and their current estimated wait times.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#38c1b3' }}>
            Loading departments...
          </div>
        ) : depts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
            No departments available at the moment.
          </div>
        ) : (
          <div className={styles.grid}>
            {depts.map((d, i) => (
              <button key={d._id || i} className={styles.card} onClick={onBook}>
                <div className={styles.icon}>{getIcon(d.departmentName)}</div>
                <span className={styles.name}>{d.departmentName}</span>
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}