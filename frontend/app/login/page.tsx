"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  // const supabase = createClientComponentClient(); // Removed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Store session for compatibility
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem("user_id", data.session.user.id);
      }
      router.push("/meals");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/30">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Login via Supabase</h1>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <Button onClick={handleLogin} className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline hover:text-blue-800">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
