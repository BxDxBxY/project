import { apiClient } from "./apiClient";
import { Term, CreateTermData, UpdateTermData } from "@/types";

export const fetchTerms = () =>
  apiClient.request<Term[]>({ method: "GET", url: "/dictionary/term/" });

export const fetchTerm = (id: number) =>
  apiClient.request<Term>({ method: "GET", url: `/dictionary/term/${id}/` });

export const fetchTermPhoto = (id: number) =>
  apiClient.request<any>({ method: "GET", url: `/dictionary/term_photo/${id}/` });

export const createTerm = (data: CreateTermData) =>
  apiClient.request<Term>({
    method: "POST",
    url: "/dictionary/create_term/",
    data,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTerm = (id: number, data: UpdateTermData) =>
  apiClient.request<Term>({
    method: "PUT",
    url: `/dictionary/create_term/${id}/`,
    data,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteTerm = (id: number) =>
  apiClient.request<void>({ method: "DELETE", url: `/dictionary/create_term/${id}/` });
