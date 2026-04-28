import { createContext, useContext, useState } from "react";
import { getStoredUser, logout as clearStorage } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const loginUser = (userData) => setUser(userData);

  const logoutUser = () => {
    clearStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
