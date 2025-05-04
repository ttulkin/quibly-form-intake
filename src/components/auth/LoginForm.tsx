
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  
  // Extract the redirect destination from location state
  const from = location.state?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || email.trim() === "") {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a well-formed redirect URL with explicit origin
      const redirectTo = new URL("/verify", window.location.origin).toString();
      console.log("Magic link will redirect to:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        throw error;
      }

      console.log("Magic link sent successfully");
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link. Click the link to access your dashboard.",
        duration: 8000,
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Quibly</CardTitle>
        <CardDescription>
          Enter your work email to receive a magic link
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="w-full"
            type="submit"
            disabled={loading || !email}
          >
            {loading ? "Sending magic link..." : "Send Magic Link"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
