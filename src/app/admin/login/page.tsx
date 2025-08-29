// Copied from src/app/admin/login.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, verifyToken } from "@/lib/authApi";
import { TokenManager } from "@/lib/tokenManager";
// import { login, TokenManager, verifyToken } from "@/lib/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(
    TokenManager.getAccessToken()
  );

  const router = useRouter();

  // If already logged in → redirect
  useEffect(() => {
    if (accessToken) {
      verifyToken(accessToken).then((res) => {
        if (!res.code && !res.detail) {
          router.replace("/admin/terms");
        } else {
          TokenManager.clearTokens();
          setAccessToken(undefined);
        }
      });
    }
  }, [accessToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await login({ username, password });
      TokenManager.setTokens(tokens.access, tokens.refresh);
      setAccessToken(tokens.access); // ✅ обновляем state
      router.replace("/admin/terms");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-700 mb-4 sm:mb-6 tracking-tight">
          Login
        </h1>
        {error && (
          <div className="mb-4 sm:mb-6 text-red-600 text-sm sm:text-base text-center">
            {error}
          </div>
        )}
        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-700 text-sm sm:text-base mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            required
            autoFocus
          />
        </div>
        <div className="mb-6 sm:mb-8">
          <label className="block text-gray-700 text-sm sm:text-base mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
