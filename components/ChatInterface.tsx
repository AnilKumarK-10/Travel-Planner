import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Navigation } from 'lucide-react';
import { ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { GroundingSources } from './GroundingSources';
import { Chat, GenerateContentResponse } from '@google/genai';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your travel assistant. I can help you find places, check the weather, or discover new destinations. Where would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationCoordinates | undefined>();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          setHasLocationPermission(true);
        },
        (error) => {
          console.error("Location error:", error);
          setHasLocationPermission(false);
        }
      );
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = createChatSession(location);
      }

      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = "";
      let groundingChunks: any[] = [];
      
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isThinking: true
      }]);

      for await (const chunk of result) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
             fullText += c.text;
         }
         if (c.candidates && c.candidates[0].groundingMetadata?.groundingChunks) {
            groundingChunks = [...groundingChunks, ...c.candidates[0].groundingMetadata.groundingChunks];
         }
         
         setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId 
              ? { ...msg, text: fullText, isThinking: false, groundingChunks: groundingChunks.length ? groundingChunks : undefined }
              : msg
         ));
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-5 shadow-sm transition-colors ${
                msg.role === 'user'
                  ? 'bg-sky-600 dark:bg-sky-700 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</p>
              ) : (
                <>
                    <MarkdownRenderer content={msg.text} />
                    {msg.isThinking && msg.text === '' && (
                        <div className="flex items-center space-x-2 text-slate-400 mt-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs font-medium">Thinking...</span>
                        </div>
                    )}
                    <GroundingSources chunks={msg.groundingChunks} />
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex gap-2 relative">
             {!hasLocationPermission && !location && (
                <button
                    onClick={requestLocation}
                    className="absolute -top-12 left-0 bg-slate-800 dark:bg-slate-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-md flex items-center hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"
                >
                    <Navigation size={12} className="mr-1.5" />
                    Enable location context
                </button>
            )}

            <div className="relative flex-1">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                    placeholder="Ask about a destination..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    disabled={isLoading}
                />
                <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;