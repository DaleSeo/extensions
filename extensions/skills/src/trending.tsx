import {
  List,
  showToast,
  Toast,
  Action,
  ActionPanel,
  Icon,
} from "@raycast/api";
import { useState, useEffect, useCallback } from "react";
import { SkillListItem } from "./components/SkillListItem";
import { fetchPopularSkills } from "./utils/api";
import { Skill } from "./model/skill";
import { toError } from "./utils/errors";

export default function TrendingSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchText, setSearchText] = useState("");

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

  // Client-side filtering for search
  const filteredSkills = skills.filter((skill) => {
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
        filteredSkills.map((skill) => (
          <SkillListItem key={skill.id} skill={skill} />
        ))
      )}
    </List>
  );
}
