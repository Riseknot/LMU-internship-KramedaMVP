import { useState, useCallback, useEffect } from "react";
import {
  helptaskService,
  Helptask,
  HelptaskCreatePayload,
  HelptaskUpdatePayload,
} from "../services/helptaskService";

interface UseHelptasksOptions {
  autoFetch?: boolean;
  filters?: {
    firstname?: string;
    surname?: string;
    email?: string;
    status?: "open" | "assigned" | "completed";
    zipCode?: string;
    title?: string;
  };
}

/**
 * Custom hook for managing helptasks
 * Provides CRUD operations and state management
 */
export function useHelptasks(options: UseHelptasksOptions = {}) {
  const { autoFetch = false, filters } = options;

  const [helptasks, setHelptasks] = useState<Helptask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch helptasks
  const fetchHelptasks = useCallback(
    async (queryFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await helptaskService.getHelptasks(queryFilters);
        setHelptasks(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch helptasks";
        setError(message);
        console.error(message);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Auto-fetch on mount or filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchHelptasks();
    }
  }, [autoFetch, fetchHelptasks]);

  // Create helptask
  const createHelptask = useCallback(
    async (payload: HelptaskCreatePayload) => {
      setError(null);
      try {
        const newHelptask = await helptaskService.createHelptask(payload);
        setHelptasks((prev) => [newHelptask, ...prev]);
        return newHelptask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create helptask";
        setError(message);
        throw err;
      }
    },
    []
  );

  // Update helptask
  const updateHelptask = useCallback(
    async (id: string, payload: HelptaskUpdatePayload) => {
      setError(null);
      try {
        const updatedHelptask = await helptaskService.updateHelptask(id, payload);
        setHelptasks((prev) =>
          prev.map((h) => (h._id === id ? updatedHelptask : h))
        );
        return updatedHelptask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update helptask";
        setError(message);
        throw err;
      }
    },
    []
  );

  // Delete helptask (local state only for now)
  const deleteHelptask = useCallback((id: string) => {
    setHelptasks((prev) => prev.filter((h) => h._id !== id));
  }, []);

  // Filter helptasks locally
  const filterHelptasks = useCallback(
    (filterFn: (task: Helptask) => boolean) => {
      return helptasks.filter(filterFn);
    },
    [helptasks]
  );

  return {
    helptasks,
    loading,
    error,
    fetchHelptasks,
    createHelptask,
    updateHelptask,
    deleteHelptask,
    filterHelptasks,
  };
}
