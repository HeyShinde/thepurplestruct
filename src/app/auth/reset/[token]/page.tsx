"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Password reset! You can now sign in.");
      setTimeout(() => router.push("/auth/signin"), 1500);
    } else setError(data.error || "Something went wrong.");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <form className="flex flex-col gap-4 mb-6" onSubmit={handleSubmit}>
          <input
            name="password"
            type="password"
            placeholder="New Password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        {message && <div className="text-green-600 mb-2 text-center">{message}</div>}
      </div>
    </div>
  );
}