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
  data: ContactPayload
): Promise<ContactResponse> {
  return apiClient.request<ContactResponse>({
    url: "/dictionary/contact/",
    method: "POST",
    data,
  });
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
