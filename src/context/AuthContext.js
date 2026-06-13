"use client"; // This ensures React hooks work in Next.js

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "./NavigationContext";

const AuthContext = createContext(); // Ensure this is correctly created

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();

  // Check for token in localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (res.ok) {
      const data = await res.text();
      setToken(data);
      localStorage.setItem("jwtToken", data);
      navigateWithLoader(router, "/confirmPurchase");
    } else {
      alert("Invalid Credentials");
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem("jwtToken");
    navigateWithLoader(router, "/register");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
