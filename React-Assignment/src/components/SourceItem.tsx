"use client";

import { FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SourceItemProps {
  type: "article" | "conversation";
  title: string;
  author?: string;
  time?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function SourceItem({
  type,
  title,
  author,
  time,
  onClick,
  isActive,
}: SourceItemProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 cursor-pointer hover:text-violet-600 rounded-md px-1",
        isActive && "text-violet-600 bg-violet-50"
      )}
      onClick={onClick}
      whileHover={{ x: 3 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
        {type === "article" ? (
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
        ) : (
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs sm:text-sm truncate block">{title}</span>
        {(author || time) && (
          <span className="text-[10px] sm:text-xs text-gray-500 block truncate">
            {author && `· ${author}`} {time && `· ${time}`}
          </span>
        )}
      </div>
    </motion.div>
  );
}
