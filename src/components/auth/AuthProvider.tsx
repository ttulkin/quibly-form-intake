
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
  profileLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  // Consolidated profile fetching function with error handling and retries
  const safeLoadProfile = async (userId: string, retryCount = 0) => {
    console.log(`Loading profile for user: ${userId}, setting profileLoading=true, retry=${retryCount}`);
    setProfileLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // For new users, try to create profile if it doesn't exist
        if (error.code === 'PGRST116' && retryCount < 1) {
          console.log("Profile not found, attempting to create one");
          try {
            // Create a default company profile
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({ 
                id: userId,
                user_type: "company" 
              });
            
            if (insertError) {
              console.error("Error creating profile:", insertError);
              setProfile(null);
            } else {
              // Try to fetch the profile again after creating it
              console.log("Default profile created, fetching again");
              return safeLoadProfile(userId, retryCount + 1);
            }
          } catch (createError) {
            console.error("Exception creating profile:", createError);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } else if (!data) {
        console.log("No profile found for user ID:", userId);
        setProfile(null);
      } else {
        console.log("Profile data loaded:", data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Exception during profile fetch:', error);
      setProfile(null);
    } finally {
      console.log(`Profile load complete, setting profileLoading=false`);
      setProfileLoading(false);
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
            await safeLoadProfile(currentSession.user.id);
            setLoading(false);
          }, 100); // Slight delay to avoid race conditions
        } else {
          console.log("No user session");
          setProfile(null);
          setProfileLoading(false);
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
        await safeLoadProfile(initialSession.user.id);
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
    <AuthContext.Provider value={{ session, user, profile, loading, profileLoading, signOut }}>
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
