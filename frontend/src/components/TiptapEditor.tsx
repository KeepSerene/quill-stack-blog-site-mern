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
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Placeholder.configure({
    placeholder: "Blog content goes here...",
  }),
];

const TiptapEditor: React.FC<TiptapEditorProps> = ({ ...props }) => {
  return (
    <EditorProvider
      {...props}
      extensions={extensions}
      slotBefore={
        <Toolbar className="bg-background rounded-t-xl sticky top-16 z-10" />
      }
      editorContainerProps={{ className: "p-4" }}
      // editorProps for better editor behavior
      editorProps={{
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none",
        },
      }}
    />
  );
};

export default TiptapEditor;
