import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const logoutTimer = useRef(null); // ✅ to clear timer

  // ================= AUTO LOGOUT SETUP =================
  const setAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const remainingTime = expiryTime - Date.now();

      if (remainingTime <= 0) {
        logout();
      } else {
        logoutTimer.current = setTimeout(() => {
          logout();
        }, remainingTime);
      }
    } catch {
      logout();
    }
  };

  // ================= LOAD USER ON REFRESH =================
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setAutoLogout(token); // ✅ restore timer
    }

    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current); // cleanup
      }
    };
  }, []);

  // ================= REGISTER =================
  const register = async (form) => {
    try {
      const res = await fetch('http://localhost:7000/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      setUser(data.patient);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.patient));

      setAutoLogout(data.token); // ✅ start timer

      return { success: true };
    } catch {
      return { success: false, message: 'Network error' };
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:7000/api/patients/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      setUser(data.patient);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.patient));

      setAutoLogout(data.token); // ✅ start timer

      return { success: true };
    } catch {
      return { success: false, message: 'Network error' };
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:7000/api/patients/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

    } catch (error) {
      console.error("Logout API failed");
    }

    // ✅ ALWAYS clear client state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; Max-Age=0; path=/;";
    setUser(null);

    // ✅ clear timer
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ================= HOOK =================
export const useAuth = () => useContext(AuthContext);