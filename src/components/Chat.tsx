'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Send, Paperclip, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from "@/utils/api";
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
    id: any;
    content: string;
    role: 'user' | 'bot';
}

export default function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [model, setModel] = useState<string>("deepseek-r1:8b"); // Default model
    const [codeCopyButtonText, setCodeCopyButtonText] = useState<string>("Copy");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input && !file) return;
        setLoading(true);

        try {
            setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: input }]);
            setInput("");
            setFile(null);

            const responseStream = await sendMessage(input, file, model);
            if (!responseStream) throw new Error("No response stream");

            const reader = responseStream.getReader();
            const decoder = new TextDecoder();

            setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", content: "" }]);

            let botResponse = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                try {
                    const jsonChunks = chunk.split("\n").filter((c) => c.trim() !== "");
                    jsonChunks.forEach((jsonStr) => {
                        const parsed = JSON.parse(jsonStr);
                        if (parsed.response) {
                            botResponse += parsed.response;
                            setMessages((prev) => {
                                const updatedMessages = [...prev];
                                updatedMessages[updatedMessages.length - 1].content = botResponse;
                                return updatedMessages;
                            });
                        }
                    });
                } catch (e) {
                    console.error("Error parsing response:", e);
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { id: Date.now(), role: "bot", content: "Change the API URL in the utils/api.tsx file to see your model's response." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex h-screen w-full bg-gray-950 text-white overflow-hidden transition-all duration-300 ${sidebarOpen ? '' : 'pl-0'}`}>
            {/* Sidebar */}
            <div className={`bg-gray-900 border-r border-gray-800 h-screen transition-all duration-300 ${sidebarOpen ? 'w-40 p-4' : 'w-0 overflow-hidden'}`}>
                {sidebarOpen && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
                        <p className="text-gray-400">Additional features here...</p>
                    </>
                )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col items-center bg-gray-900">
                {/* Header */}
                <div className="w-full flex justify-start items-center px-6 py-4 text-xl font-semibold bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                    <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 bg-gray-800 hover:bg-gray-700 px-2 py-2 rounded-lg">
                        {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                    </Button>
                    <div className="flex-grow text-center">Awesome Chat UI with AI</div>
                </div>

                {/* Chat Window */}
                <div className="flex flex-col h-full w-full max-w-4xl px-4 overflow-auto">
                    <ScrollArea>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                                <div className={`max-w-[75%] px-4 py-3 rounded-lg shadow-md transition-all duration-200 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'} text-white`}>
                                    <ReactMarkdown
                                        components={{
                                            code(props) {
                                                const { children, className, node, ...rest } = props;
                                                const match = /language-(\w+)/.exec(className || '');
                                                const codeText = String(children).trim();
                                                const language = match ? match[1] : 'plaintext';

                                                return match ? (
                                                    <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md">
                                                        {/* Language Label */}
                                                        <div className="flex justify-between items-center px-4 py-2 bg-gray-400 text-gray-800 text-xs font-semibold rounded-t-xl">
                                                            <span>{language.toUpperCase()}</span>
                                                            {/* Copy Button */}
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(codeText);
                                                                    setCodeCopyButtonText("Copied!");
                                                                    setTimeout(() => {
                                                                        setCodeCopyButtonText("Copy");
                                                                    }, 2000);
                                                                }}
                                                                className="text-gray-800 hover:text-white transition"
                                                            >
                                                                {codeCopyButtonText}
                                                            </button>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            {...rest}
                                                            style={vscDarkPlus}
                                                            showLineNumbers={true}
                                                            customStyle={{ background: 'none' }}
                                                            language={language}
                                                            PreTag="div"
                                                        >
                                                            {codeText}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code {...rest} className={className}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="flex items-center p-4 bg-gray-900 border-t border-gray-800">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 h-16 rounded-lg bg-gray-800 border-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            onKeyUp={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        />

                        <div className="flex gap-2 mr-200">
                            <Button className="bg-gray-700 text-gray-400 hover:bg-gray-600 p-2 rounded-lg">
                                <Paperclip className="w-3 h-3" />
                            </Button>
                            <Button onClick={handleSend} className="relative mr-200 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg">
                                <Send className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
