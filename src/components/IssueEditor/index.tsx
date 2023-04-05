import { useState } from "react";
import { Button, Input, Space, Text } from "@mantine/core";
import RichTextEditor from "../RichTextEditor";

export interface IssueEditorProps {
  handleSubmit: ({ title, body }: { title: string; body: string }) => void;
  variant: "create" | "edit";
  disabled?: boolean;
  defaultTitle?: string;
  defaultBody?: string;
}

export const IssueEditor = ({
  handleSubmit,
  disabled,
  variant,
  defaultTitle = "",
  defaultBody = "",
}: IssueEditorProps) => {
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    setTitle(newTitle);
    if (titleError && newTitle.length > 0) {
      setTitleError(false);
    }
    if (bodyError && newTitle.length > 30) {
      setBodyError(false);
    }
  };

  const onSubmit = () => {
    if (title.length === 0) {
      setTitleError(true);
    }
    if (body.length < 30) {
      setBodyError(true);
    }
    if (title.length === 0 || body.length < 30) {
      return;
    }
    handleSubmit({ title, body });
  };

  return (
    <>
      <Input.Wrapper
        {...(titleError && {
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
      <RichTextEditor
        placeholder="description"
        setContent={setBody}
        defaultValue={defaultBody}
      />
      {bodyError && (
        <Text color="red">
          The body of the issue must be at least 30 characters long.
        </Text>
      )}
      <Space h="xl" />
      <div className="flex justify-end px-4">
        <Button
          color="green"
          variant="outline"
          onClick={onSubmit}
          disabled={disabled}
        >
          {variant === "create" ? "Create New Task" : "Update Task"}
        </Button>
      </div>
    </>
  );
};

export default IssueEditor;
