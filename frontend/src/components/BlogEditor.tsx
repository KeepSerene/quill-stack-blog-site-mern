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
import { GalleryThumbnails } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      </div>
    </div>
  );
};

export default BlogEditor;
