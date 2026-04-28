// lib/contactApi.ts
import { apiClient } from "./apiClient";

export interface ContactPayload {
  full_name: string;
  email_address: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  full_name: string;
  email_address: string;
  message: string;
  created_at: string;
  user?: number | null;
}

export interface AdminContact {
  id: number;
  full_name: string;
  email_address: string;
  message: string;
  created_at: string;
  updated_at?: string;
  user?: number | null;
}

export async function submitContact(
  data: ContactPayload,
  recaptchaToken: string,
): Promise<ContactResponse> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, recaptchaToken }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to submit contact form");
  }

  return res.json();
}

export async function fetchAdminContacts(): Promise<AdminContact[]> {
  return apiClient.request<AdminContact[]>({
    url: "/dictionary/contact_admin/",
    method: "GET",
  });
}

export async function fetchAdminContact(id: number): Promise<AdminContact> {
  return apiClient.request<AdminContact>({
    url: `/dictionary/contact_admin/${id}/`,
    method: "GET",
  });
}

export async function deleteAdminContact(id: number): Promise<void> {
  await apiClient.request<void>({
    url: `/dictionary/contact_admin/${id}/`,
    method: "DELETE",
  });
}
