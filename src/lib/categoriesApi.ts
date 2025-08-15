import { apiClient } from "./apiClient";
import { Category, CreateCategoryData, UpdateCategoryData } from "@/types";

export const fetchCategories = () =>
  apiClient.request<Category[]>({ method: "GET", url: "/dictionary/category/" });

export const fetchCategory = (id: number) =>
  apiClient.request<Category>({ method: "GET", url: `/dictionary/category/${id}/` });

export const createCategory = (data: CreateCategoryData) =>
  apiClient.request<Category>({ method: "POST", url: "/dictionary/create_category/", data });

export const updateCategory = (id: number, data: UpdateCategoryData) =>
  apiClient.request<Category>({ method: "PUT", url: `/dictionary/create_category/${id}/`, data });

export const deleteCategory = (id: number) =>
  apiClient.request<void>({ method: "DELETE", url: `/dictionary/create_category/${id}/` });
