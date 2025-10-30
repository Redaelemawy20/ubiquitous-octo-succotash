import { useState, useEffect, type ReactNode } from "react";
import { getCurrentUser, logoutUser } from "../lib/api";
import { AuthContext, type User } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by calling the backend
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData?.user) {
          setUser(userData.user);
        }
      } catch {
        // User not authenticated or network error
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await logoutUser(); // Call backend to clear cookie
    } catch (error) {
      // Even if logout fails, clear local state
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
