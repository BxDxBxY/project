import { apiClient } from "./apiClient";
import { User, CreateUserData } from "@/types";

export const fetchUsers = () =>
  apiClient.request<User[]>({ method: "GET", url: "/dictionary/user_list/" });

export const createUser = (data: CreateUserData) =>
  apiClient.request<User>({
    method: "POST",
    url: "/dictionary/user_create/",
    data,
  });

export const updateUser = (id: number, data: Partial<User>) =>
  apiClient.request<User>({
    method: "PUT",
    url: `/dictionary/user_update/${id}/`,
    data,
  });

export const deleteUser = (id: number) =>
  apiClient.request<void>({
    method: "DELETE",
    url: `/dictionary/user_delete/${id}/`,
  });
