import { Detail, ActionPanel, Action, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { Skill } from "../model/skill";
import { formatInstallCount } from "../utils/format";

interface SkillDetailProps {
  skill: Skill;
}

async function fetchReadme(owner: string, repo: string): Promise<string> {
  for (const branch of ["main", "master"]) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
  }
  return "";
}

export function SkillDetail({ skill }: SkillDetailProps) {
  const [readme, setReadme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReadme() {
      if (!skill.repositoryUrl) {
        setReadme("");
        setIsLoading(false);
        return;
      }

      try {
        const content = await fetchReadme(skill.owner, skill.repo);
        if (!cancelled) {
          setReadme(content);
        }
      } catch {
        if (!cancelled) {
          setReadme("");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadReadme();
    return () => {
      cancelled = true;
    };
  }, [skill]);

  const markdown =
    readme || (isLoading ? "" : `*No README available for ${skill.name}*`);

  return (
    <Detail
      isLoading={isLoading}
      navigationTitle={skill.name}
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Name" text={skill.name} />
          <Detail.Metadata.Label
            title="Source"
            text={`${skill.owner}/${skill.repo}`}
          />
          <Detail.Metadata.Label
            title="Installs"
            text={formatInstallCount(skill.installCount)}
            icon={Icon.Download}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Install Command"
            text={skill.installCommand}
          />
          <Detail.Metadata.Link
            title="Skills.sh"
            target={skill.url}
            text="Open on Skills.sh"
          />
          {skill.repositoryUrl && (
            <Detail.Metadata.Link
              title="GitHub"
              target={skill.repositoryUrl}
              text="Open on GitHub"
            />
          )}
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.CopyToClipboard
            title="Copy Install Command"
            content={skill.installCommand}
          />
          <Action.OpenInBrowser title="Open on Skills.sh" url={skill.url} />
          {skill.repositoryUrl && (
            <Action.OpenInBrowser
              title="Open on GitHub"
              url={skill.repositoryUrl}
              shortcut={{ modifiers: ["cmd"], key: "o" }}
            />
          )}
          {skill.repositoryUrl && (
            <Action.CopyToClipboard
              title="Copy Repository URL"
              content={skill.repositoryUrl}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}
