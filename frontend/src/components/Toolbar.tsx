/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { cn } from "@/lib/utils";
import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  ChevronDown,
  Code2,
  CodeSquare,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  TextQuote,
  Undo2,
  type LucideProps,
} from "lucide-react";
import type React from "react";
import { useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

type Level = 1 | 2 | 3;
interface HeadingType {
  label: string;
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">> &
    React.RefAttributes<SVGElement>;
  level: Level;
}

const HEADINGS: HeadingType[] = [
  {
    label: "Heading 1",
    Icon: Heading1,
    level: 1,
  },
  {
    label: "Heading 2",
    Icon: Heading2,
    level: 2,
  },
  {
    label: "Heading 3",
    Icon: Heading3,
    level: 3,
  },
] as const;

function Toolbar({ className, ...props }: React.ComponentProps<"div">) {
  const { editor } = useCurrentEditor();

  const getActiveToolIcon = useCallback(() => {
    if (!editor) return <Heading className="size-4" />;

    const activeHeading = HEADINGS.find(({ level }) =>
      editor.isActive("heading", { level })
    );

    if (!activeHeading?.level) return <Heading className="size-4" />;

    return <activeHeading.Icon className="size-4" />;
  }, [editor]);

  if (!editor) return null;

  const isAnyHeadingActive = editor.isActive("heading");

  return (
    <div {...props} className={cn("p-2 flex items-center gap-1", className)}>
      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.commands.undo()}
            disabled={!editor.can().undo()}
            aria-label="Undo"
          >
            <Undo2 className="size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Undo</span>
          <br />
          <span className="opacity-70 font-mono">Ctrl+Z</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.commands.redo()}
            disabled={!editor.can().redo()}
            aria-label="Undo"
          >
            <Redo2 className="size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Redo</span>
          <br />
          <span className="opacity-70 font-mono">Ctrl+Shift+Z</span>
        </TooltipContent>
      </Tooltip>

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger type="button" asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={isAnyHeadingActive ? "secondary" : "ghost"}
                className="px-2! gap-0"
              >
                {getActiveToolIcon()}
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent side="bottom">Heading</TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="start"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">
              Heading
            </DropdownMenuLabel>

            {HEADINGS.map(({ label, Icon, level }) => (
              <DropdownMenuItem
                key={`heading-${level}`}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                disabled={!editor.can().toggleHeading({ level })}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.chain().focus().toggleBulletList().run()}
            pressed={editor.isActive("bulletList")}
            aria-label="Toggle bullet list"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <List className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom">Bullet List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.chain().focus().toggleOrderedList().run()}
            pressed={editor.isActive("orderedList")}
            aria-label="Toggle ordered list"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <ListOrdered className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom">Ordered List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.chain().focus().toggleBlockquote().run()}
            pressed={editor.isActive("blockquote")}
            aria-label="Toggle blockquote"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <TextQuote className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Blockquote</span>
          <br />
          <span className="font-mono opacity-70">Ctrl+Shift+B</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.chain().focus().toggleCodeBlock().run()}
            pressed={editor.isActive("codeBlock")}
            aria-label="Toggle code block"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <CodeSquare className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Code Block</span>
          <br />
          <span className="font-mono opacity-70">Ctrl+Alt+C</span>
        </TooltipContent>
      </Tooltip>

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.chain().focus().toggleBold().run()}
            pressed={editor.isActive("bold")}
            aria-label="Toggle bold"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <Bold className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Bold</span>
          <br />
          <span className="font-mono opacity-70">Ctrl+B</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.chain().focus().toggleItalic().run()}
            pressed={editor.isActive("italic")}
            aria-label="Toggle italic"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <Italic className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Italic</span>
          <br />
          <span className="font-mono opacity-70">Ctrl+I</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.chain().focus().toggleStrike().run()}
            pressed={editor.isActive("strike")}
            aria-label="Toggle strike"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <Strikethrough className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Strike</span>
          <br />
          <span className="font-mono opacity-70">Ctrl+Shift+S</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger type="button" asChild>
          <Toggle
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.chain().focus().toggleCode().run()}
            pressed={editor.isActive("strike")}
            aria-label="Toggle inline code"
            className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
          >
            <Code2 className="size-4" />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-center">
          <span>Inline Code</span>
          <br />
          <span className="font-mono opacity-70">Ctrl+E</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default Toolbar;
