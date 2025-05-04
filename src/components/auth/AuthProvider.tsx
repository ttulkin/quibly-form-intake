
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserProfile = {
  id: string;
  user_type: 'company' | 'candidate' | 'admin';
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Enhanced fetchProfile function with better error handling
  const fetchProfile = async (userId: string) => {
    try {
      console.log(`Fetching profile for user ID: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (!data) {
        console.log("No profile found for user ID:", userId);
        return null;
      }
      
      console.log("Profile data received:", data);
      return data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`Auth state changed, event: ${event}, has session: ${!!currentSession}, url: ${window.location.href}`);
        
        // Always update session and user state synchronously
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`User authenticated: ${currentSession.user.email}`);
          
          // Use a timeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
            setLoading(false);
            
            // Check if this is a verification from form submission
            const url = new URL(window.location.href);
            if (url.pathname === '/verify') {
              console.log("Auth verification detected at /verify route", {
                params: Object.fromEntries(url.searchParams.entries())
              });
              
              // If this is a form-originated flow, we'll track it for dashboard usage
              if (url.searchParams.get('from_form') === 'true') {
                localStorage.setItem('just_submitted_form', 'true');
                console.log("Form submission flow detected, set flag in localStorage");
              }
            }
          }, 0);
        } else {
          console.log("No user session");
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      console.log("Checking for existing session...");
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      console.log(`Initial session check: ${initialSession ? "Session found" : "No session"}`);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        const profileData = await fetchProfile(initialSession.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      console.log("AuthProvider cleanup - unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("Signing out user");
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('just_submitted_form');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
