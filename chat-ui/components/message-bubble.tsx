"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Sparkles, Loader2, Copy, Check, FileJson, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FanSelection } from "@/lib/caps-generator";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  capsClipboard?: string;
  /** Parsed fan selections for enhanced display */
  selections?: FanSelection[];
  /** Structured JSON export */
  structuredJson?: string;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-bv-blue-100 border border-bv-blue-200 rounded-lg px-4 py-2 max-w-[90%]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-bv-blue-400" />
            <span className="text-xs font-semibold text-bv-blue-700">
              System
            </span>
          </div>
          <div className="text-sm text-neutral-700 markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser ? "bg-bv-blue-400" : "bg-greenheck-green"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-bv-blue-400 text-white rounded-br-sm"
            : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm shadow-sm"
        )}
      >
        {/* Role Label */}
        <div
          className={cn(
            "text-xs font-semibold mb-1",
            isUser ? "text-bv-blue-100" : "text-neutral-500"
          )}
        >
          {isUser ? "You" : "Greenheck Assistant"}
        </div>

        {/* Message Text */}
        <div
          className={cn(
            "text-sm markdown-content",
            isUser ? "text-white" : "text-neutral-700"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Override link styles for user messages
              a: ({ children, href }) => (
                <a
                  href={href}
                  className={cn(
                    "underline",
                    isUser
                      ? "text-bv-blue-100 hover:text-white"
                      : "text-bv-blue-400 hover:text-bv-blue-500"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              // Override code block styles
              code: ({ children, className }) => {
                const isInline = !className;
                return (
                  <code
                    className={cn(
                      isInline
                        ? "px-1 py-0.5 rounded text-xs font-mono"
                        : "block p-2 rounded text-xs font-mono overflow-x-auto",
                      isUser ? "bg-bv-blue-500" : "bg-neutral-100"
                    )}
                  >
                    {children}
                  </code>
                );
              },
              // Override table styles
              table: ({ children }) => (
                <table
                  className={cn(
                    "w-full border-collapse my-2 text-xs",
                    isUser ? "border-bv-blue-300" : "border-neutral-200"
                  )}
                >
                  {children}
                </table>
              ),
              th: ({ children }) => (
                <th
                  className={cn(
                    "border px-2 py-1 text-left font-semibold",
                    isUser
                      ? "border-bv-blue-300 bg-bv-blue-500"
                      : "border-neutral-200 bg-neutral-100"
                  )}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  className={cn(
                    "border px-2 py-1",
                    isUser ? "border-bv-blue-300" : "border-neutral-200"
                  )}
                >
                  {children}
                </td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <Loader2 className="h-3 w-3 animate-spin text-bv-blue-400" />
            <span className="text-xs text-neutral-500">Thinking...</span>
          </div>
        )}

        {/* Enhanced CAPS Export Section with Tabs */}
        {(message.capsClipboard || message.structuredJson) && (
          <CapsExportSection
            capsClipboard={message.capsClipboard}
            structuredJson={message.structuredJson}
          />
        )}
      </div>
    </div>
  );
}

/**
 * CAPS Export Section with tabbed JSON/CSV display
 */
interface CapsExportSectionProps {
  capsClipboard?: string;
  structuredJson?: string;
}

type ExportTab = "json" | "csv";

function CapsExportSection({ capsClipboard, structuredJson }: CapsExportSectionProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("json");
  const [copied, setCopied] = useState<ExportTab | null>(null);

  // Count fields from CSV headers
  const csvLines = capsClipboard?.split('\n') || [];
  const headerCount = csvLines[0]?.split('\t').length || 0;

  const handleCopy = async (format: ExportTab) => {
    const content = format === "json" ? structuredJson : capsClipboard;
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-neutral-200">
      {/* Header with field count */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-neutral-600 flex items-center gap-2">
          📋 CAPS Selection Data
          <span className="text-neutral-400 font-normal">
            ({headerCount} input fields)
          </span>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setActiveTab("json")}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
            activeTab === "json"
              ? "bg-bv-blue-400 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          <FileJson className="h-3 w-3" />
          JSON
        </button>
        <button
          onClick={() => setActiveTab("csv")}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
            activeTab === "csv"
              ? "bg-bv-blue-400 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          <FileSpreadsheet className="h-3 w-3" />
          CSV
        </button>
        <button
          onClick={() => handleCopy(activeTab)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs rounded ml-auto transition-colors",
            copied === activeTab
              ? "bg-green-500 text-white"
              : "bg-greenheck-green text-white hover:bg-greenheck-green/90"
          )}
        >
          {copied === activeTab ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy {activeTab.toUpperCase()}
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="relative">
        {activeTab === "json" && structuredJson && (
          <pre className="text-xs bg-neutral-50 border border-neutral-200 p-3 rounded overflow-x-auto font-mono max-h-[300px] overflow-y-auto">
            {structuredJson}
          </pre>
        )}
        {activeTab === "json" && !structuredJson && capsClipboard && (
          <div className="text-xs text-neutral-500 italic p-3 bg-neutral-50 rounded border border-neutral-200">
            JSON preview not available. Switch to CSV view.
          </div>
        )}
        {activeTab === "csv" && capsClipboard && (
          <div className="overflow-x-auto">
            <CsvPreviewTable csv={capsClipboard} />
          </div>
        )}
      </div>

      {/* Field Categories Summary */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">📐 Sizing: 15 fields</span>
        <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">⚡ Electrical: 18 fields</span>
        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">🔧 Configuration: 15 fields</span>
      </div>
    </div>
  );
}

/**
 * CSV Preview as a formatted table
 */
function CsvPreviewTable({ csv }: { csv: string }) {
  const lines = csv.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return null;

  const headers = lines[0].split('\t');
  const rows = lines.slice(1).map(line => line.split('\t'));

  // Group headers by category for better display
  const categories = [
    { name: "Core", start: 0, end: 5, color: "bg-neutral-100" },
    { name: "Performance", start: 5, end: 9, color: "bg-blue-50" },
    { name: "Electrical", start: 9, end: 17, color: "bg-yellow-50" },
    { name: "VariGreen", start: 17, end: 20, color: "bg-purple-50" },
    { name: "Disconnect", start: 20, end: 28, color: "bg-orange-50" },
    { name: "Sizing", start: 28, end: 39, color: "bg-blue-50" },
    { name: "Construction", start: 39, end: 44, color: "bg-green-50" },
    { name: "Accessories", start: 44, end: 50, color: "bg-pink-50" },
    { name: "Mounting", start: 50, end: 56, color: "bg-teal-50" },
  ];

  return (
    <div className="border border-neutral-200 rounded overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          {/* Category Header Row */}
          <tr className="border-b border-neutral-200">
            {categories.map((cat, i) => {
              const colSpan = Math.min(cat.end, headers.length) - cat.start;
              if (colSpan <= 0) return null;
              return (
                <th 
                  key={i} 
                  colSpan={colSpan}
                  className={cn("px-2 py-1 text-center font-semibold border-r border-neutral-200 last:border-r-0", cat.color)}
                >
                  {cat.name}
                </th>
              );
            })}
          </tr>
          {/* Field Header Row */}
          <tr className="bg-neutral-100 border-b border-neutral-200">
            {headers.map((header, i) => (
              <th key={i} className="px-2 py-1 text-left font-medium whitespace-nowrap border-r border-neutral-100 last:border-r-0">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-2 py-1 whitespace-nowrap border-r border-neutral-50 last:border-r-0">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
