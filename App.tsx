
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, BotStatus } from './types';
import { GeminiService } from './services/geminiService';
import ChatBubble from './components/ChatBubble';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus>(BotStatus.ONLINE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [token] = useState('8209865009:AAH4HiMkDyjUnCEJ2u8ynwXbuDg8Csku2Lw');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStart = useCallback(() => {
    const startMsg: Message = {
      id: Date.now().toString(),
      role: 'bot',
      content: 'Hi আমি GM AI BOT আমাকে তৈরি করেছে @JAHIDVAI12',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([startMsg]);
  }, []);

  useEffect(() => {
    handleStart();
  }, [handleStart]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: selectedImage ? 'image' : 'text',
      mediaUrl: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    const currentImg = selectedImage;
    setSelectedImage(null);
    setIsTyping(true);

    // Call Gemini
    const botResponse = await gemini.processInput(inputValue || "What is in this image?", currentImg || undefined);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: botResponse,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-4 border-b bg-[#2481cc] text-white">
          <h1 className="text-xl font-bold">GM AI Controller</h1>
          <p className="text-xs opacity-80">Telegram Bot Management</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bot Identity</h2>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">GM</div>
                <div>
                  <p className="text-sm font-medium">GM AI BOT</p>
                  <p className="text-xs text-blue-500">@jahid_gm_bot</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status & Connectivity</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${botStatus === BotStatus.ONLINE ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">{botStatus}</span>
            </div>
            <div className="text-xs text-gray-500 break-all bg-gray-100 p-2 rounded">
              <span className="font-bold">Token:</span> {token.substring(0, 10)}...
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Owner</h2>
            <a href="https://t.me/JAHIDVAI12" target="_blank" className="text-sm text-blue-600 hover:underline">@JAHIDVAI12</a>
          </section>

          <section className="mt-auto">
            <button 
              onClick={() => setMessages([])}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Simulation
            </button>
          </section>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative telegram-bg">
        {/* Header */}
        <div className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center px-6 justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">GM</div>
            <div>
              <h2 className="text-sm font-bold">GM AI BOT</h2>
              <p className="text-xs text-green-500">bot is running</p>
            </div>
          </div>
          <div className="flex gap-4 text-gray-500">
            <button className="hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <button className="hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 md:px-20 lg:px-40 xl:px-60">
          <div className="flex flex-col">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white rounded-2xl p-3 shadow-sm rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:px-20 lg:px-40 xl:px-60 bg-transparent z-10">
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border-2 border-blue-400 shadow-lg" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}
          <form 
            onSubmit={handleSendMessage}
            className="bg-white rounded-2xl shadow-lg flex items-end p-2 border border-gray-100"
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            </button>
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm max-h-32 resize-none py-2 px-1"
              rows={1}
            />
            <div className="flex gap-1">
              <button 
                type="button"
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </button>
              <button 
                type="submit"
                className={`p-2 rounded-full transition-all ${
                  (inputValue.trim() || selectedImage) 
                    ? 'bg-[#2481cc] text-white' 
                    : 'text-gray-400 hover:text-blue-500'
                }`}
              >
                {(inputValue.trim() || selectedImage) ? (
                  <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                )}
              </button>
            </div>
          </form>
          <p className="text-[10px] text-white/60 text-center mt-2 font-medium drop-shadow-sm">
            Powered by Gemini 3 Flash Simulation for @JAHIDVAI12
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
