import { useState } from "react";

import {
  addLabelsToIssue,
  removeLabelsFromIssue,
  type OpenLabel,
  type InProgressLabel,
  type DoneLabel,
} from "@/utils/labels";
import { type Issue } from "@/hooks/useIssues";
import { showNotification } from "@mantine/notifications";

export default function useUpdateLabel(issue: Issue) {
  const [loading, setLoading] = useState(false);

  const updateLabel = async (
    label: OpenLabel | InProgressLabel | DoneLabel
  ) => {
    if (loading) {
      return;
    }
    if (issue.label.name === label.name) {
      return;
    }
    setLoading(true);
    try {
      await removeLabelsFromIssue(issue.id, [issue.label]);
      await addLabelsToIssue(issue.id, [label]);
      showNotification({
        title: "Success",
        message: "Issue label updated",
        color: "teal",
      });
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Failed to update issue",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateLabel };
}
