# Skills

Search and discover agent skills from [skills.sh](https://skills.sh) directly in Raycast.

## Features

- 🔍 **Search Skills**: Search for agent skills with real-time debounced results
- 🔥 **Trending Skills**: Browse trending skills from the last 24 hours
- 📋 **Copy Install Command**: Quickly copy `npx skills add owner/repo@skill` commands
- 🔗 **Quick Actions**: Open skills on skills.sh or view their GitHub repositories
- 📊 **Install Stats**: See formatted install counts (4.8K, 1.2M) for each skill

## Commands

### Search Skills

Search for skills from skills.sh with real-time results.

**Actions:**
- Copy Install Command (⌘C)
- Open on skills.sh (⌘O)
- Open Repository (⌘⇧O)
- Copy Repository URL (⌘⇧C)

### Trending Skills

View the most trending skills from the last 24 hours. Includes client-side search to filter results.

## Installation

Install from the [Raycast Store](https://raycast.com/store) by searching for "Skills".

## Usage

1. Open Raycast (⌘Space)
2. Type "Skills" to search, or "Trending Skills" to browse trending
3. Start typing to search for skills (search command) or filter results (trending command)
4. Select a skill and use actions to copy install commands or open links

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## API

This extension uses the official [skills.sh REST API](https://skills.sh/api):
- Search: `GET /api/search?q={query}&limit={limit}`
- Trending: `GET /api/skills?limit={limit}&sort=trending`

## License

MIT
