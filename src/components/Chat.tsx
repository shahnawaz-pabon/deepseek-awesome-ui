'use client'

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
}

export default function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        setTimeout(() => {
            const botReply = { id: Date.now() + 1, text: "This is a bot response.", sender: "bot" };
            setMessages((prev) => [...prev, botReply]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-950 text-white shadow-2xl rounded-lg border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 text-xl font-semibold text-center bg-gray-900 border-b border-gray-800">
                DeepSeek AI
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-3 rounded-lg ${msg.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-white"
                                } shadow-md transition-all duration-200 hover:shadow-lg`}
                        >
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Chat Input */}
            <div className="flex items-center p-4 bg-gray-900 border-t border-gray-800">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyUp={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                    onClick={sendMessage}
                    className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}