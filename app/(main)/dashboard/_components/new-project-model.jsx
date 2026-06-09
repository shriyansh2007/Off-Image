"use client";

import React, { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { usePlanAccess } from "@/hooks/use-plan-access";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useDropzone } from "react-dropzone";
import { useMutation } from "convex/react";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";

const NewProjectModal = ({ isOpen, onClose }) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const createProject = useMutation(api.projects.create);

  const { isFree, canCreateProject } = usePlanAccess();

  const { data: projects } = useConvexQuery(
    api.projects.getUserProjects
  );

  const currentProjectCount = projects?.length || 0;

  const canCreate = canCreateProject(currentProjectCount);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      setSelectedFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const nameWithoutExt = file.name.replace(
        /\.[^/.]+$/,
        ""
      );

      setProjectTitle(
        nameWithoutExt || "Untitled Project"
      );
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
      ],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: !canCreate,
  });

  const resetState = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
    setIsUploading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
  };

  const handleCreateProject = async () => {
    if (!canCreate) {
      toast.error(
        "You reached your free plan limit"
      );
      return;
    }

    if (
      !selectedFile ||
      !projectTitle.trim()
    ) {
      toast.error(
        "Please provide all required fields"
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append(
        "projectTitle",
        projectTitle
      );
      formData.append("width", selectedFile.width);
      formData.append("height", selectedFile.height);
      // setSelectedFile(selectedFile)
      // setProjectTitle(projectTitle)
      // setPreviewUrl(previewUrl)
      const uploadResult = await axios.post("/api/imagekit/upload", formData);
      
      await createProject({
        name: projectTitle,
        originalImageUrl: uploadResult.data.originalImageUrl,
        thumbnailUrl: uploadResult.data.thumbnailUrl,
        width: uploadResult.data.width,
        height: uploadResult.data.height,
        canvasState: null,
        // createdAt: Date.now(),
        // updatedAt: Date.now(),
      });

      

      toast.success(
        "Project created successfully"
      );

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create project"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            Create New Project
          </DialogTitle>

          {isFree && (
            <Badge
              variant="secondary"
              className="bg-slate-700 text-white"
            >
              {currentProjectCount}/3 Projects
            </Badge>
          )}
        </DialogHeader>

        {isFree &&
          currentProjectCount >= 2 && (
            <Alert>
              <Crown className="h-4 w-4" />

              <AlertDescription>
                You are close to your free
                plan limit.
              </AlertDescription>

              <AlertAction>
                <Button variant="outline">
                  Upgrade
                </Button>
              </AlertAction>
            </Alert>
          )}

        {/* Upload Area */}
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition cursor-pointer
            ${
              isDragActive
                ? "border-primary bg-muted"
                : "border-muted-foreground/30"
            }
            ${
              !canCreate
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted/50"
            }`}
          >
            <input {...getInputProps()} />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive
                  ? "Drop Image Here"
                  : "Upload Image"}
              </h3>

              <p className="text-sm text-muted-foreground">
                {canCreate
                  ? "Drag & drop your image here or click to browse"
                  : "Upgrade to Pro to create more projects"}
              </p>

              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, JPEG,
                GIF up to 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">
                {projectTitle}
              </p>

              <Button
                variant="ghost"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateProject}
            disabled={
              !selectedFile ||
              !projectTitle.trim() ||
              isUploading ||
              !canCreate
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;