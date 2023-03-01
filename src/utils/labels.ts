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

const OPEN_COLOR = "1D76DB";
const IN_PROGRESS_COLOR = "B60205";
const DONE_COLOR = "0E8A16";

export type OpenLabel = {
  name: "open";
  color: typeof OPEN_COLOR;
  id: string;
};

export type InProgressLabel = {
  name: "in progress";
  color: typeof IN_PROGRESS_COLOR;
  id: string;
};

export type DoneLabel = {
  name: "done";
  color: typeof DONE_COLOR;
  id: string;
};

export type RequiredLabels = {
  open: OpenLabel;
  inProgress: InProgressLabel;
  done: DoneLabel;
};

const REQUIRED_LABEL_COLORS = [
  { name: "open", color: OPEN_COLOR },
  { name: "in progress", color: IN_PROGRESS_COLOR },
  { name: "done", color: DONE_COLOR },
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
    | OpenLabel
    | undefined;
  const inProgressLabel = newLabels.find(
    (label) => label.name === "in progress"
  ) as InProgressLabel | undefined;
  const doneLabel = newLabels.find((label) => label.name === "done") as
    | DoneLabel
    | undefined;

  if (!openLabel || !inProgressLabel || !doneLabel) {
    throw new Error("Failed to create required labels");
  }

  return {
    open: openLabel,
    inProgress: inProgressLabel,
    done: doneLabel,
  };
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
