"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TokenManager, verifyToken } from "@/lib/api";

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = TokenManager.getAccessToken();
      if (!token) {
        router.replace("/admin/login");
        // setChecking(false);
        return;
      }
      try {
        await verifyToken(token); // If not 200, will throw
        setChecking(false);
      } catch {
        TokenManager.clearTokens();
        router.replace("/admin/login");
        // setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking admin access...
      </div>
    );
  }
  return <>{children}</>;
};
