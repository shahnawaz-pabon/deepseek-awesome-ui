'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Send, Paperclip, Menu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Hello! How can I assist you today?', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatWidth, setChatWidth] = useState(800);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        setTimeout(() => {
            const botReply = { id: Date.now() + 1, text: 'This is a bot response.', sender: 'bot' };
            setMessages((prev) => [...prev, botReply]);
        }, 1000);
    };

    return (
        <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="w-64 bg-gray-900 p-4 border-r border-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
                    <p className="text-gray-400">Additional features here...</p>
                </div>
            )}

            <div className="flex-1 flex flex-col items-center">
                {/* Header */}
                <div className="w-full max-w-[1200px] flex justify-between items-center px-6 py-4 text-xl font-semibold bg-gray-900 border-b border-gray-800">
                    <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 bg-gray-800 hover:bg-gray-700 px-2 py-2 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </Button>
                    DeepSeek AI
                    <input
                        type="range"
                        min="600"
                        max="1200"
                        value={chatWidth}
                        onChange={(e) => setChatWidth(Number(e.target.value))}
                        className="w-32"
                    />
                </div>

                {/* Chat Window */}
                <div className="flex flex-col h-full max-w-[1200px]" style={{ width: chatWidth }}>
                    <ScrollArea className="flex-1 p-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-3 rounded-lg ${msg.sender === 'user' ?
                                        'bg-gradient-to-r from-blue-600 to-purple-600 text-white' :
                                        'bg-gray-800 text-white'
                                        } shadow-md transition-all duration-200 hover:shadow-lg`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
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
                        <Button
                            className="mr-3 bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                            onClick={() => alert('Attachment feature coming soon!')}
                        >
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button
                            onClick={sendMessage}
                            className="ml-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
