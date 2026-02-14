
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl p-3 shadow-sm relative ${
          isBot
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-[#40a7e3] text-white rounded-tr-none'
        }`}
      >
        {message.type === 'image' && message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="Uploaded"
            className="rounded-lg mb-2 max-w-full h-auto border border-gray-100"
          />
        )}
        
        {message.type === 'voice' && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-black/10 rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">
              <span className="text-sm">▶️</span>
            </div>
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-white"></div>
            </div>
            <span className="text-xs">0:04</span>
          </div>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        <div className={`text-[10px] mt-1 text-right ${isBot ? 'text-gray-400' : 'text-blue-100'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {!isBot && <span className="ml-1">✓✓</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
