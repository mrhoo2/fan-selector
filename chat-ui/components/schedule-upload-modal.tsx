"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, FileText, Image, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ExtractedScheduleItem } from "@/lib/schedule-extractor";

interface ScheduleUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (chatMessage: string, items: ExtractedScheduleItem[]) => void;
}

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

const SUPPORTED_TYPES = [
  { mime: "image/png", label: "PNG", icon: Image },
  { mime: "image/jpeg", label: "JPEG", icon: Image },
  { mime: "image/webp", label: "WEBP", icon: Image },
  { mime: "application/pdf", label: "PDF", icon: FileText },
];

const ACCEPT_STRING = SUPPORTED_TYPES.map(t => t.mime).join(",");

export function ScheduleUploadModal({ isOpen, onClose, onExtracted }: ScheduleUploadModalProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [extractedCount, setExtractedCount] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setStatus("idle");
    setFileName("");
    setError("");
    setExtractedCount(0);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const processFile = useCallback(async (file: File) => {
    // Validate file type
    if (!SUPPORTED_TYPES.some(t => t.mime === file.type)) {
      setError(`Unsupported file type: ${file.type}`);
      setStatus("error");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setStatus("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setStatus("processing");

      const response = await fetch("/api/extract-schedule", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to extract schedule");
      }

      setExtractedCount(result.itemCount);
      setStatus("success");

      // After a brief delay to show success, send to chat
      setTimeout(() => {
        onExtracted(result.chatMessage, result.items);
        handleClose();
      }, 1500);

    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to process file");
      setStatus("error");
    }
  }, [onExtracted, handleClose]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <Card 
        className="relative w-full max-w-lg bg-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-bv-blue" />
            Upload Mechanical Schedule
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Display */}
          {status === "idle" && (
            <>
              {/* Drop Zone */}
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${isDragOver 
                    ? "border-bv-blue bg-bv-blue/5" 
                    : "border-neutral-300 hover:border-bv-blue hover:bg-neutral-50"
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-neutral-400" />
                <p className="text-sm font-medium text-neutral-700">
                  Drag & drop your schedule here
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  or click to browse
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_STRING}
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Supported formats */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs text-neutral-500">Supported:</span>
                {SUPPORTED_TYPES.map(type => (
                  <Badge key={type.mime} variant="outline" className="text-xs">
                    {type.label}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  Max 10MB
                </Badge>
              </div>

              {/* Help text */}
              <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-600">
                <p className="font-medium mb-1">💡 Tips for best results:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload clear images of equipment schedules</li>
                  <li>Tables with columns for Mark, CFM, SP work best</li>
                  <li>Multi-page PDFs will process the first page</li>
                </ul>
              </div>
            </>
          )}

          {/* Uploading/Processing State */}
          {(status === "uploading" || status === "processing") && (
            <div className="py-8 text-center">
              <Loader2 className="h-10 w-10 mx-auto mb-4 text-bv-blue animate-spin" />
              <p className="font-medium text-neutral-700">
                {status === "uploading" ? "Uploading..." : "Analyzing with AI..."}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{fileName}</p>
              {status === "processing" && (
                <p className="text-xs text-neutral-400 mt-3">
                  Using Gemini Flash 2.5 to extract fan specifications
                </p>
              )}
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="py-8 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-4 text-greenheck-green" />
              <p className="font-medium text-neutral-700">
                Successfully extracted {extractedCount} fan{extractedCount !== 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Generating CAPS selections...
              </p>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="py-6 text-center">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <p className="font-medium text-neutral-700">Extraction Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetState}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
