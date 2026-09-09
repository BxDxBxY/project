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

      if (!access && !refresh) {
        router.replace("/admin/login");
        setChecking(false);
        return;
      }

      try {
        if (access) {
          const res = await verifyToken(access);
          if (!res.code && !res.detail) {
            setChecking(false);
            return;
          }
        }

        if (refresh) {
          await refreshToken();
          setChecking(false);
          return;
        }

        await TokenManager.clearTokens();
        router.replace("/admin/login");
        setChecking(false);
      } catch (err: any) {
        if (err.message.includes("Network Error")) {
          setError(
            "Authentication server unavailable. Please try again later.",
          );
        } else {
          await TokenManager.clearTokens();
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
        <p className="text-blue-900">Checking admin access...</p>
      </div>
    );
  }

  return <>{children}</>;
};
