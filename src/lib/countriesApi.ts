import { Country } from "@/types";
import { apiClient } from "./apiClient";

export const fetchCountries = () =>
  apiClient.request<Country[]>({ method: "GET", url: "/dictionary/country/" });
