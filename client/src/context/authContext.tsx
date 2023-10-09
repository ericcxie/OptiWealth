import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth } from "../utils/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

interface Props {
  children: ReactNode;
}

export const AuthContext = createContext({
  currentUser: null as User | null,
  setCurrentUser: (_user: User) => {},
  signOut: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = () => {
    auth.signOut();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
