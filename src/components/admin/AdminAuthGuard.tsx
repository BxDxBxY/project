// components/admin/AdminAuthGuard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TokenManager } from "@/lib/tokenManager";
import { verifyToken, refreshToken } from "@/lib/authApi";

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const access = TokenManager.getAccessToken();
      const refresh = TokenManager.getRefreshToken();

      console.log("AdminAuthGuard: Access token:", access ? "present" : "missing");
      console.log("AdminAuthGuard: Refresh token:", refresh ? "present" : "missing");

      if (!access && !refresh) {
        console.log("No tokens, redirecting to login");
        router.replace("/admin/login");
        setChecking(false);
        return;
      }

      try {
        if (access) {
          const res = await verifyToken(access);
          console.log("verifyToken response:", res);
          if (!res.code && !res.detail) {
            setChecking(false);
            return;
          }
          console.log("Access token invalid, attempting refresh");
        }

        if (refresh) {
          const data = await refreshToken(refresh);
          console.log("refreshToken response:", data);
          if (data.access) {
            TokenManager.setTokens(data.access, refresh); // Update access token
            setChecking(false);
            return;
          }
          console.log("Refresh token invalid, clearing tokens");
          TokenManager.clearTokens();
          router.replace("/admin/login");
          setChecking(false);
          return;
        }

        console.log("No valid tokens, redirecting to login");
        TokenManager.clearTokens();
        router.replace("/admin/login");
        setChecking(false);
      } catch (err: any) {
        console.error("AdminAuthGuard error:", {
          message: err.message,
          stack: err.stack,
        });
        if (err.message.includes("Network Error")) {
          setError("Authentication server unavailable. Please try again later.");
        } else {
          TokenManager.clearTokens();
          router.replace("/admin/login");
        }
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking admin access...</p>
      </div>
    );
  }

  return <>{children}</>;
};