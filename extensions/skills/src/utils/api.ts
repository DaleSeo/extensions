import { Skill } from "../model/skill";
import { SKILLS_BASE_URL } from "./constants";

interface SkillsSearchResponse {
  query: string;
  searchType: string;
  skills: SearchSkill[];
  count: number;
  duration_ms: number;
}

interface SearchSkill {
  id: string;
  skillId: string;
  name: string;
  installs: number;
  source: string | null;
}

/**
 * Fetches skills using the skills.sh REST API
 * This uses the same endpoint as the official `npx skills find` CLI
 */
export async function fetchSkills(
  query = "",
  signal?: AbortSignal,
): Promise<Skill[]> {
  try {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return [];
    }

    const limit = 50;
    const url = `${SKILLS_BASE_URL}/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=${limit}`;

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as SkillsSearchResponse;

    return data.skills.map((apiSkill) => transformSearchSkill(apiSkill));
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
}

/**
 * Fetches popular skills using the search API.
 * The search API returns results sorted by install count,
 * so a broad query effectively gives us the most popular skills.
 */
export async function fetchPopularSkills(): Promise<Skill[]> {
  try {
    const limit = 50;
    const url = `${SKILLS_BASE_URL}/api/search?q=skills&limit=${limit}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as SkillsSearchResponse;

    return data.skills.map((apiSkill) => transformSearchSkill(apiSkill));
  } catch (error) {
    console.error("Error fetching popular skills:", error);
    throw error;
  }
}

/**
 * Transforms API search result to our Skill model
 *
 * API response format (as of 2025):
 *   id: "anthropics/skills/webapp-testing" (full path)
 *   skillId: "webapp-testing" (skill name only)
 *   source: "anthropics/skills" (owner/repo)
 */
function transformSearchSkill(apiSkill: SearchSkill): Skill {
  const source = apiSkill.source || "";
  const parts = source.split("/");
  const owner = parts[0] || "";
  const repo = parts.slice(1).join("/") || "";
  const skillId = apiSkill.skillId || apiSkill.name;

  return {
    id: apiSkill.id,
    name: apiSkill.name,
    description: "",
    owner,
    repo,
    installCount: apiSkill.installs,
    installCommand: source
      ? `npx skills add ${source}@${skillId}`
      : `npx skills add ${skillId}`,
    url: source
      ? `${SKILLS_BASE_URL}/${source}/${skillId}`
      : `${SKILLS_BASE_URL}/${skillId}`,
    repositoryUrl: source ? `https://github.com/${source}` : undefined,
    tags: [],
  };
}
