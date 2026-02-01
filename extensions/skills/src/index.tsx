import {
  List,
  showToast,
  Toast,
  Action,
  ActionPanel,
  Icon,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { SkillListItem } from "./components/SkillListItem";
import { useSkillsSearch } from "./hooks/useSkillsSearch";

export default function SearchSkills() {
  const [searchText, setSearchText] = useState("");
  const [retryTrigger, setRetryTrigger] = useState(0);
  const { skills, isLoading, error } = useSkillsSearch(
    searchText,
    retryTrigger,
  );

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to Fetch Skills",
        message: error.message,
      });
    }
  }, [error]);

  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1);
  };

  const getEmptyViewContent = () => {
    if (error) {
      return {
        icon: Icon.ExclamationMark,
        title: "Failed to Fetch Skills",
        description: error.message,
        actions: (
          <ActionPanel>
            <Action
              title="Retry"
              icon={Icon.ArrowClockwise}
              onAction={handleRetry}
            />
          </ActionPanel>
        ),
      };
    }

    if (!searchText.trim()) {
      return {
        icon: Icon.MagnifyingGlass,
        title: "Start Typing to Search",
        description: "Search by skill name, owner, or repo",
      };
    }

    return {
      icon: Icon.MagnifyingGlass,
      title: "No Skills Found",
      description: "Try a different search term",
    };
  };

  const emptyViewContent = getEmptyViewContent();

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search agent skills..."
    >
      {skills.length === 0 ? (
        <List.EmptyView
          icon={emptyViewContent.icon}
          title={emptyViewContent.title}
          description={emptyViewContent.description}
          actions={emptyViewContent.actions}
        />
      ) : (
        skills.map((skill) => <SkillListItem key={skill.id} skill={skill} />)
      )}
    </List>
  );
}
