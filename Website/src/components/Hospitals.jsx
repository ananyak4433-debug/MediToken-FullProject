import { useState, useEffect } from 'react'
import styles from './Hospitals.module.css'
import { getHospitals } from '../api'

export default function Hospitals({ onNav }) {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    getHospitals()
      .then(data => setHospitals(data))
      .catch(() => setHospitals([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = hospitals.filter(h =>
    h.organisationName?.toLowerCase().includes(search.toLowerCase()) ||
    h.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>HOSPITALS</span>
          <h2 className={styles.heading}>Our partner<br />hospitals</h2>
          <p className={styles.sub}>
            Browse all hospitals and clinics available on MediToken.
            Book a token at any of these verified healthcare providers.
          </p>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search by hospital name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Count */}
        {!loading && (
          <div className={styles.count}>
            Showing <strong>{filtered.length}</strong> hospital{filtered.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className={styles.loading}>Loading hospitals...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            No hospitals found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((h, i) => (
              <div key={h._id || i} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.iconBox}>🏥</div>
                  <span className={styles.stepNum}>0{i + 1 < 10 ? i + 1 : i + 1}</span>
                </div>
                <h3 className={styles.hospitalName}>{h.organisationName}</h3>
                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}>📍</span>
                    <span>{h.address}</span>
                  </div>
                  {h.phone && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaIcon}>📞</span>
                      <span>{h.phone}</span>
                    </div>
                  )}
                  {h.registrationNumber && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaIcon}>🪪</span>
                      <span>Reg: {h.registrationNumber}</span>
                    </div>
                  )}
                </div>
                <div className={styles.badge}>✅ Verified</div>
                <button
                  className={styles.bookBtn}
                  onClick={() => onNav('book')}
                >
                  Book a Token →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <h3>Can't find your hospital?</h3>
          <p>We're onboarding new hospitals every week. Contact us to get your hospital listed.</p>
          <button className={styles.ctaBtn} onClick={() => onNav('contact')}>
            Contact Us →
          </button>
        </div>

      </div>
    </section>
  )
}