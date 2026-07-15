
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Departments from './components/Departments'
import WhyMediToken from './components/WhyMediToken'
import CTA from './components/CTA'
import Footer from './components/Footer'
import BookingFlow from './components/BookingFlow'
import DeptBookingFlow from './components/Deptbookingflow.jsx'
import TrackToken from './components/TrackToken'
import WhatsAppFloat from "./components/WatsappFloat"
import FAQ from './components/FAQ'
import Contact from './components/ContactUs.jsx'
import AboutUs from './components/AboutUs'
import Hospitals from './components/Hospitals'
import MyBookings from './components/MyBookings'
import ChatBot from './components/ChatBot';
import ChatLauncher from './components/ChatLauncher';

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedDept, setSelectedDept] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)

  const handleNav = (target, dept) => {
    setSelectedDept(dept)
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  let content

  if (page === 'book') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="book" />
        {selectedDept ? (
          <DeptBookingFlow onHome={() => handleNav('home')} dept={selectedDept} />
        ) : (
          <BookingFlow onHome={() => handleNav('home')} />
        )}
      </>
    )
  } else if (page === 'track') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="track" />
        <TrackToken />
        <Footer onNav={handleNav} />
      </>
    )
  } else if (page === 'how') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="how" />
        <div style={{ paddingTop: '64px' }}>
          <HowItWorks />
          <CTA onBook={() => handleNav('book')} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else if (page === 'departments') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="departments" />
        <div style={{ paddingTop: '64px' }}>
          <Departments onBook={(dept) => handleNav('book', dept)} />
          <CTA onBook={() => handleNav('book')} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else if (page === 'faq') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="faq" />
        <div style={{ paddingTop: '64px' }}>
          <FAQ onNav={handleNav} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else if (page === 'contact') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="contact" />
        <div style={{ paddingTop: '64px' }}>
          <Contact onNav={handleNav} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else if (page === 'about') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="about" />
        <div style={{ paddingTop: '64px' }}>
          <AboutUs onNav={handleNav} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else if (page === 'hospitals') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="hospitals" />
        <div style={{ paddingTop: '64px' }}>
          <Hospitals onNav={handleNav} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else if (page === 'my-bookings') {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="my-bookings" />
        <div style={{ paddingTop: '64px' }}>
          <MyBookings onHome={() => handleNav('home')} />
          <Footer onNav={handleNav} />
        </div>
      </>
    )
  } else {
    content = (
      <>
        <Navbar onNav={handleNav} activePage="home" />
        <Hero onNav={handleNav} />
        <HowItWorks />
        <Departments onBook={(dept) => handleNav('book', dept)} />
        <WhyMediToken />
        <CTA onBook={() => handleNav('book')} />
        <Footer onNav={handleNav} />
      </>
    )
  }

  return (
    <>
      {content}

      <WhatsAppFloat
        phone="919876543210"
        message="Hi, I want to book a token"
      />

      {chatOpen && (
        <ChatBot closeChat={() => setChatOpen(false)} />
      )}

      <ChatLauncher openChat={() => setChatOpen(true)} />
    </>
  )
}