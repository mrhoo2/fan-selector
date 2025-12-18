"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  capsClipboard?: string;
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

        {/* CAPS Clipboard Section */}
        {message.capsClipboard && (
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <div className="text-xs font-semibold text-neutral-600 mb-2">
              📋 CAPS Clipboard Ready
            </div>
            <pre className="text-xs bg-neutral-100 p-2 rounded overflow-x-auto font-mono">
              {message.capsClipboard}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
