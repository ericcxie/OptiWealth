import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth } from "../utils/firebase";
import { User } from "firebase/auth";

interface AuthContextProps {
  children: ReactNode;
}

// Define an authentication context with a default value of null
const AuthContext = createContext<User | null>(null);

// Create a provider component
export const AuthProvider = ({ children }: AuthContextProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Use Firebase's auth state change listener to update the user status
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
