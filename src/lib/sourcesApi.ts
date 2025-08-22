import { Source } from "@/types";
import { apiClient } from "./apiClient";

export const fetchSources = () =>
  apiClient.request<Source[]>({ method: "GET", url: "/dictionary/source/" });
