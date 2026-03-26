import { Action, ActionPanel, Form, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useState } from "react";
import { type Skill } from "../shared";
import { installSkill } from "../utils/skills-cli";

export interface AgentOption {
  id: string;
  displayName: string;
}

interface AgentPickerFormProps {
  skill: Skill;
  agents: AgentOption[];
}

interface FormValues {
  agents: string[];
}

export function AgentPickerForm({ skill, agents }: AgentPickerFormProps) {
  const { pop } = useNavigation();
  const [isInstalling, setIsInstalling] = useState(false);
  const allIds = agents.map((a) => a.id);

  const handleSubmit = async ({ agents: selectedAgents }: FormValues) => {
    if (selectedAgents.length === 0) return;

    setIsInstalling(true);
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Installing skill...",
      message: skill.name,
    });

    try {
      await installSkill(skill, selectedAgents);
      toast.style = Toast.Style.Success;
      toast.title = "Skill installed successfully";
      toast.message = `${skill.name} is now available`;
      pop();
    } catch (error) {
      await toast.hide();
      await showFailureToast(error, { title: "Failed to install skill" });
      setIsInstalling(false);
    }
  };

  return (
    <Form
      navigationTitle={`Install ${skill.name}`}
      isLoading={isInstalling}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Install Skill" icon={Icon.Download} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Skill" text={skill.name} />
      <Form.Description title="Source" text={skill.source} />
      <Form.Separator />
      <Form.TagPicker id="agents" title="Agents" defaultValue={allIds}>
        {agents.map((agent) => (
          <Form.TagPicker.Item key={agent.id} value={agent.id} title={agent.displayName} />
        ))}
      </Form.TagPicker>
    </Form>
  );
}
