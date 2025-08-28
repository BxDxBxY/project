import { apiClient } from "./apiClient";
import {
  TermDetail,
  TermSummary,
  CreateTermData,
  UpdateTermData,
  TermDetailEdit,
} from "@/types";

export const fetchTerms = () =>
  apiClient.request<TermSummary[]>({ method: "GET", url: "/dictionary/term/" });

export const searchTerms = (search: string) =>
  apiClient.request<TermSummary[]>({
    method: "GET",
    url: "/dictionary/search_term/",
    params: { search },
  });

export const fetchTerm = (id: number) =>
  apiClient.request<TermDetail>({
    method: "GET",
    url: `/dictionary/term_detailed/${id}/`,
  });
export const fetchTermEdit = (id: number) =>
  apiClient.request<TermDetailEdit>({
    method: "GET",
    url: `/dictionary/term_detailed/${id}/`,
  });

export const fetchTermPhoto = (id: number) =>
  apiClient.request<any>({
    method: "GET",
    url: `/dictionary/term_photo/${id}/`,
  });

export const createTerm = (data: CreateTermData) =>
  apiClient.request<TermDetail>({
    method: "POST",
    url: "/dictionary/create_term/",
    data,
    headers: { "Content-Type": "application/json" },
  });

export const updateTerm = (id: number, data: UpdateTermData) =>
  apiClient.request<TermDetail>({
    method: "PUT",
    url: `/dictionary/create_term/${id}/`,
    data,
    headers: { "Content-Type": "application/json" },
  });

export const deleteTerm = (id: number) =>
  apiClient.request<void>({
    method: "DELETE",
    url: `/dictionary/create_term/${id}/`,
  });
