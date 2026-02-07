export interface Skill {
  id: string;
  name: string;
  description: string;
  owner: string;
  repo: string;
  installCount: number;
  installCommand: string;
  url: string;
  repositoryUrl?: string;
  rank?: number;
  tags?: string[];
}
