# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Raycast extension that enables searching and discovering agent skills from skills.sh. Users can search for skills and browse trending skills directly within Raycast.

## Development Commands

```bash
# Start development mode with hot reload
npm run dev

# Build extension for production
npm run build

# Run ESLint
npm run lint
```

**Note:** Raycast CLI commands use `ray` (e.g., `ray develop`, `ray build`, `ray lint`).

## Architecture

### Extension Structure

The extension follows Raycast's command-based architecture with two main entry points:

1. **Search Command** (`src/index.tsx`): Main search interface with debounced search (only shows results when user types)
2. **Trending Command** (`src/trending.tsx`): Displays trending agent skills using the "trending" sort order

### Data Flow

```
User Input → useSkillsSearch Hook → fetchSkills (API) → REST API Request → Skill Model
Trending → fetchPopularSkills (API) → REST API Request → Skill Model
```

### Key Components

- **`src/components/SkillListItem.tsx`**: Reusable list item component with actions (copy install command, open URLs)
- **`src/hooks/useSkillsSearch.ts`**: Manages search state with 600ms debounce and abort controller for request cancellation. Returns empty array when search query is empty.

### API & Data Fetching

**Important:** The extension uses the official skills.sh REST API (same endpoint used by `npx skills find`):

**API Endpoint:**
- `GET https://skills.sh/api/search?q={query}&limit={limit}`
- Returns JSON with skill metadata including install counts

**Response Format:**
```json
{
  "query": "testing",
  "searchType": "fuzzy",
  "skills": [
    {
      "id": "webapp-testing",
      "name": "webapp-testing",
      "installs": 4797,
      "topSource": "anthropics/skills"
    }
  ],
  "count": 10,
  "duration_ms": 7
}
```

**Implementation Details:**
- Uses native `fetch` API (no external HTTP library needed)
- Default limit: 50 results per query
- Minimum query length: 2 characters (returns empty for shorter queries)
- Server-side fuzzy search
- Install counts included in response

**Limitations:**
- Descriptions not available in search results (only on detail pages)
- Sort parameter (`all-time`/`trending`/`hot`) not yet used by API
- No pagination support in current implementation

### Data Model

The `Skill` interface (`src/model/skill.ts`) includes:
- `id`, `name`, `description`, `owner`, `repo`
- `installCount` (from API), `installCommand` (always `npx skills add owner/repo@skill`)
- `url` (skills.sh link), `repositoryUrl` (GitHub), `rank`, `tags`

Note: `description`, `rank`, and `tags` are not populated from search API (empty/undefined)

### Search Behavior

- **Search Command**: Only fetches and displays results when user types a search query (minimum 2 characters)
- **Empty State**: Shows "Start typing to search" when no query is entered
- **Trending Command**: Automatically loads trending skills on mount using `fetchPopularSkills("trending")`

## UI Patterns

- **Empty States**: Different messages for "no search results" vs "start typing to search"
- **Accessories**: Display install count in list items
- **Debounced Search**: 600ms delay to avoid excessive API calls during typing
- **No Default Results**: Search command shows nothing until user types (no popular/history fallback)

## Extension Configuration

Preferences (defined in `package.json`):
- `defaultSort`: Sort order for search results (all-time/trending/hot, default: all-time)

## Development Notes

- The extension uses Raycast API v1.103.6+ and @raycast/utils for hooks
- TypeScript strict mode enabled
- Target ES2022 with CommonJS modules
- Uses native `fetch` API for HTTP requests (no axios/node-fetch needed)
- No unit tests currently in the repository (manual testing only)
- No external dependencies beyond Raycast SDK (cheerio removed)
