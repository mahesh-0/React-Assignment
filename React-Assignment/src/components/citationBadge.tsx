"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface CitationBadgeProps {
  number: number;
  type: "article" | "conversation";
  title: string;
  author?: string;
  time?: string;
  content: string;
}

export function CitationBadge({
  number,
  type,
  author,
  time,
  content,
}: CitationBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-violet-600 text-white text-[10px] sm:text-xs ml-1 cursor-pointer"
          >
            {number}
          </motion.span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px] sm:max-w-xs">
          <div className="p-2">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              {type === "article" ? (
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
              <div className="text-[10px] sm:text-xs text-gray-500">
                {type === "article" ? "Public article" : "Conversation"}
                {author && ` · ${author}`}
                {time && ` · ${time}`}
              </div>
            </div>
            <p className="text-xs sm:text-sm">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
