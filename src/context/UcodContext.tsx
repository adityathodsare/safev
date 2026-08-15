"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UcodContextType {
  ucod: string | null;
  isValidated: boolean;
  isChecking: boolean;
  validateUcod: (code: string) => boolean;
  clearUcod: () => void;
}

const VALID_UCOD = "MHXXRTXXXX";

const UcodContext = createContext<UcodContextType>({
  ucod: null,
  isValidated: false,
  isChecking: true,
  validateUcod: () => false,
  clearUcod: () => {},
});

export const UcodProvider = ({ children }: { children: React.ReactNode }) => {
  const [ucod, setUcod] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("safev_ucod");
      if (stored && stored.trim().toUpperCase() === VALID_UCOD) {
        setUcod(stored.trim().toUpperCase());
        setIsValidated(true);
      } else {
        setUcod(null);
        setIsValidated(false);
      }
    } catch (e) {
      console.error("Failed to read UCOD session:", e);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const validateUcod = (inputCode: string): boolean => {
    if (!inputCode) return false;
    const formatted = inputCode.trim().toUpperCase();
    if (formatted === VALID_UCOD) {
      try {
        sessionStorage.setItem("safev_ucod", formatted);
      } catch (e) {
        console.error("Failed to save UCOD session:", e);
      }
      setUcod(formatted);
      setIsValidated(true);
      return true;
    }
    return false;
  };

  const clearUcod = () => {
    try {
      sessionStorage.removeItem("safev_ucod");
    } catch (e) {
      console.error("Failed to clear UCOD session:", e);
    }
    setUcod(null);
    setIsValidated(false);
  };

  return (
    <UcodContext.Provider
      value={{
        ucod,
        isValidated,
        isChecking,
        validateUcod,
        clearUcod,
      }}
    >
      {children}
    </UcodContext.Provider>
  );
};

export const useUcod = () => useContext(UcodContext);
