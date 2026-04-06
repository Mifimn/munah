"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Define the shape of our context memory
type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
};

// Create the context with default empty values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check who is logged in when the app first loads
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        setIsLoading(false);
        return;
      }

      setUser(session.user);
      await checkAdminStatus(session.user.id);
    };

    initializeAuth();

    // 2. Listen for any changes (like someone logging in or logging out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      } else {
        // If they log out, wipe the memory
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // 3. The function that checks the profiles table for clearance
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setIsAdmin(data.is_admin === true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error verifying admin clearance:", err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// A simple custom hook so you can easily pull this data in any file
export const useAuth = () => useContext(AuthContext);