import { useState } from "react";
import { Button, Input, Space } from "@mantine/core";
import RichTextEditor from "../RichTextEditor";

export interface IssueEditorProps {
  handleSubmit: ({ title, body }: { title: string; body: string }) => void;
  disabled?: boolean;
}

export const IssueEditor = ({ handleSubmit, disabled }: IssueEditorProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(false);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    setTitle(newTitle);
    if (error && newTitle.length > 0) setError(false);
  };

  const onSubmit = () => {
    if (title.length === 0) {
      setError(true);
      return;
    }
    handleSubmit({ title, body });
  };

  return (
    <>
      <Input.Wrapper
        {...(error && {
          error: "Title is required",
        })}
      >
        <Input
          placeholder="Title"
          size="md"
          value={title}
          onChange={onTitleChange}
        />
      </Input.Wrapper>
      <Space h="xl" />
      <RichTextEditor placeholder="description" setContent={setBody} />
      <Space h="xl" />
      <div className="flex justify-end px-4">
        <Button
          color="green"
          variant="outline"
          onClick={onSubmit}
          disabled={disabled}
        >
          Create New Task
        </Button>
      </div>
    </>
  );
};

export default IssueEditor;
