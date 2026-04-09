import { useCallback, useEffect, useState } from "react";
import {
  helptaskService,
  Helptask,
  HelptaskCreatePayload,
  HelptaskFilters,
  HelptaskUpdatePayload,
} from "../services/helptaskService";

interface UseHelptasksOptions {
  autoFetch?: boolean;
  filters?: HelptaskFilters;
}

const toMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useHelptasks({ autoFetch = false, filters }: UseHelptasksOptions = {}) {
  const [helptasks, setHelptasks] = useState<Helptask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHelptasks = useCallback(
    async (queryFilters = filters) => {
      setLoading(true);
      setError(null);

      try {
        setHelptasks(await helptaskService.getHelptasks(queryFilters));
      } catch (err) {
        const message = toMessage(err, "Failed to fetch helptasks");
        setError(message);
        console.error(message);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    if (autoFetch) void fetchHelptasks();
  }, [autoFetch, fetchHelptasks]);

  const runMutation = useCallback(async <T,>(action: () => Promise<T>, fallback: string) => {
    setError(null);

    try {
      return await action();
    } catch (err) {
      setError(toMessage(err, fallback));
      throw err;
    }
  }, []);

  const createHelptask = useCallback(
    (payload: HelptaskCreatePayload) =>
      runMutation(async () => {
        const newHelptask = await helptaskService.createHelptask(payload);
        setHelptasks((prev) => [newHelptask, ...prev]);
        return newHelptask;
      }, "Failed to create helptask"),
    [runMutation]
  );

  const updateHelptask = useCallback(
    (id: string, payload: HelptaskUpdatePayload) =>
      runMutation(async () => {
        const updatedHelptask = await helptaskService.updateHelptask(id, payload);
        setHelptasks((prev) => prev.map((task) => (task._id === id ? updatedHelptask : task)));
        return updatedHelptask;
      }, "Failed to update helptask"),
    [runMutation]
  );

  const deleteHelptask = useCallback((id: string) => {
    setHelptasks((prev) => prev.filter((task) => task._id !== id));
  }, []);

  return {
    helptasks,
    loading,
    error,
    fetchHelptasks,
    createHelptask,
    updateHelptask,
    deleteHelptask,
    filterHelptasks: (filterFn: (task: Helptask) => boolean) => helptasks.filter(filterFn),
  };
}
