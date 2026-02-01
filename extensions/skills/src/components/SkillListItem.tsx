import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Skill } from "../model/skill";
import { formatInstallCount } from "../utils/format";

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
          <ActionPanel.Section>
            <Action.CopyToClipboard
              title="Copy Install Command"
              content={skill.installCommand}
            />
            <Action.OpenInBrowser title="Open on Skills.sh" url={skill.url} />
            {skill.repositoryUrl && (
              <Action.OpenInBrowser
                title="Open Repository"
                url={skill.repositoryUrl}
                shortcut={{ modifiers: ["cmd", "shift"], key: "o" }}
              />
            )}
          </ActionPanel.Section>
          <ActionPanel.Section>
            {skill.repositoryUrl && (
              <Action.CopyToClipboard
                title="Copy Repository URL"
                content={skill.repositoryUrl}
                shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
              />
            )}
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
