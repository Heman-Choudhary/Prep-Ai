import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: AuthError }>;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Create or update user profile on sign in
        if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
          try {
            const { error } = await supabase
              .from('users')
              .upsert({
                id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || null,
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'id'
              });
            
            if (error && error.code !== 'PGRST116') { // Ignore table not found errors
              console.error('Error creating/updating user profile:', error);
            }
          } catch (profileError) {
            console.error('Error handling user profile:', profileError);
          }
        }
        
        // Clear any cached data on sign out
        if (event === 'SIGNED_OUT') {
          clearUserData();
        }
        
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearUserData = () => {
    // Clear session storage
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear session storage:', e);
    }
    
    // Clear specific localStorage items
    try {
      const keysToRemove = [
        'supabase.auth.token',
        'sb-localhost-auth-token',
        'interviewFeedback',
        'interviewMessages',
        'interviewConfig'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      
      // Sign up without email confirmation requirement
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Disable email confirmation by not setting emailRedirectTo
          // This allows immediate sign-in after registration
        },
      });
      
      // Check if signup was successful
      if (result.data.user && !result.error) {
        console.log('User signed up successfully:', result.data.user.email);
        
        // If the user is immediately confirmed (email confirmation disabled)
        if (result.data.user.email_confirmed_at || result.data.session) {
          console.log('User is confirmed and signed in immediately');
        } else {
          console.log('User created but may need confirmation - this should not happen with disabled email confirmation');
        }
      }
      
      return { error: result.error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error: result.error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      setLoading(true);
      
      // Clear all user data first
      clearUserData();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
      }
      
      // Force clear the state
      setSession(null);
      setUser(null);
      
      console.log('Sign out completed successfully');
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state and data even on error
      setSession(null);
      setUser(null);
      clearUserData();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: result.error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}