"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronRight, Info, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  capsScreens,
  getTotalFieldCount,
  type CapsScreen,
  type FieldSection,
  type CapsField,
} from "@/lib/caps-field-options";

interface FieldOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FieldOptionsModal({ isOpen, onClose }: FieldOptionsModalProps) {
  const [activeScreen, setActiveScreen] = useState<string>("sizing");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Basic Inputs (Required)", "Motor (Required)", "Construction"])
  );

  if (!isOpen) return null;

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionName)) {
        next.delete(sectionName);
      } else {
        next.add(sectionName);
      }
      return next;
    });
  };

  const currentScreen = capsScreens.find((s) => s.id === activeScreen);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-3">
            <ListFilter className="h-6 w-6 text-greenheck-green" />
            <div>
              <h2 className="text-xl font-bold text-neutral-800">
                CAPS Input Fields Reference
              </h2>
              <p className="text-sm text-neutral-500">
                G/GB Series Roof Exhaust Fans • {getTotalFieldCount()} fields
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Screen Tabs */}
        <div className="flex border-b border-neutral-200 bg-white">
          {capsScreens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeScreen === screen.id
                  ? "bg-greenheck-green text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span className="mr-2">{screen.icon}</span>
              {screen.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentScreen && (
            <div className="space-y-4">
              {currentScreen.sections.map((section) => (
                <SectionPanel
                  key={section.name}
                  section={section}
                  isExpanded={expandedSections.has(section.name)}
                  onToggle={() => toggleSection(section.name)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
          <div className="flex items-center justify-between">
            <span>
              Source: CAPS v4.48 • Decompiled from Cfs.Fans.FanSelector.dll
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  Required
                </Badge>
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline">Optional</Badge>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionPanel({
  section,
  isExpanded,
  onToggle,
}: {
  section: FieldSection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-neutral-500" />
          )}
          <span className="font-medium text-neutral-800">{section.name}</span>
          <Badge variant="outline" className="text-xs">
            {section.fields.length} fields
          </Badge>
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-neutral-100">
          {section.fields.map((field) => (
            <FieldRow key={field.name} field={field} />
          ))}
        </div>
      )}
    </div>
  );
}

function FieldRow({ field }: { field: CapsField }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="px-4 py-3 bg-white hover:bg-neutral-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-700">{field.label}</span>
            {field.required && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 text-xs"
              >
                Required
              </Badge>
            )}
            <Badge variant="outline" className="text-xs capitalize">
              {field.type}
            </Badge>
          </div>

          {field.notes && (
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {field.notes}
            </p>
          )}

          {field.source && (
            <p className="text-xs text-blue-500 mt-1 font-mono">
              {field.source}
            </p>
          )}
        </div>

        {field.options && field.options.length > 0 && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-xs text-greenheck-green hover:underline flex items-center gap-1"
          >
            {showOptions ? "Hide" : "Show"} {field.options.length} options
            {showOptions ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {showOptions && field.options && (
        <div className="mt-3 ml-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {field.options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 bg-neutral-100 rounded text-sm"
            >
              <div className="font-medium text-neutral-700">{option.label}</div>
              {option.description && (
                <div className="text-xs text-neutral-500 mt-0.5">
                  {option.description}
                </div>
              )}
              <div className="text-xs text-neutral-400 font-mono mt-0.5">
                {option.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
