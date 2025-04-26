"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/user/register", form);
      router.push("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/30">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <Input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="mb-3"
        />
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mb-3"
        />
        <Input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <Button onClick={handleRegister} className="w-full">
          Register
        </Button>
      </div>
    </div>
  );
}
