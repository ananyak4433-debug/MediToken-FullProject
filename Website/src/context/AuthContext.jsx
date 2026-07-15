// import { createContext, useContext, useState, useEffect, useRef } from 'react';
// // import { jwtDecode } from 'jwt-decode';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   // const logoutTimer = useRef(null); 

//   // ================= AUTO LOGOUT SETUP =================
//   // const setAutoLogout = (token) => {
//   //   try {
//   //     const decoded = jwtDecode(token);
//   //     const expiryTime = decoded.exp * 1000;
//   //     const remainingTime = expiryTime - Date.now();

//   //     if (remainingTime <= 0) {
//   //       logout();
//   //     } else {
//   //       logoutTimer.current = setTimeout(() => {
//   //         logout();
//   //       }, remainingTime);
//   //     }
//   //   } catch {
//   //     logout();
//   //   }
//   // };

//   // ================= LOAD USER ON REFRESH =================
//   useEffect(() => {
//     // const savedUser = localStorage.getItem("user");

// if (savedUser) {
//     setUser(JSON.parse(savedUser));
// }

//     return () => {
//       if (logoutTimer.current) {
//         clearTimeout(logoutTimer.current); // cleanup
//       }
//     };
//   }, []);

//   // ================= REGISTER =================
//   const register = async (form) => {
//   try {
//     const res = await fetch("http://localhost:7000/api/patients/register", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(form)
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return {
//         success: false,
//         message: data.message
//       };
//     }

//     setUser(data.patient);
//     // localStorage.setItem("user", JSON.stringify(data.patient));

//     return {
//       success: true
//     };

//   } catch {
//     return {
//       success: false,
//       message: "Network error"
//     };
//   }
// };

//   // ================= LOGIN =================
//   const login = async (email, password) => {
//   try {
//     const res = await fetch("http://localhost:7000/api/patients/login", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return {
//         success: false,
//         message: data.message
//       };
//     }

//     setUser(data.patient);
//     // localStorage.setItem("user", JSON.stringify(data.patient));

//     return {
//       success: true
//     };

//   } catch {
//     return {
//       success: false,
//       message: "Network error"
//     };
//   }
// };

//   // ================= LOGOUT =================
//  const logout = async () => {
//   try {
//     await fetch("http://localhost:7000/api/patients/logout", {
//       method: "POST",
//       credentials: "include"
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   // localStorage.removeItem("user");
//   setUser(null);

//   return {
//     success: true
//   };
// };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ================= HOOK =================
// export const useAuth = () => useContext(AuthContext);
















import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:7000/api";

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