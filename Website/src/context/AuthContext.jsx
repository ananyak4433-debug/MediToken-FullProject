
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// const API_URL = "http://localhost:7000/api";
const API_URL =
  import.meta.env.VITE_API_URL || "https://meditoken-fullproject.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // ================= LOAD USER ON REFRESH =================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/patients/profile`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.patient);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Profile Load Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ================= REGISTER =================
  const register = async (form) => {
    try {
      const res = await fetch(`${API_URL}/patients/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message,
        };
      }

      setUser(data.patient);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network Error",
      };
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/patients/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message,
        };
      }

      setUser(data.patient);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network Error",
      };
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await fetch(`${API_URL}/patients/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }

    setUser(null);

    return {
      success: true,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);