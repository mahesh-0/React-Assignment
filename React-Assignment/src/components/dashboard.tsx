/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Copy,
  Send,
  MessageSquare,
  ChevronDown,
  Moon,
  Paperclip,
  Smile,
  Menu,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AICopilot } from "./AICopilot";
import { AIResponse } from "./AIResponse";
import LinkIcon from "./Icons/LinkIcon";
import SquareIcon from "./Icons/SquareIcon";

const inboxItems = [
  {
    id: 1,
    name: "Luis",
    source: "Github",
    preview: "Hey! I have a question about...",
    time: "45m",
    avatar: "L",
    avatarColor: "bg-blue-400",
  },
  {
    id: 2,
    name: "Ivan",
    source: "Nike",
    preview: "Hi there, I have a question...",
    time: "30m",
    avatar: "I",
    avatarColor: "bg-red-400",
    priority: "high",
  },
  {
    id: 3,
    name: "Lead from New York",
    preview: "Good morning, let me know...",
    time: "40m",
    avatar: "L",
    avatarColor: "bg-blue-400",
    unread: true,
  },
  {
    id: 4,
    name: "Booking API problems",
    subtext: "Bug report",
    source: "Luis · Small Crafts",
    preview: "",
    time: "45m",
    avatar: "B",
    avatarColor: "bg-gray-700",
  },
  {
    id: 5,
    name: "Miracle · Exemplary Bank",
    preview: "Hey there, I'm here to...",
    time: "45m",
    avatar: "M",
    avatarColor: "bg-green-400",
  },
];

const aiResponseText = [
  "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.",
  "To assist you with your refund request, could you please provide your order ID and proof of purchase.",
  "Please note:\n We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.",
  "Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.",
];

const refundSources = [
  {
    id: 1,
    type: "article",
    title: "Getting a refund",
    author: "Amy Adams",
    time: "1d ago",
    content:
      "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern.",
  },
  {
    id: 2,
    type: "conversation",
    title: "Refund for an order placed by mistake",
    author: "",
    time: "",
    content:
      "If you've placed an order by mistake, you can request a refund within 14 days of purchase. Please provide your order ID and we'll process your refund immediately.",
  },
  {
    id: 3,
    type: "conversation",
    title: "Refund for an unwanted gift",
    author: "Theresa Eds",
    time: "3d ago",
    content:
      "Unfortunately, we're only able to process refunds for orders that were placed within the last 60 days. Your order was placed well past the cut off date.",
  },
];

const aiResponseCitations: {
  index: number;
  paragraphIndex: number;
  type: "article" | "conversation";
  title: string;
  author?: string;
  time?: string;
  content: string;
}[] = [
  {
    index: 1,
    paragraphIndex: 0,
    type: "article",
    title: "Getting a refund",
    author: "Amy Adams",
    time: "1d ago",
    content:
      "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern.",
  },
  {
    index: 2,
    paragraphIndex: 3,
    type: "conversation",
    title: "Refund for an unwanted gift",
    author: "Theresa Eds",
    time: "3d ago",
    content:
      "Unfortunately, we're only able to process refunds for orders that were placed within the last 60 days. Your order was placed well past the cut off date.",
  },
];

export function Dashboard() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [aiState, setAiState] = useState<
    "idle" | "researching" | "typing" | "complete"
  >("idle");
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [sourcesFound, setSourcesFound] = useState(false);
  const [showInboxMobile, setShowInboxMobile] = useState(false);
  const [showAICopilotMobile, setShowAICopilotMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [composerText, setComposerText] = useState<string>("");
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState({
    text: "",
    start: 0,
    end: 0,
  });
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const handleRefundQuestion = () => {
    setAiState("researching");

    setTimeout(() => {
      setShowSources(true);
      setSourcesFound(true);
      setAiState("typing");
      setCurrentTextIndex(0);
      setCurrentCharIndex(0);
      setDisplayedText([]);
    }, 5000);
  };

  useEffect(() => {
    if (aiState !== "typing") return;

    if (currentTextIndex < aiResponseText.length) {
      const currentText = aiResponseText[currentTextIndex];

      if (currentCharIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => {
            const newText = [...prev];
            if (!newText[currentTextIndex]) newText[currentTextIndex] = "";
            newText[currentTextIndex] = currentText.substring(
              0,
              currentCharIndex + 1
            );
            return newText;
          });
          setCurrentCharIndex(currentCharIndex + 1);
        }, 20);

        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentTextIndex(currentTextIndex + 1);
          setCurrentCharIndex(0);
        }, 300);

        return () => clearTimeout(timer);
      }
    } else {
      setAiState("complete");
    }
  }, [aiState, currentTextIndex, currentCharIndex]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedText]);

  const handleAddToComposer = () => {
    const textToAdd = aiResponseText.join("\n\n");
    setComposerText(textToAdd);

    setTimeout(() => {
      if (composerRef.current) {
        composerRef.current.style.height = "200px";
        composerRef.current.scrollTop = composerRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComposerText(e.target.value);

    e.target.style.height = "auto";
    const newHeight = Math.min(e.target.scrollHeight, 300);
    e.target.style.height = `${newHeight}px`;
  };

  const handleTextSelection = () => {
    if (composerRef.current) {
      const start = composerRef.current.selectionStart;
      const end = composerRef.current.selectionEnd;
      const selected = composerRef.current.value.substring(start, end);

      if (selected.length > 0) {
        setSelectedText({
          text: selected,
          start,
          end,
        });
        setToolbarPosition({ top: 0, left: 0 });
        setShowFormatToolbar(true);
        setShowAIOptions(false);
      } else {
        setShowFormatToolbar(false);
        setShowAIOptions(false);
      }
    }
  };

  const handleAIOption = (option: string) => {
    console.log(`Applying ${option} to: ${selectedText.text}`);

    if (option === "rephrase") {
      const newText =
        composerText.substring(0, selectedText.start) +
        "I've rephrased this text" +
        composerText.substring(selectedText.end);
      setComposerText(newText);
    }

    setShowAIOptions(false);
    setShowFormatToolbar(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const toolbar = document.getElementById("format-toolbar");
    const aiOptions = document.getElementById("ai-options");

    if (
      toolbar &&
      !toolbar.contains(e.target as Node) &&
      aiOptions &&
      !aiOptions.contains(e.target as Node)
    ) {
      setShowFormatToolbar(false);
      setShowAIOptions(false);
    }
  };

  useEffect(() => {
    if (showFormatToolbar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFormatToolbar, showAIOptions]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowInboxMobile(false);
        setShowAICopilotMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <motion.div
            key="copilot"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              x: -100,
              transition: { duration: 0.5 },
            }}
            className="h-full w-full"
          >
            <AICopilot onDashboardClick={() => setShowDashboard(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.2,
              },
            }}
            className="h-full w-full flex justify-center items-center bg-gradient-to-b from-violet-200 to-violet-300 p-2 sm:p-4"
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[95vh] sm:h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.3,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 300,
                },
              }}
            >
              <div className="flex h-full relative">
                {/* Mobile navigation bar */}
                <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-200 w-full absolute top-0 left-0 z-10 bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowInboxMobile(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div className="font-medium text-sm">Luis Easton</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowAICopilotMobile(true)}
                  >
                    <Bot className="h-5 w-5 text-violet-600" />
                  </Button>
                </div>

                {/* Inbox sidebar - desktop */}
                <motion.div
                  className="hidden md:flex w-[25%] border-r border-gray-200 h-full flex-col"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: { delay: 0.4, duration: 0.5 },
                  }}
                >
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h2 className="font-semibold text-base sm:text-lg">
                        Your inbox
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 sm:h-8 w-7 sm:w-8 p-0"
                      >
                        <ChevronDown className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs sm:text-sm"
                        >
                          <span className="mr-1">5</span>Open
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs sm:text-sm"
                        >
                          <span className="mr-1">Waiting longest</span>
                          <ChevronDown className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {inboxItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedConversation === item.id ? "bg-violet-50" : ""
                        }`}
                        onClick={() => setSelectedConversation(item.id)}
                        whileHover={{
                          backgroundColor: "rgba(237, 233, 254, 0.5)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 0.4 + item.id * 0.1,
                            duration: 0.3,
                          },
                        }}
                      >
                        <div className="flex gap-2 sm:gap-3">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${item.avatarColor} flex items-center justify-center text-white flex-shrink-0`}
                          >
                            {item.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="font-medium text-xs sm:text-sm truncate">
                                  {item.name}
                                </span>
                                {item.source && (
                                  <span className="text-[10px] sm:text-xs text-gray-500">
                                    · {item.source}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {item.priority === "high" && (
                                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-400 rounded-full"></span>
                                )}
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  {item.time}
                                </span>
                              </div>
                            </div>
                            {item.subtext && (
                              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                {item.subtext}
                              </div>
                            )}
                            {item.preview && (
                              <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5 sm:mt-1">
                                {item.preview}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Inbox sidebar - mobile */}
                <AnimatePresence>
                  {showInboxMobile && (
                    <motion.div
                      className="absolute inset-0 z-50 bg-white md:hidden"
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-gray-200">
                        <h2 className="font-semibold text-base">Your inbox</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setShowInboxMobile(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              <span className="mr-1">5</span>Open
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              <span className="mr-1">Waiting longest</span>
                              <ChevronDown className="h-2.5 w-2.5" />
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-y-auto h-[calc(100%-96px)]">
                        {inboxItems.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                              selectedConversation === item.id
                                ? "bg-violet-50"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedConversation(item.id);
                              setShowInboxMobile(false);
                            }}
                          >
                            <div className="flex gap-2">
                              <div
                                className={`w-7 h-7 rounded-full ${item.avatarColor} flex items-center justify-center text-white flex-shrink-0`}
                              >
                                {item.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-xs truncate">
                                      {item.name}
                                    </span>
                                    {item.source && (
                                      <span className="text-[10px] text-gray-500">
                                        · {item.source}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {item.priority === "high" && (
                                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                    )}
                                    <span className="text-[10px] text-gray-500">
                                      {item.time}
                                    </span>
                                  </div>
                                </div>
                                {item.subtext && (
                                  <div className="text-[10px] text-gray-500 mt-0.5">
                                    {item.subtext}
                                  </div>
                                )}
                                {item.preview && (
                                  <p className="text-xs text-gray-600 truncate mt-0.5">
                                    {item.preview}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main conversation area */}
                <motion.div
                  className="w-full md:w-[40%] md:flex-1 flex flex-col h-full"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.5, duration: 0.5 },
                  }}
                >
                  {/* Conversation header - desktop */}
                  <div className="hidden md:flex p-3 sm:p-4 border-b border-gray-200 justify-between items-center">
                    <div className="font-medium text-sm sm:text-base">
                      Luis Easton
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500 cursor-pointer" />
                    </div>
                  </div>

                  {/* Conversation content */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 mt-12 md:mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.6, duration: 0.5 },
                      }}
                      className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 max-w-[80%]"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">
                          L
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          Luis
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          1min
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm">
                        I bought a product from your store in November as a
                        Christmas gift for a member of my family. However, it
                        turns out they have something very similar already. I
                        was hoping you'd be able to refund me, as it is
                        un-opened.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.7, duration: 0.5 },
                      }}
                      className="mb-3 sm:mb-4 max-w-[80%] ml-auto flex gap-1.5 sm:gap-2"
                    >
                      <div className="bg-blue-100 rounded-lg flex items-center justify-end gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <p className="text-xs sm:text-sm p-3 sm:p-4">
                          Let me just look into this for you, Luis.
                        </p>

                        <span className="text-[10px] sm:text-xs text-gray-500 pt-5 sm:pt-6 pr-1">
                          Seen · 1min
                        </span>
                      </div>

                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 flex self-end">
                        <img src="../public/avatar.jpg" alt="Agent" />
                      </Avatar>
                    </motion.div>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message input */}
                  <div className="p-3 sm:p-4 border-t border-gray-200">
                    <div className="flex justify-between gap-2 mb-1.5 sm:mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 sm:h-8 px-1.5 sm:px-2 text-gray-500 cursor-pointer text-xs sm:text-sm"
                      >
                        <MessageSquare className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1 mt-0.5 sm:mt-1" />
                        Chat
                        <ChevronDown className="h-2.5 sm:h-3 w-2.5 sm:w-3 ml-1" />
                      </Button>
                      <div className="text-[10px] sm:text-xs text-gray-500 flex items-center cursor-pointer">
                        Use ⌘K for shortcuts
                      </div>
                    </div>
                    <div className="flex gap-2 items-center relative">
                      <div className="flex-1 relative">
                        {showFormatToolbar && (
                          <div
                            id="format-toolbar"
                            className="absolute bg-white rounded-md shadow-lg border border-gray-200 z-50 flex flex-wrap sm:flex-nowrap"
                            style={{
                              top: "-56px",
                              left: "10px",
                              right: "10px",
                              maxWidth: "100%",
                            }}
                          >
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 sm:h-10 w-8 sm:w-10 rounded-none"
                                onClick={() => setShowAIOptions(!showAIOptions)}
                              >
                                <div
                                  className={`${
                                    showAIOptions
                                      ? "bg-violet-200"
                                      : "bg-violet-100"
                                  } text-violet-800 rounded-md px-1 text-xs sm:text-sm`}
                                >
                                  AI
                                </div>
                              </Button>

                              {showAIOptions && (
                                <div
                                  id="ai-options"
                                  className="absolute bottom-full left-0 mb-1 bg-white rounded-md shadow-lg border border-gray-200 w-48 sm:w-64 z-50"
                                >
                                  <div className="py-1 sm:py-2">
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm"
                                      onClick={() => handleAIOption("rephrase")}
                                    >
                                      Rephrase
                                    </button>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 bg-gray-50 text-xs sm:text-sm"
                                      onClick={() => handleAIOption("tone")}
                                    >
                                      My tone of voice
                                    </button>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm"
                                      onClick={() => handleAIOption("friendly")}
                                    >
                                      More friendly
                                    </button>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm"
                                      onClick={() => handleAIOption("formal")}
                                    >
                                      More formal
                                    </button>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm"
                                      onClick={() => handleAIOption("grammar")}
                                    >
                                      Fix grammar & spelling
                                    </button>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm"
                                      onClick={() =>
                                        handleAIOption("translate")
                                      }
                                    >
                                      Translate...
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 w-8 sm:w-10 rounded-none font-bold text-xs sm:text-sm"
                            >
                              B
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 w-8 sm:w-10 rounded-none italic text-xs sm:text-sm"
                            >
                              i
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 w-8 sm:w-10 rounded-none text-xs sm:text-sm"
                            >
                              &lt;/&gt;
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 w-8 sm:w-10 rounded-none"
                            >
                              <LinkIcon />
                            </Button>
                            <div className="border-r border-gray-200 h-8 sm:h-10"></div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 px-2 sm:px-3 rounded-none font-bold text-xs sm:text-sm"
                            >
                              H1
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 px-2 sm:px-3 rounded-none font-bold text-xs sm:text-sm"
                            >
                              H2
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 sm:h-10 w-8 sm:w-10 rounded-none"
                            >
                              <SquareIcon />
                            </Button>
                          </div>
                        )}
                        <textarea
                          ref={composerRef}
                          value={composerText}
                          onChange={handleTextChange}
                          onMouseUp={handleTextSelection}
                          onKeyUp={handleTextSelection}
                          placeholder="Type a message..."
                          className="w-full min-h-[80px] sm:min-h-[110px] max-h-[200px] sm:max-h-[300px] p-2 pb-12 sm:pb-16 border rounded-md resize-none overflow-auto text-xs sm:text-sm"
                        />
                        <div
                          className={`absolute right-2 ${
                            composerText
                              ? "bottom-2"
                              : "top-[80%] -translate-y-1/2"
                          } flex gap-1 bg-white w-[96%] mx-2 ml-2 -mb-0.5 justify-between px-2 sm:px-4`}
                        >
                          <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 sm:h-8 w-7 sm:w-8 cursor-pointer"
                            >
                              <Paperclip className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-black" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 sm:h-8 w-7 sm:w-8 cursor-pointer"
                            >
                              <Smile className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-black" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            className={`h-7 sm:h-8 px-2 sm:px-3 bg-black text-white mt-1.5 sm:mt-2 cursor-pointer text-xs sm:text-sm ${
                              composerText ? "self-end mb-1.5 sm:mb-2" : ""
                            }`}
                          >
                            Send
                            <ChevronDown className="h-2.5 sm:h-3 w-2.5 sm:w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI Copilot sidebar - desktop */}
                <motion.div
                  className="hidden md:flex w-[35%] border-l border-gray-200 h-full"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.5 },
                  }}
                >
                  <Tabs
                    defaultValue="ai-copilot"
                    className="w-full h-full flex flex-col"
                  >
                    <div className="flex items-center px-3 sm:px-4 pt-3 sm:pt-4 border-b border-gray-200 pb-1.5 sm:pb-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 mr-1.5 sm:mr-2">
                        <Bot className="h-4 sm:h-5 w-4 sm:w-5 text-violet-600" />
                        <TabsList className="bg-transparent p-0">
                          <TabsTrigger
                            value="ai-copilot"
                            className="px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none text-xs sm:text-sm"
                          >
                            AI Copilot
                          </TabsTrigger>
                          <TabsTrigger
                            value="details"
                            className="px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none text-xs sm:text-sm"
                          >
                            Details
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <div className="ml-auto">
                        <Copy className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                      </div>
                    </div>

                    <TabsContent
                      value="ai-copilot"
                      className="mt-0 p-0 flex-1 flex flex-col overflow-y-auto"
                    >
                      <div className="flex-1 p-3 sm:p-4">
                        {aiState === "idle" && (
                          <div className="flex flex-col items-center justify-center h-full">
                            <motion.div
                              className="bg-black rounded-lg p-2 sm:p-3 mb-3 sm:mb-4"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                                transition: { delay: 0.8, duration: 0.5 },
                              }}
                            >
                              <Bot className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                            </motion.div>
                            <motion.h2
                              className="text-xl sm:text-2xl font-medium text-gray-800 mb-1"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{
                                y: 0,
                                opacity: 1,
                                transition: { delay: 0.9, duration: 0.5 },
                              }}
                            >
                              Hi, I'm Fin AI Copilot
                            </motion.h2>
                            <motion.p
                              className="text-sm sm:text-base text-gray-500 text-center"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{
                                y: 0,
                                opacity: 1,
                                transition: { delay: 1, duration: 0.5 },
                              }}
                            >
                              Ask me anything about this conversation.
                            </motion.p>
                          </div>
                        )}

                        {aiState !== "idle" && (
                          <div className="space-y-3 sm:space-y-4 h-[calc(100vh-280px)] overflow-auto">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                                <img src="../public/avatar.jpg" alt="User" />
                              </Avatar>
                              <div>
                                <div className="font-medium text-xs sm:text-sm">
                                  You
                                </div>
                                <div className="text-xs sm:text-sm">
                                  How do I get a refund?
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-xs sm:text-sm">
                                  Fin
                                </div>

                                {/* Use the new AIResponse component */}
                                <AIResponse
                                  paragraphs={aiResponseText}
                                  citations={aiResponseCitations}
                                  sources={refundSources}
                                  isComplete={aiState === "complete"}
                                  currentTextIndex={currentTextIndex}
                                  currentCharIndex={currentCharIndex}
                                  onAddToComposer={handleAddToComposer}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4 border-t border-gray-200">
                        <div className="mb-1.5 sm:mb-2">
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                            onClick={handleRefundQuestion}
                          >
                            <span className="mr-1">💡</span>
                            Suggested: How do I get a refund?
                          </Badge>
                        </div>
                        <div className="relative">
                          <Input
                            placeholder="Ask a question..."
                            className="pr-10 text-xs sm:text-sm h-8 sm:h-9"
                          />
                          <Button
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 sm:h-7 w-6 sm:w-7"
                          >
                            <Send className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="details"
                      className="mt-0 p-3 sm:p-6 flex-1 overflow-y-auto"
                    >
                      <div className="h-full flex flex-col items-start">
                        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                          Conversation Details
                        </h3>
                        <div className="space-y-3 sm:space-y-4 w-full">
                          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs sm:text-sm text-gray-600">
                              No conversation details available yet.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>

                {/* AI Copilot sidebar - mobile */}
                <AnimatePresence>
                  {showAICopilotMobile && (
                    <motion.div
                      className="absolute inset-0 z-50 bg-white md:hidden"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    >
                      <Tabs
                        defaultValue="ai-copilot"
                        className="w-full h-full flex flex-col"
                      >
                        <div className="flex items-center px-3 pt-3 border-b border-gray-200 pb-1.5">
                          <div className="flex items-center gap-1.5 mr-1.5">
                            <Bot className="h-4 w-4 text-violet-600" />
                            <TabsList className="bg-transparent p-0">
                              <TabsTrigger
                                value="ai-copilot"
                                className="px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none text-xs"
                              >
                                AI Copilot
                              </TabsTrigger>
                              <TabsTrigger
                                value="details"
                                className="px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none text-xs"
                              >
                                Details
                              </TabsTrigger>
                            </TabsList>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <Copy className="h-4 w-4 text-gray-500" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowAICopilotMobile(false)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        <TabsContent
                          value="ai-copilot"
                          className="mt-0 p-0 flex-1 flex flex-col overflow-y-auto"
                        >
                          <div className="flex-1 p-3">
                            {aiState === "idle" && (
                              <div className="flex flex-col items-center justify-center h-full">
                                <div className="bg-black rounded-lg p-2 mb-3">
                                  <Bot className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-medium text-gray-800 mb-1">
                                  Hi, I'm Fin AI Copilot
                                </h2>
                                <p className="text-sm text-gray-500 text-center">
                                  Ask me anything about this conversation.
                                </p>
                              </div>
                            )}

                            {aiState !== "idle" && (
                              <div className="space-y-3 h-[calc(100vh-200px)] overflow-auto">
                                <div className="flex items-start gap-2">
                                  <Avatar className="w-7 h-7">
                                    <img
                                      src="../public/avatar.jpg"
                                      alt="User"
                                    />
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-xs">
                                      You
                                    </div>
                                    <div className="text-xs">
                                      How do I get a refund?
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-xs">
                                      Fin
                                    </div>

                                    <AIResponse
                                      paragraphs={aiResponseText}
                                      citations={aiResponseCitations}
                                      sources={refundSources}
                                      isComplete={aiState === "complete"}
                                      currentTextIndex={currentTextIndex}
                                      currentCharIndex={currentCharIndex}
                                      onAddToComposer={handleAddToComposer}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-3 border-t border-gray-200">
                            <div className="mb-1.5">
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer text-xs"
                                onClick={handleRefundQuestion}
                              >
                                <span className="mr-1">💡</span>
                                Suggested: How do I get a refund?
                              </Badge>
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Ask a question..."
                                className="pr-10 text-xs h-8"
                              />
                              <Button
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent
                          value="details"
                          className="mt-0 p-3 flex-1 overflow-y-auto"
                        >
                          <div className="h-full flex flex-col items-start">
                            <h3 className="text-base font-medium mb-3">
                              Conversation Details
                            </h3>
                            <div className="space-y-3 w-full">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600">
                                  No conversation details available yet.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
