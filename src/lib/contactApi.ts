// lib/contactApi.ts
import { apiClient } from "./apiClient";
import type { ApiError } from "@/types";

export interface ContactPayload {
  full_name: string;
  email_address: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  full_name: string;
  email_address: string;
  message: string;
  created_at: string;
}

export interface AdminContact {
  id: number;
  full_name: string;
  email_address: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Send one message from the public form.
 *
 * Goes to the same-origin /api/contact route, which holds the reCAPTCHA
 * secret and the rate limit. Failures are rethrown in the same shape
 * apiClient uses so the page can render them with apiErrorMessage().
 */
export async function submitContact(
  data: ContactPayload,
  recaptchaToken?: string,
): Promise<ContactResponse> {
  let res: Response;

  try {
    res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, recaptchaToken }),
    });
  } catch {
    const offline =
      typeof navigator !== "undefined" && navigator.onLine === false;
    const error: ApiError = {
      message: "Network Error",
      status: 0,
      kind: offline ? "offline" : "network",
    };
    throw error;
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const error: ApiError = {
      message: body?.message || "Failed to submit contact form",
      status: res.status,
      kind:
        res.status === 429
          ? "rateLimited"
          : res.status === 403
            ? "forbidden"
            : res.status >= 500
              ? "server"
              : "client",
      details: body,
    };
    throw error;
  }

  return body as ContactResponse;
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

/** Mark a message read or unread without opening it. */
export async function setContactRead(
  id: number,
  isRead: boolean,
): Promise<AdminContact> {
  return apiClient.request<AdminContact>({
    url: `/dictionary/contact_admin/${id}/`,
    method: "PATCH",
    data: { is_read: isRead },
  });
}

export async function deleteAdminContact(id: number): Promise<void> {
  await apiClient.request<void>({
    url: `/dictionary/contact_admin/${id}/`,
    method: "DELETE",
  });
}
