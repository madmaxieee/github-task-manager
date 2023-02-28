import client from "@/client";
import {
  GET_LABEL_COUNT,
  GET_ALL_LABELS,
  type LabelCountQueryResponseData,
  type LabelQueryResponseData,
  type LabelCountQueryVariables,
  type LabelQueryVariables,
} from "@/client/queries";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export type RequiredLabels = [
  {
    name: "open";
    color: string;
    id: string;
  },
  {
    name: "in progress";
    color: string;
    id: string;
  },
  {
    name: "done";
    color: string;
    id: string;
  }
];

const REQUIRED_LABEL_COLORS = [
  { name: "open", color: "1D76DB" },
  { name: "in progress", color: "B60205" },
  { name: "done", color: "0E8A16" },
];

export async function initializeLabels(
  owner: string,
  repoName: string,
  accessToken: string
): Promise<RequiredLabels> {
  const labels = await getAllLabelNames(owner, repoName);
  const labelNames = labels.map((label) => label.name);
  const labelsToAdd = REQUIRED_LABEL_COLORS.filter(
    (requiredLabel) => !labelNames.includes(requiredLabel.name)
  );

  const results = await Promise.allSettled(
    labelsToAdd.map((label) => createLabel(owner, repoName, label, accessToken))
  );

  for (const result of results) {
    if (result.status === "rejected") {
      throw result.reason;
    }
  }

  const newLabels = await getAllLabelNames(owner, repoName);
  const openLabel = newLabels.find((label) => label.name === "open") as
    | RequiredLabels[0]
    | undefined;
  const inProgressLabel = newLabels.find(
    (label) => label.name === "in progress"
  ) as RequiredLabels[1] | undefined;
  const doneLabel = newLabels.find((label) => label.name === "done") as
    | RequiredLabels[2]
    | undefined;

  if (!openLabel || !inProgressLabel || !doneLabel) {
    throw new Error("Failed to create required labels");
  }

  return [openLabel, inProgressLabel, doneLabel];
}

export async function getAllLabelNames(
  owner: string,
  repoName: string
): Promise<Label[]> {
  const { data: labelCountData } = await client.query<
    LabelCountQueryResponseData,
    LabelCountQueryVariables
  >({
    query: GET_LABEL_COUNT,
    variables: {
      owner,
      name: repoName,
    },
  });
  const labelCount = labelCountData.repository.labels.totalCount;

  const { data: labelData } = await client.query<
    LabelQueryResponseData,
    LabelQueryVariables
  >({
    query: GET_ALL_LABELS,
    variables: {
      owner,
      name: repoName,
      labelCount,
    },
  });
  const labels = labelData.repository.labels.nodes;

  return labels;
}

export function createLabel(
  owner: string,
  repoName: string,
  label: {
    name: string;
    color: string;
  },
  accessToken: string
) {
  // use REST api to create label since the graphql api is still in preview
  // curl -L \
  // -X POST \
  // -H "Accept: application/vnd.github+json" \
  // -H "Authorization: Bearer <YOUR-TOKEN>"\
  // -H "X-GitHub-Api-Version: 2022-11-28" \
  // https://api.github.com/repos/OWNER/REPO/labels \
  // -d '{"name":"bug","description":"Something isn'\''t working","color":"f29513"}'
  return fetch(`https://api.github.com/repos/${owner}/${repoName}/labels`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      // this header is blocked by CORS policy
      // "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      name: label.name,
      color: label.color,
      description: "Automatically created by the task manager app",
    }),
  });
}
