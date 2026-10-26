import { createContext, useContext, useEffect, useState } from "react";

import apiRequest from "####";



const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const { setIsLoading } = useLoader();

  const checkAuth = async () => {
    
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}