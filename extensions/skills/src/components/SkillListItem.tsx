import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Skill } from "../model/skill";
import { formatInstallCount } from "../utils/format";
import { SkillDetail } from "./SkillDetail";

interface SkillListItemProps {
  skill: Skill;
}

export function SkillListItem({ skill }: SkillListItemProps) {
  const accessories: List.Item.Accessory[] = [];

  if (skill.installCount > 0) {
    accessories.push({
      text: formatInstallCount(skill.installCount),
      icon: Icon.Download,
    });
  }

  return (
    <List.Item
      icon={Icon.Plug}
      title={skill.name}
      subtitle={`${skill.owner}/${skill.repo}`}
      accessories={accessories}
      actions={
        <ActionPanel>
          <Action.Push
            title="View Details"
            icon={Icon.Eye}
            target={<SkillDetail skill={skill} />}
          />
          <Action.CopyToClipboard
            title="Copy Install Command"
            content={skill.installCommand}
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
          <Action.OpenInBrowser title="Open on Skills.sh" url={skill.url} />
          {skill.repositoryUrl && (
            <Action.OpenInBrowser
              title="Open on GitHub"
              url={skill.repositoryUrl}
              shortcut={{ modifiers: ["cmd"], key: "o" }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}
