"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Fan, Clipboard, Check, RotateCcw, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageBubble, type Message } from "@/components/message-bubble";
import { parseAiResponse, formatSelectionSummary } from "@/lib/caps-generator";
import { FieldOptionsModal } from "@/components/field-options-modal";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFieldOptions, setShowFieldOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `👋 **Welcome to the Greenheck Fan Selector!**

I'm here to help you test CAPS (Computerized Automated Product Selection) for G and GB series roof exhaust fans.

**Tell me about your fan requirements:**
- Airflow (CFM)
- Static Pressure (inches WG)
- Voltage and Phase
- Any specific preferences (drive type, accessories, etc.)

**Example:** "I need a roof exhaust fan for 5000 CFM at 1.5" static pressure, 460V/3-phase, direct drive with backdraft damper."`,
        },
      ]);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isStreaming) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage("");

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulatedMessage += parsed.text;
                  setStreamingMessage(accumulatedMessage);
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }

      // Parse the AI response for CAPS data
      const parseResult = parseAiResponse(accumulatedMessage);
      
      // Add completed assistant message with capsClipboard if found
      const assistantMessage: Message = {
        role: "assistant",
        content: accumulatedMessage,
      };
      
      if (parseResult.found && parseResult.capsClipboard) {
        assistantMessage.capsClipboard = parseResult.capsClipboard;
        console.log("CAPS data extracted:", parseResult.selections.map(s => formatSelectionSummary(s)));
      }
      
      setMessages([...newMessages, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `❌ **Error:** ${error instanceof Error ? error.message : "Failed to get response"}. Please check your API key configuration.`,
        },
      ]);
      setStreamingMessage("");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyLastClipboard = () => {
    // Find the last message with CAPS clipboard data
    const lastCapsMessage = [...messages]
      .reverse()
      .find((m) => m.capsClipboard);
    if (lastCapsMessage?.capsClipboard) {
      navigator.clipboard.writeText(lastCapsMessage.capsClipboard);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setStreamingMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-greenheck-green flex items-center justify-center">
              <Fan className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">
                Greenheck Fan Selector
              </h1>
              <p className="text-sm text-neutral-600">
                AI-powered G/GB series testing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Claude Sonnet 4.5
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {streamingMessage && (
                <MessageBubble
                  message={{ role: "assistant", content: streamingMessage }}
                  isStreaming={true}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-200 bg-white p-4 flex-shrink-0">
            <div className="flex gap-3">
              <Textarea
                placeholder="Describe your fan requirements... (Press Enter to send, Shift+Enter for new line)"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                className="flex-1 min-h-[60px] max-h-[150px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isStreaming}
                size="lg"
                className="h-auto"
              >
                {isStreaming ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-neutral-200 bg-white p-4 overflow-y-auto flex-shrink-0 hidden lg:block">
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowFieldOptions(true)}
              >
                <ListFilter className="h-4 w-4 mr-2" />
                Display Input Fields
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleCopyLastClipboard}
                disabled={!messages.some((m) => m.capsClipboard)}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2 text-green-400" />
                ) : (
                  <Clipboard className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy CAPS Clipboard"}
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">G Series (Direct Drive)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-neutral-600 space-y-1">
                <p>
                  <strong>Sizes:</strong> 103, 103HP, 123, 133, 143, 143HP, 163,
                  163HP, 183, 203
                </p>
                <p>
                  <strong>Best for:</strong> Lower CFM, quieter, less
                  maintenance
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">GB Series (Belt Drive)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-neutral-600 space-y-1">
                <p>
                  <strong>Sizes:</strong> 80, 100, 120, 140, 160, 180, 200, 220,
                  240, 270, 300, 330, 360
                </p>
                <p>
                  <strong>Best for:</strong> Higher CFM, flexible motor sizing
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Example Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "5000 CFM @ 1.5\" SP, 460V/3-phase, direct drive",
                "Restaurant kitchen exhaust, 3000 CFM, belt drive with damper",
                "Generate CAPS clipboard for G-163 at 4500 CFM",
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentMessage(prompt)}
                  className="w-full text-left text-xs p-2 rounded bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 px-6 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Powered by BuildVision • Greenheck Fan Selection Testing Tool
          </p>
          <p className="text-xs text-neutral-400">
            For testing purposes only. Verify selections in CAPS.
          </p>
        </div>
      </footer>

      {/* Field Options Modal */}
      <FieldOptionsModal
        isOpen={showFieldOptions}
        onClose={() => setShowFieldOptions(false)}
      />
    </div>
  );
}
