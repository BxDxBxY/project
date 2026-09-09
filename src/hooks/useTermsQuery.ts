import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchTerms, fetchTerm } from "@/lib/termsApi";
import { TermDetail } from "@/types";

/**
 * Query key factory for terms
 */
export const termKeys = {
  all: ["terms"] as const,
  lists: () => [...termKeys.all, "list"] as const,
  list: (search: string) => [...termKeys.lists(), { search }] as const,
  details: () => [...termKeys.all, "detail"] as const,
  detail: (id: number) => [...termKeys.details(), id] as const,
};

/**
 * Hook to fetch all terms with optional search
 */
export function useTermsQuery(search: string = "") {
  return useQuery({
    queryKey: termKeys.list(search),
    queryFn: () => searchTerms(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch a single term by ID
 */
export function useTermQuery(id: number) {
  return useQuery({
    queryKey: termKeys.detail(id),
    queryFn: () => fetchTerm(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Hook to prefetch a term (for hover/link prefetching)
 */
export function usePrefetchTerm() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: termKeys.detail(id),
      queryFn: () => fetchTerm(id),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * Hook to invalidate terms cache (after mutations)
 */
export function useInvalidateTerms() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: termKeys.all });
  };
}

/**
 * Hook to set term data in cache (optimistic updates)
 */
export function useSetTermData() {
  const queryClient = useQueryClient();

  return (id: number, data: TermDetail) => {
    queryClient.setQueryData(termKeys.detail(id), data);
  };
}
