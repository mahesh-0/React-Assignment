"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AICopilotProps {
  onDashboardClick?: () => void;
}

export function AICopilot({ onDashboardClick }: AICopilotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-6 sm:p-10 md:p-20">
        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 mb-4 sm:mb-6">
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-violet-400 mr-1.5 sm:mr-2"></div>
          <span className="text-white text-sm sm:text-base font-medium">
            For Agents
          </span>
        </div>
        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-serif">
          AI Copilot
        </h1>
        <motion.button
          className="absolute bottom-1/4 sm:bottom-1/3 left-1/2 sm:left-1/4 -translate-x-1/2 sm:-translate-x-0 flex items-center justify-center gap-2 py-1 px-4 sm:px-6  
                   bg-opacity-95 text-violet-700 font-medium rounded-lg
                  shadow-lg overflow-hidden z-10"
          initial={{ scale: 1 }}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.3 },
          }}
          animate={{
            scale: isPulsing ? 1.05 : 1,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 10,
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onDashboardClick}
        >
          {/* Gradient border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-90 z-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,1) 0%, rgba(168,85,247,0.8) 50%, rgba(139,92,246,1) 100%)",
              padding: "2px",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Button inner content */}
          <motion.div className="relative z-10 text-black flex items-center justify-center gap-2 w-full h-full rounded-md px-3 sm:px-4 py-1 cursor-pointer">
            <span className="text-sm sm:text-base">Go to Dashboard</span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
              animate={{
                x: isHovered ? 4 : 0,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 8,
              }}
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>

          {/* Subtle glow effect */}
          <motion.div
            className="absolute inset-0 bg-violet-500 rounded-lg z-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.button>
      </div>

      <div className="w-full md:w-1/2 bg-gradient-to-b from-violet-200 to-violet-300 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <Tabs defaultValue="ai-copilot" className="w-full">
            <div className="flex items-center px-3 sm:px-4 pt-3 sm:pt-4">
              <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2">
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

            <div className="border-b border-gray-200"></div>

            <TabsContent value="ai-copilot" className="mt-0 p-0">
              <div className="h-[300px] sm:h-[400px] md:h-[500px] flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="bg-black rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <Bot className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-1">
                  Hi, I'm Fin AI Copilot
                </h2>
                <p className="text-sm sm:text-base text-gray-500 text-center">
                  Ask me anything about this conversation.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 p-4 sm:p-6">
              <div className="h-[300px] sm:h-[400px] md:h-[500px] flex flex-col items-start">
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
        </div>
      </div>
    </div>
  );
}
