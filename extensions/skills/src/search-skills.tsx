import { List, ActionPanel, Action, Detail, Icon } from "@raycast/api";
import { useState } from "react";

import { SkillListItem } from "./components/SkillListItem";
import { useInstalledSkillNames } from "./hooks/useInstalledSkillNames";
import { useOwnerFilter } from "./hooks/useOwnerFilter";
import { useDebouncedSearch } from "./hooks/useDebouncedSearch";
import {
  useSkillSort,
  SORT_LABELS,
  SORT_OPTIONS,
  isSortDropdownValue,
  parseSortDropdownValue,
  toSortDropdownValue,
} from "./hooks/useSkillSort";
import { buildGithubIssueUrl } from "./shared";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isShowingDetail, setIsShowingDetail] = useState(true);
  const toggleDetail = () => setIsShowingDetail((prev) => !prev);

  const { data, isLoading, error, revalidate, searchUrl } = useDebouncedSearch(searchText);
  const { installedNames } = useInstalledSkillNames();

  const { owner, setOwner, ownerCounts, skills: ownerFiltered } = useOwnerFilter(data?.skills ?? []);
  const { sort, setSort, skills } = useSkillSort(ownerFiltered);

  const handleDropdownChange = (value: string) => {
    if (isSortDropdownValue(value)) {
      const parsed = parseSortDropdownValue(value);
      if (parsed) void setSort(parsed);
    } else {
      setOwner(value);
    }
  };

  if (error && !data) {
    return (
      <Detail
        markdown={`# Unable to Load Search Results\n\n**Error:** ${error.message}\n\n---\n\nThe Skills API request failed, so the primary search content could not be shown.\n\nRetry the search. If the problem persists, report it on GitHub.`}
        actions={
          <ActionPanel>
            <Action title="Retry" onAction={revalidate} icon={Icon.RotateClockwise} />
            <Action.OpenInBrowser
              title="Report Issue on GitHub"
              url={buildGithubIssueUrl({
                title: "API Error",
                description: `Failed to fetch data from the Skills API: ${searchUrl}`,
                error,
                reproductionSteps: [
                  "Open Raycast and run the 'Search Skills' command.",
                  `Search for skills with the search query "${searchText}".`,
                  "Observe the resulting error.",
                ],
              })}
              icon={Icon.Bug}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search skills..."
      onSearchTextChange={setSearchText}
      onSelectionChange={setSelectedId}
      isShowingDetail={skills.length > 0 && isShowingDetail}
      searchBarAccessory={
        <List.Dropdown tooltip="Sort & Filter" value={owner} onChange={handleDropdownChange}>
          <List.Dropdown.Section title="Sort By">
            {SORT_OPTIONS.map((option) => (
              <List.Dropdown.Item
                key={option}
                title={SORT_LABELS[option]}
                value={toSortDropdownValue(option)}
                icon={sort === option ? Icon.CheckCircle : Icon.Circle}
              />
            ))}
          </List.Dropdown.Section>
          <List.Dropdown.Section title="Filter by Owner">
            <List.Dropdown.Item title="All Owners" value="all" />
            {[...ownerCounts.entries()].map(([ownerName, count]) => (
              <List.Dropdown.Item key={ownerName} title={`${ownerName} (${count})`} value={ownerName} />
            ))}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {searchText.length < 2 ? (
        <List.EmptyView
          title="Search Skills"
          description="Type at least 2 characters to search."
          icon={Icon.MagnifyingGlass}
        />
      ) : skills.length === 0 && !isLoading ? (
        <List.EmptyView
          title="No Search Results"
          description={`No results found for "${searchText}". Try different keywords.`}
          icon={Icon.MagnifyingGlass}
          actions={
            <ActionPanel>
              <Action title="Retry" onAction={revalidate} icon={Icon.RotateClockwise} />
            </ActionPanel>
          }
        />
      ) : (
        <List.Section
          title={`Results for "${searchText}"`}
          subtitle={`${skills.length} skills · Sorted by ${SORT_LABELS[sort]}`}
        >
          {skills.map((skill) => (
            <SkillListItem
              key={skill.id}
              skill={skill}
              isSelected={selectedId === skill.id}
              isInstalled={installedNames.has(skill.skillId)}
              isShowingDetail={isShowingDetail}
              onToggleDetail={toggleDetail}
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}
