import {
  List,
  showToast,
  Toast,
  Action,
  ActionPanel,
  Icon,
} from "@raycast/api";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SkillListItem } from "./components/SkillListItem";
import { fetchPopularSkills } from "./utils/api";
import { Skill } from "./model/skill";
import { toError } from "./utils/errors";

export default function TrendingSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchText, setSearchText] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");

  const loadTrendingSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trendingSkills = await fetchPopularSkills();
      setSkills(trendingSkills);
    } catch (err) {
      const errorObj = toError(err);
      setError(errorObj);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Load Skills",
        message: errorObj.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrendingSkills();
  }, [loadTrendingSkills]);

  const companies = useMemo(
    () => [...new Set(skills.map((skill) => skill.owner))].sort(),
    [skills],
  );

  // Client-side filtering for search and company
  const filteredSkills = skills.filter((skill) => {
    if (companyFilter !== "all" && skill.owner !== companyFilter) return false;
    const searchLower = searchText.toLowerCase();
    return (
      skill.name.toLowerCase().includes(searchLower) ||
      skill.owner.toLowerCase().includes(searchLower) ||
      skill.repo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search trending skills..."
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter by Company"
          value={companyFilter}
          onChange={setCompanyFilter}
        >
          <List.Dropdown.Item title="All Companies" value="all" />
          <List.Dropdown.Section title="Companies">
            {companies.map((company) => (
              <List.Dropdown.Item
                key={company}
                title={company}
                value={company}
              />
            ))}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {filteredSkills.length === 0 ? (
        <List.EmptyView
          icon={error ? Icon.ExclamationMark : Icon.MagnifyingGlass}
          title={error ? "Failed to Load Trending Skills" : "No Skills Found"}
          description={error ? error.message : "Try a different search term"}
          actions={
            error ? (
              <ActionPanel>
                <Action
                  title="Retry"
                  icon={Icon.ArrowClockwise}
                  onAction={loadTrendingSkills}
                />
              </ActionPanel>
            ) : undefined
          }
        />
      ) : (
        <List.Section
          title="Trending Skills"
          subtitle={`${filteredSkills.length} skills`}
        >
          {filteredSkills.map((skill, index) => (
            <SkillListItem key={skill.id} skill={skill} rank={index + 1} />
          ))}
        </List.Section>
      )}
    </List>
  );
}
