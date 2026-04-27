import { useLocalStorage } from "@raycast/utils";
import { useMemo } from "react";

import { type Skill } from "../shared";

export const SORT_OPTIONS = ["popularity", "name", "relevance"] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  popularity: "Popularity",
  name: "Name",
  relevance: "Relevance",
};

const DEFAULT_SORT: SortOption = "popularity";
const SORT_STORAGE_KEY = "search-skills-sort";
const SORT_VALUE_PREFIX = "sort:";

function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

export function isSortDropdownValue(value: string): boolean {
  return value.startsWith(SORT_VALUE_PREFIX);
}

export function parseSortDropdownValue(value: string): SortOption | undefined {
  const raw = value.slice(SORT_VALUE_PREFIX.length);
  return isSortOption(raw) ? raw : undefined;
}

export function toSortDropdownValue(option: SortOption): string {
  return `${SORT_VALUE_PREFIX}${option}`;
}

function sortSkills(skills: Skill[], sort: SortOption): Skill[] {
  if (sort === "relevance") return skills;
  const next = [...skills];
  if (sort === "popularity") {
    next.sort((a, b) => b.installs - a.installs);
  } else {
    next.sort((a, b) => a.name.localeCompare(b.name));
  }
  return next;
}

export function useSkillSort(skills: Skill[]) {
  const { value, setValue } = useLocalStorage<SortOption>(SORT_STORAGE_KEY, DEFAULT_SORT);
  const sort = value ?? DEFAULT_SORT;

  const sorted = useMemo(() => sortSkills(skills, sort), [skills, sort]);

  return { sort, setSort: setValue, skills: sorted };
}
