
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7000/api";

// ✅ FIXED: same key as AuthContext
// const getToken = () => localStorage.getItem('token');



// const authHeaders = () => ({
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${getToken()}`,
// });

// ─── AUTH ─────────────────────────────

export const registerPatient = async (data) => {
  const res = await fetch(`${BASE_URL}/patients/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginPatient = async (data) => {
  const res = await fetch(`${BASE_URL}/patients/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

// ─── DOCTORS ──────────────────────────

export const getDoctors = async () => {
  const res = await fetch(`${BASE_URL}/doctors/public`, {
    credentials: 'include',   // ✅ sends cookies
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  // handle all response formats
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.doctors)) return data.doctors;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

// ─── APPOINTMENTS ─────────────────────

export const createAppointment = async (data) => {
  const res = await fetch(`${BASE_URL}/appointments/create`, {
    method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAppointmentById = async (id) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`);
  return res.json();
};

export const getMyAppointments = async () => {
  const res = await fetch(`${BASE_URL}/appointments/my`, {
    credentials: "include",
  });
  return res.json();
};

// export const getBookedSlots = async (doctorId, day) => {
//   const res = await fetch(
//     `${BASE_URL}/appointments/booked-slots/${doctorId}?day=${day}`,
//     { credentials: 'include' }
//   );
//   const data = await res.json();
//   return data.bookedTimes || [];
// };

export const getBookedSlots = async (doctorId, date) => {
  const res = await fetch(
    `${BASE_URL}/appointments/booked-slots/${doctorId}?date=${date}`,
    { credentials: 'include' }
  );
  const data = await res.json();
  return data.bookedTimes || [];
};


// ─── DEPARTMENTS ──────────────────────

export const getDepartments = async () => {
  const res = await fetch(`${BASE_URL}/admin/departments/getall`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return Array.isArray(data.departments) ? data.departments : [];
};

// ─── HOSPITALS ──────────────────────
export const getHospitals = async () => {
  const res = await fetch(`${BASE_URL}/vendors/public`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return Array.isArray(data.vendors) ? data.vendors : [];
};


// ─── TRACK TOKENS ──────────────────────
export const getAppointmentByToken = async ({ tokenNumber, department }) => {
  const res = await fetch(
    `${BASE_URL}/appointments/track?tokenNumber=${tokenNumber}&department=${encodeURIComponent(department)}`
  )
  return res.json()
}


export const getAppointmentByPhone = async ({ phone, date }) => {
  const res = await fetch(
    `${BASE_URL}/appointments/track-by-phone?phone=${phone}&date=${date || ''}`
  )
  return res.json()
}


export const cancelAppointment = async (id) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ status: 'cancelled' })
  });
  return res.json();
};


export const sendChatMessage = async (payload) => {

  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();
};