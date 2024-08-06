import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: () => { },
});

export default function AuthProvider({ children }) {
  // const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
