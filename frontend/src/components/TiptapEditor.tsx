/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { EditorProvider, type EditorProviderProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import Toolbar from "@/components/Toolbar";

type TiptapEditorProps = Omit<EditorProviderProps, "extensions" | "slotBefore">;

const extensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Placeholder.configure({
    placeholder: "Blog content goes here...",
  }),
];

const TiptapEditor: React.FC<TiptapEditorProps> = ({ ...props }) => {
  return (
    <EditorProvider
      extensions={extensions}
      slotBefore={
        <Toolbar className="bg-background rounded-t-xl sticky top-16 z-10" />
      }
      editorContainerProps={{ className: "p-4" }}
    ></EditorProvider>
  );
};

export default TiptapEditor;
