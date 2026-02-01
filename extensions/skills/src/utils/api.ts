import { Skill, SortOrder } from "../model/skill";
import { SKILLS_BASE_URL } from "./constants";

interface SkillsSearchResponse {
  query: string;
  searchType: string;
  skills: SearchSkill[];
  count: number;
  duration_ms: number;
}

interface SkillsListResponse {
  skills: SearchSkill[];
  hasMore: boolean;
}

interface SearchSkill {
  id: string;
  name: string;
  installs: number;
  topSource: string | null;
}

/**
 * Fetches skills using the skills.sh REST API
 * This uses the same endpoint as the official `npx skills find` CLI
 */
export async function fetchSkills(query = ""): Promise<Skill[]> {
  try {
    const trimmedQuery = query.trim();

    // If no query, return empty array
    if (trimmedQuery.length < 2) {
      return [];
    }

    // Use the official skills.sh API endpoint
    // Default limit is 10, but we can increase for better results
    const limit = 50;
    const url = `${SKILLS_BASE_URL}/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=${limit}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as SkillsSearchResponse;

    // Transform API response to our Skill model
    return data.skills.map((apiSkill) => transformSearchSkill(apiSkill));
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
}

/**
 * Fetches popular skills from the leaderboard API
 * This endpoint doesn't require a search query
 */
export async function fetchPopularSkills(
  sort: SortOrder = "all-time",
): Promise<Skill[]> {
  try {
    const limit = 50;
    const url = `${SKILLS_BASE_URL}/api/skills?limit=${limit}&sort=${sort}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as SkillsListResponse;

    // Transform API response to our Skill model
    return data.skills.map((apiSkill) => transformSearchSkill(apiSkill));
  } catch (error) {
    console.error("Error fetching popular skills:", error);
    throw error;
  }
}

/**
 * Transforms API search result to our Skill model
 */
function transformSearchSkill(apiSkill: SearchSkill): Skill {
  // Parse topSource as owner/repo (e.g., "anthropics/skills")
  const source = apiSkill.topSource || "";
  const parts = source.split("/");
  const owner = parts[0] || "";
  const repo = parts.slice(1).join("/") || "";

  // Skill ID format examples:
  // - With source: "anthropics/skills/raycast-extensions"
  // - Without source: "raycast-extensions"
  const fullId = source ? `${source}/${apiSkill.id}` : apiSkill.id;

  return {
    id: fullId,
    name: apiSkill.name,
    description: "", // API doesn't provide description in search results
    owner,
    repo,
    installCount: apiSkill.installs,
    installCommand: source
      ? `npx skills add ${source}@${apiSkill.id}`
      : `npx skills add ${apiSkill.id}`,
    url: source
      ? `${SKILLS_BASE_URL}/${source}/${apiSkill.id}`
      : `${SKILLS_BASE_URL}/${apiSkill.id}`,
    repositoryUrl: source ? `https://github.com/${source}` : undefined,
    tags: [],
  };
}
