import { type ReactNode, useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";
import Tools from "./Tools";

interface EditorProps {
  className?: string;
  value?: string;
  onChange?(html: string): void;
  editable?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  placeholder?: string;
}

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ul",
      },
    },

    orderedList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ol",
      },
    },
  }),
];
let loaded = false;
export default function RichEditor({
  editable,
  value,
  placeholder,
  isInvalid,
  errorMessage,
  className,
  onChange,
}: EditorProps){
  const editor = useEditor({
    extensions: [...extensions, Placeholder.configure({ placeholder })],
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (loaded && editable) return;

    if (editor && !editable) {
      editor.setEditable(false);
    }

    if (editor && value) {
      editor.commands.setContent(value);
      loaded = true;
    }
  }, [editor, value, editable]);

  useEffect(() => {
    return () => {
      loaded = false;
    };
  }, []);

  return (
    <div
      className={clsx(isInvalid && "ring-2 ring-red-400 p-2 rounded-medium")}
    >
      <Tools editor={editor} visible={editable} />
      <EditorContent editor={editor} className={className} />

      {errorMessage}
    </div>
  );
};

