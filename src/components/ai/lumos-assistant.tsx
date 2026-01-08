/**
 * Lumos AI Assistant - REAL Gemini Pro Integration
 * Placement-focused AI chatbot with context awareness
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
}

export function LumosAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: "Hi! I'm Lumos, your AI placement assistant! 🎯\n\nI can help you with:\n• Interview prep & company tips\n• Resume optimization\n• Eligibility criteria\n• Technical & HR guidance\n• Career advice\n\nWhat would you like to know?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

    const toggle = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input
        };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            let reply = "";

            if (!API_KEY) {
                reply = getSmartFallbackResponse(userMsg.content);
            } else {
                const genAI = new GoogleGenerativeAI(API_KEY);

                // Try multiple models in order of preference - optimized for speed
                // Use fastest models first for better response time
                const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro"];
                let success = false;

                for (const modelName of modelsToTry) {
                    if (success) break;
                    try {
                        const model = genAI.getGenerativeModel({
                            model: modelName,
                            generationConfig: {
                                maxOutputTokens: 500, // Allow more detailed responses
                                temperature: 0.8, // More creative and helpful
                            }
                        });
                        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');

                        const prompt = `You are Lumos, an expert AI placement assistant for college students in India. You're friendly, knowledgeable, and focused on helping students succeed in campus placements.

**Student Context:**
- Name: ${user.name || "Student"}
- Year: ${user.academicYear || "Final Year"}
- Branch: ${user.branch || "Engineering"}
- CGPA: ${user.cgpa || "N/A"}

**Your Expertise:**
- Campus placement strategies and preparation
- Company-specific interview tips (TCS, Infosys, Wipro, Google, Microsoft, Amazon, etc.)
- Resume optimization and ATS best practices
- Technical interview prep (DSA, System Design, Projects)
- HR interview guidance and behavioral questions
- Eligibility criteria interpretation
- Career path recommendations

**Question:** "${userMsg.content}"

**Instructions:**
1. Provide actionable, specific advice (3-5 sentences)
2. Include examples or step-by-step guidance when helpful
3. Use bullet points for lists
4. Mention relevant companies or resources
5. Be encouraging and motivational
6. If asked about eligibility, explain criteria clearly
7. For interview prep, give sample questions or topics

Respond in a friendly, professional tone:`;

                        const result = await model.generateContent(prompt);
                        reply = result.response.text();
                        success = true;
                    } catch (modelError) {
                        console.log(`Model ${modelName} failed, trying next...`);
                    }
                }

                if (!success) {
                    reply = getSmartFallbackResponse(userMsg.content);
                }
            }

            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: "bot" as const,
                content: reply
            };
            setMessages(prev => [...prev, botMsg]);

            // Generate dynamic suggestions based on response
            generateDynamicSuggestions(userMsg.content, reply);
        } catch (error) {
            console.error("AI Error:", error);
            // Use smart fallback instead of error message
            const fallbackReply = getSmartFallbackResponse(userMsg.content);
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    content: fallbackReply
                }
            ]);

            // Generate dynamic suggestions for fallback too
            generateDynamicSuggestions(userMsg.content, fallbackReply);
        } finally {
            setIsLoading(false);
        }
    };

    const generateDynamicSuggestions = (userQuery: string, aiResponse: string) => {
        const query = userQuery.toLowerCase();
        const response = aiResponse.toLowerCase();

        let suggestions: string[] = [];

        // Context-aware suggestions based on topic
        if (query.includes('eligible') || response.includes('eligib')) {
            suggestions = [
                "What documents do I need?",
                "Can I apply with backlogs?",
                "How to improve my CGPA?",
                "When do applications open?"
            ];
        } else if (query.includes('interview') || response.includes('interview')) {
            suggestions = [
                "Sample interview questions?",
                "How to answer 'Tell me about yourself'?",
                "Mock interview tips",
                "What to wear for interview?"
            ];
        } else if (query.includes('resume') || response.includes('resume')) {
            suggestions = [
                "Resume format for freshers",
                "How to add projects?",
                "ATS-friendly resume tips",
                "Should I include GPA?"
            ];
        } else if (query.includes('google') || query.includes('microsoft') || query.includes('amazon')) {
            suggestions = [
                "Coding round difficulty level?",
                "System design topics to study",
                "Company culture and work-life",
                "Salary negotiation tips"
            ];
        } else if (query.includes('dsa') || query.includes('coding') || response.includes('algorithm')) {
            suggestions = [
                "Best DSA practice platforms?",
                "Important topics for interviews",
                "How many problems to solve?",
                "Time complexity tips"
            ];
        } else if (query.includes('hr') || response.includes('behavioral')) {
            suggestions = [
                "Common HR questions",
                "Strengths and weaknesses answer",
                "Why should we hire you?",
                "Questions to ask interviewer"
            ];
        } else {
            // Default contextual suggestions
            suggestions = [
                "Tell me about placement timeline",
                "How to prepare in final year?",
                "Top companies visiting campus",
                "Internship vs full-time prep"
            ];
        }

        setDynamicSuggestions(suggestions);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        setShowSuggestions(false);
    };

    const suggestions = [
        "Am I eligible for this drive?",
        "How to prepare for Google interview?",
        "Tips to improve my resume",
        "Common HR interview questions",
        "Best DSA topics for placements",
        "How to handle coding rounds?"
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Button
                            className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            onClick={toggle}
                        >
                            <Bot className="h-8 w-8 text-white" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg shadow-sm">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">Lumos AI</h3>
                                    <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
                                        {API_KEY ? "Gemini Pro Powered" : "Smart Assistant"}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggle}
                                className="h-8 w-8 rounded-full hover:bg-white/10 text-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
                            {messages.map(m => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        <span className="text-xs text-gray-600 dark:text-gray-300">
                                            Thinking...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Suggestion Chips - Show after messages > 1 */}
                            {showSuggestions && messages.length > 1 && dynamicSuggestions.length > 0 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">💡 You might also want to ask:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {dynamicSuggestions.slice(0, 4).map((s, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSuggestionClick(s)}
                                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all border border-blue-200 dark:border-blue-800 shadow-sm"
                                            >
                                                {s}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Initial Welcome Suggestions - Only on first message */}
                            {showSuggestions && messages.length === 1 && !isLoading && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">I can help you with:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSuggestionClick(s)}
                                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                            <Input
                                placeholder="Ask about placements..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                className="flex-1 bg-gray-100 dark:bg-slate-800 focus-visible:ring-1 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="shadow-md bg-blue-600 hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Smart fallback responses when API key is not available
function getSmartFallbackResponse(query: string): string {
    const q = query.toLowerCase();

    // Eligibility questions
    if (q.includes("eligible") || q.includes("eligibility")) {
        return "Eligibility typically depends on three factors:\n1. CGPA (usually 7.0+)\n2. Branch (some companies prefer CSE/IT)\n3. Active backlogs (most require 0)\n\nCheck each drive's specific requirements in the Opportunities section!";
    }

    // Interview/preparation
    if (q.includes("interview") || q.includes("prepare") || q.includes("tips")) {
        return "For technical interviews:\n1. Master DSA fundamentals (Arrays, Trees, DP)\n2. Practice on LeetCode/GeeksforGeeks\n3. Do mock interviews\n4. Review company-specific patterns\n\nFor HR rounds: prepare your story, know the company, and ask good questions!";
    }

    // Company-specific
    if (q.includes("google") || q.includes("amazon") || q.includes("microsoft")) {
        const company = q.includes("google") ? "Google" : q.includes("amazon") ? "Amazon" : "Microsoft";
        return `${company} typically asks:\n- Advanced DSA (Graphs, DP, Trees)\n- System design (for experienced roles)\n- Behavioral questions\n\nFocus on LeetCode medium/hard problems and review their interview process online!`;
    }

    // Resume
    if (q.includes("resume") || q.includes("cv")) {
        return "Resume tips:\n1. Keep it 1 page for freshers\n2. Highlight projects with impact metrics\n3. List relevant technologies\n4. Include coding profiles (GitHub, LeetCode)\n5. Quantify achievements\n\nUse ATS-friendly format!";
    }

    // Placement stats/trends
    if (q.includes("trend") || q.includes("stat") || q.includes("placement")) {
        return "Current placement trends:\n- Service companies: 3-7 LPA\n- Product companies: 8-15 LPA\n- Top tech: 15-30 LPA\n\nMost hiring happens Aug-Dec. Start preparing 6 months early for best results!";
    }

    // Default helpful response
    return "I can help you with:\n• Eligibility criteria\n• Interview preparation tips\n• Company-specific guidance\n• Resume advice\n• Placement trends\n\nWhat would you like to know more about?";
}
