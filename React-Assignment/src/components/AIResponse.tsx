"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, MessageSquare } from "lucide-react";
import { SourceItem } from "./SourceItem";
import ComposerIcon from "./Icons/ComposerIcon";
import ResponseIcon from "./Icons/ResponseIcon";

interface AIResponseProps {
  paragraphs: string[];
  citations: {
    index: number;
    paragraphIndex: number;
    type: "article" | "conversation";
    title: string;
    author?: string;
    time?: string;
    content: string;
  }[];
  sources: {
    id: number;
    type: "article" | "conversation";
    title: string;
    author?: string;
    time?: string;
    content: string;
  }[];
  isComplete: boolean;
  currentTextIndex: number;
  currentCharIndex: number;
  onAddToComposer: () => void;
}

export function AIResponse({
  paragraphs,
  citations,
  sources,
  isComplete,
  currentTextIndex,
  currentCharIndex,
  onAddToComposer,
}: AIResponseProps) {
  const [activeSource, setActiveSource] = useState<number | null>(null);
  const [showAllSources, setShowAllSources] = useState(false);
  const [sourcesDiscoveryPhase, setSourcesDiscoveryPhase] = useState(true);
  const [discoveredSources, setDiscoveredSources] = useState<number[]>([]);
  const [sourcesPosition, setSourcesPosition] = useState<"top" | "bottom">(
    "top"
  );

  useEffect(() => {
    if (sourcesDiscoveryPhase && sources.length > 0) {
      const discoverSource = (index: number) => {
        if (index < Math.min(3, sources.length)) {
          setDiscoveredSources((prev) => [...prev, sources[index].id]);
          setTimeout(() => discoverSource(index + 1), 800);
        } else {
          setTimeout(() => {
            setSourcesDiscoveryPhase(false);
            setTimeout(() => {
              setSourcesPosition("bottom");
            }, 1000);
          }, 3000);
        }
      };

      setTimeout(() => discoverSource(0), 1000);
    }
  }, [sourcesDiscoveryPhase, sources]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <AnimatePresence>
        {(sourcesDiscoveryPhase ||
          (sourcesPosition === "top" && !sourcesDiscoveryPhase)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3 sm:mb-4"
          >
            {sourcesDiscoveryPhase && (
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="text-xs sm:text-sm"
                >
                  Researching sources I found...
                </motion.span>
              </div>
            )}
            <div className="space-y-1.5 sm:space-y-2">
              {sources.slice(0, 3).map((source) => (
                <AnimatePresence key={source.id}>
                  {discoveredSources.includes(source.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <SourceItem
                        type={source.type}
                        title={source.title}
                        author={source.author}
                        time={source.time}
                        isActive={activeSource === source.id}
                        onClick={() => setActiveSource(source.id)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response content */}
      {!sourcesDiscoveryPhase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-gradient-to-br from-violet-50 to-pink-50 p-3 sm:p-4 rounded-lg"
        >
          {paragraphs.map((text, index) => (
            <p key={index} className="text-xs sm:text-sm">
              {index < currentTextIndex
                ? text
                : index === currentTextIndex
                ? text.substring(0, currentCharIndex)
                : ""}
              {citations
                .filter((c) => c.paragraphIndex === index)
                .map((citation) => (
                  <TooltipProvider key={citation.index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale:
                              isComplete && index <= currentTextIndex ? 1 : 0,
                            opacity:
                              isComplete && index <= currentTextIndex ? 1 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-violet-600 text-white text-[10px] sm:text-xs ml-1 cursor-pointer"
                        >
                          {citation.index}
                        </motion.span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="max-w-[200px] sm:max-w-xs bg-slate-100 text-black"
                      >
                        <div className="p-2">
                          <div className="font-semibold text-sm sm:text-xl mb-1">
                            {citation.type === "article"
                              ? "Getting a Refund"
                              : "Refund for an unwanted gift"}
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            {citation.type === "article" ? (
                              <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mt-0.5" />
                            ) : (
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              {citation.type === "article"
                                ? "Public article"
                                : "Conversation"}
                              {citation.author && ` · ${citation.author}`}
                              {citation.time && ` · ${citation.time}`}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm">
                            {citation.content}
                          </p>

                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white mt-2 text-xs sm:text-sm h-7 sm:h-8"
                          >
                            <ComposerIcon />
                            <span>Add to composer</span>
                          </Button>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </p>
          ))}

          {!isComplete && currentTextIndex < paragraphs.length && (
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              ▋
            </motion.span>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 sm:mt-3"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white cursor-pointer text-xs sm:text-sm h-7 sm:h-8"
                onClick={onAddToComposer}
              >
                <ComposerIcon />

                <span>Add to composer</span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Sources list after response - at the bottom */}
      {sourcesPosition === "bottom" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 sm:mt-3 w-full sm:w-52"
        >
          <div className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
            {sources.length} relevant sources found
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            {sources.slice(0, showAllSources ? undefined : 3).map((source) => (
              <SourceItem
                key={source.id}
                type={source.type}
                title={source.title}
                author={source.author}
                time={source.time}
                isActive={activeSource === source.id}
                onClick={() => setActiveSource(source.id)}
              />
            ))}
            {sources.length > 0 && (
              <motion.div
                className="flex items-center text-xs sm:text-sm text-violet-600 cursor-pointer mt-1"
                onClick={() => setShowAllSources(!showAllSources)}
                whileHover={{ x: showAllSources ? 0 : 5 }}
              >
                <span>{showAllSources ? "Show less" : "See all"}</span>
                <span className="self-center mt-0.5 sm:mt-1">
                  <ResponseIcon />
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
