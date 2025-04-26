"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setAuthToken, setUserId } from "@/lib/auth";

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/v1/user/login", {
        email,
        password,
      });

      // ✅ FIX: Cast res.data to expected LoginResponse type
      const { access_token, user_id } = res.data as LoginResponse;

      setAuthToken(access_token);
      setUserId(user_id);
      router.push("/meals");
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/30">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Login</h1>
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
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
