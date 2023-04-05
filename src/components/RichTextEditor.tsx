import { RichTextEditor as MantineRichTextEditor, Link } from "@mantine/tiptap";
import { type Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import debounce from "lodash/debounce";

export interface RichTextEditorProps {
  setContent: (content: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export const RichTextEditor = ({
  placeholder,
  setContent,
  defaultValue = "",
}: RichTextEditorProps) => {
  const handleUpdate = debounce(({ editor }: { editor: Editor }) => {
    const content = editor.getHTML();
    setContent(content);
  }, 500);

  const editor = useEditor({
    extensions: [StarterKit, Link],
    onUpdate: handleUpdate,
    content: defaultValue,
  });

  return (
    <MantineRichTextEditor
      editor={editor}
      placeholder={placeholder}
      className="min-h-[20rem]"
    >
      <MantineRichTextEditor.Toolbar>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Code />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.H1 />
          <MantineRichTextEditor.H2 />
          <MantineRichTextEditor.H3 />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.BulletList />
          <MantineRichTextEditor.OrderedList />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Link />
          <MantineRichTextEditor.Unlink />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
};

export default RichTextEditor;
