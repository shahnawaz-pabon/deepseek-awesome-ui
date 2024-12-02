'use client'

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Send } from "lucide-react";

export default function ChatUI() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I assist you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            const botReply = { id: Date.now() + 1, text: "This is a bot response.", sender: "bot" };
            setMessages((prev) => [...prev, botReply]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg shadow-lg">
            <ScrollArea>
                {messages.map((msg) => (
                    <Card key={msg.id} className={`w-fit ${msg.sender === "user" ? "ml-auto bg-blue-500 text-white" : "bg-gray-100 text-black"}`}>
                        <CardContent>{msg.text}</CardContent>
                    </Card>
                ))}
            </ScrollArea>
            <div className="flex items-center p-4 border-t">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 mr-2"
                    onKeyUp={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
