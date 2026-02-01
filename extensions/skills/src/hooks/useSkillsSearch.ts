import { useState, useEffect, useRef } from "react";
import { Skill } from "../model/skill";
import { fetchSkills } from "../utils/api";

export function useSkillsSearch(searchText: string, retryTrigger = 0) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const trimmedSearch = searchText.trim();

    // Don't search if query is empty
    if (!trimmedSearch) {
      setSkills([]);
      setIsLoading(false);
      return;
    }

    // Debounce search
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        abortControllerRef.current = new AbortController();
        const results = await fetchSkills(trimmedSearch);
        setSkills(results);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
          setSkills([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 600); // 600ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchText, retryTrigger]);

  return { skills, isLoading, error };
}
