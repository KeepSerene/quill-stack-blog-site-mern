/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GalleryThumbnails, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { Textarea } from "@/components/ui/textarea";
import TiptapEditor from "@/components/TiptapEditor";

interface BlogEditorData {
  bannerImage?: Blob;
  title: string;
  content: string;
}

type BlogStatus = "draft" | "published";

type EditorDefaultValues = {
  bannerUrl: string;
  title: string;
  content: string;
  status: BlogStatus;
};

interface BlogEditorProps {
  defaultValues?: EditorDefaultValues;
  onSubmit: (formData: BlogEditorData, status: BlogStatus) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ defaultValues, onSubmit }) => {
  const [data, setData] = useState<BlogEditorData>({
    title: defaultValues?.title || "",
    content: defaultValues?.content || "",
  });
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | undefined>(
    defaultValues?.bannerUrl || ""
  );
  const status = defaultValues?.status || "draft";
  const hasBanner = useMemo(
    () => Boolean(bannerPreviewUrl),
    [bannerPreviewUrl]
  );

  return (
    <div className="space-y-5 relative">
      <div className="min-h-9 relative isolate">
        {/* Banner upload button */}
        {!hasBanner && (
          <Tooltip>
            <TooltipTrigger type="button" asChild>
              <Button
                type="button"
                variant="outline"
                asChild
                className="overflow-hidden absolute left-0.5 top-0.5"
              >
                <Label className="cursor-pointer">
                  <GalleryThumbnails className="size-4" />
                  <span>Add a banner...</span>

                  <Input
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
                    name="banner-image"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (!file) return;

                      setData((prev) => ({
                        ...prev,
                        bannerImage: file,
                      }));
                      setBannerPreviewUrl(URL.createObjectURL(file));
                    }}
                    className="sr-only"
                  />
                </Label>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
              Max allowed image size is 2MB.
              <br />
              Format must be: JPG, JPEG, PNG, or WEBP.
            </TooltipContent>
          </Tooltip>
        )}

        {/* Remove banner button */}
        {hasBanner && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setData((prev) => ({ ...prev, bannerImage: undefined }));
              setBannerPreviewUrl(undefined);
            }}
            aria-label="Remove banner image"
            title="Remove image"
            className="absolute left-2 top-2 z-30"
          >
            <X className="size-4" />
          </Button>
        )}

        {/* Banner image */}
        <AnimatePresence>
          {hasBanner && (
            <motion.figure
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 240, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", visualDuration: 0.25, bounce: 0.2 }}
              className="border rounded-xl overflow-hidden"
            >
              <img
                src={bannerPreviewUrl}
                alt={data.title}
                className="size-full object-cover"
              />
            </motion.figure>
          )}
        </AnimatePresence>
      </div>

      {/* Title */}
      <Textarea
        name="title"
        maxLength={180}
        value={data.title}
        onChange={(event) => {
          setData((prev) => ({ ...prev, title: event.target.value }));
        }}
        autoFocus
        placeholder="New post title here..."
        className="bg-transparent! text-4xl! font-semibold tracking-tight border-none px-0 ring-0! resize-none shadow-none"
      />

      {/* Tiptap Editor */}
      <div className="border rounded-xl inset-ring-border">
        <TiptapEditor
          content={data.content}
          onUpdate={({ editor }) => {
            setData((prev) => ({ ...prev, content: editor.getHTML() }));
          }}
        />
      </div>
    </div>
  );
};

export default BlogEditor;
