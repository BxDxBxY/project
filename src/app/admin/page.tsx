"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TokenManager } from "@/lib/tokenManager";
// import { TokenManager } from '@/lib/api';

export default function AdminIndexPage() {
  const router = useRouter();
  // console.log(TokenManager.getAccessToken())
  useEffect(() => {
    if (TokenManager.getAccessToken()) {
      router.replace("/admin/terms");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);
  return null;
}
