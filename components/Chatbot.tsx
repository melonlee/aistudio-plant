import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat, GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import Spinner from './Spinner';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from './IconComponents';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("API_KEY not found");
            return;
        }
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are 'Flora', a friendly and knowledgeable gardening assistant. Your goal is to help users with their gardening questions. Provide clear, concise, and encouraging advice. If you don't know an answer, say so honestly. Keep your responses focused on gardening topics. Format your answers with markdown for readability.",
            },
        });

        // Add initial bot message
        setMessages([{
            id: 'init',
            role: 'model',
            text: "Hello! I'm Flora, your AI gardening assistant. Ask me anything about plants, soil, or gardening techniques!"
        }]);
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: input });
      const botMessage: ChatMessage = {
        id: Date.now().toString() + '-bot',
        role: 'model',
        text: result.text,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col" style={{maxHeight: '85vh'}}>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <SparklesIcon className="h-8 w-8 text-green-500 bg-green-100 p-1.5 rounded-full flex-shrink-0" />}
            <div className={`px-4 py-2 rounded-2xl max-w-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              {msg.text}
            </div>
             {msg.role === 'user' && <UserCircleIcon className="h-8 w-8 text-blue-500 bg-blue-100 p-1 rounded-full flex-shrink-0" />}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <SparklesIcon className="h-8 w-8 text-green-500 bg-green-100 p-1.5 rounded-full flex-shrink-0" />
                <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none flex items-center">
                    <Spinner className="text-green-600" /> <span className="ml-2">Flora is thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center border-t pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about gardening..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <button type="submit" className="bg-green-600 text-white p-3 rounded-r-lg hover:bg-green-700 disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;