"use client";

import { useState, useRef, useEffect } from "react";
import { useSensorData } from "@/contexts/SensorDataContext";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya asisten virtual Fish Monitor. Saya dapat membantu menjawab pertanyaan tentang monitoring kesegaran ikan dan data sensor. Ada yang bisa saya bantu?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const chatPanelRef = useRef(null);
  const { data } = useSensorData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Replace with actual API call to your chatbot backend
    // For now, this is a placeholder response
    setTimeout(() => {
      const botResponse = {
        role: "assistant",
        content: `Terima kasih atas pertanyaan Anda. Ini adalah contoh respons. Nanti ini akan terhubung dengan AI chatbot yang dapat menjawab pertanyaan tentang:\n\n• Data sensor real-time (NH3: ${data.gasAmonia}, CH4: ${data.gasMetana}, Suhu: ${data.suhu}°C)\n• Klasifikasi kesegaran: ${data.fresh}\n• Kondisi penyimpanan: ${data.preservation}\n• Informasi umum tentang monitoring ikan\n\nSilakan implementasikan API endpoint untuk chatbot.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header-drag')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Get viewport dimensions
      const maxX = window.innerWidth - (chatPanelRef.current?.offsetWidth || 420);
      const maxY = window.innerHeight - (chatPanelRef.current?.offsetHeight || 450);

      // Constrain position within viewport
      setPosition({
        x: Math.max(-maxX, Math.min(0, newX)),
        y: Math.max(-maxY, Math.min(0, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.chat-header-drag')) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      const maxX = window.innerWidth - (chatPanelRef.current?.offsetWidth || 420);
      const maxY = window.innerHeight - (chatPanelRef.current?.offsetHeight || 450);

      setPosition({
        x: Math.max(-maxX, Math.min(0, newX)),
        y: Math.max(-maxY, Math.min(0, newY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart, position]);

  return (
    <>
      {/* Floating Chat Button - Fish Mascot */}
      <div
        className={`fixed z-50 transition-all duration-500 ${
          isOpen
            ? "bottom-[calc(100vh-140px)] sm:bottom-[580px] right-4 sm:right-6"
            : "bottom-4 sm:bottom-6 right-4 sm:right-6"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative transition-all duration-300 ${
            isOpen ? "scale-90" : "scale-100 hover:scale-110"
          } w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 hover:from-blue-600 hover:via-cyan-500 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center group overflow-visible`}
          aria-label="Toggle chatbot"
        >
          {/* Bubbles effect */}
          {!isOpen && (
            <div className="absolute inset-0 overflow-visible pointer-events-none">
              <div className="bubble absolute bottom-12 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="bubble absolute bottom-10 left-8 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              <div className="bubble absolute bottom-11 left-6 w-1 h-1 bg-white/30 rounded-full"></div>
            </div>
          )}

          {isOpen ? (
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-9 h-9 sm:w-11 sm:h-11 text-white fish-swim group-hover:fish-bounce"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Fish body */}
              <path
                d="M18 12c0-2.5-2-4.5-4.5-4.5-1.5 0-2.8.7-3.5 1.8C9.2 8.2 8 7.5 6.5 7.5 4 7.5 2 9.5 2 12s2 4.5 4.5 4.5c1.5 0 2.7-.7 3.5-1.8.7 1.1 2 1.8 3.5 1.8 2.5 0 4.5-2 4.5-4.5z"
              />
              {/* Fish tail */}
              <path
                d="M2 12c-.5-1-.5-2 0-3L0 8l.5 4L0 16l2-1c-.5-1-.5-2 0-3z"
              />
              {/* Fish eye */}
              <circle cx="12" cy="11" r="1" fill="#1e40af" />
              {/* Fish fins */}
              <path
                d="M10 14c-.5.5-1 .8-1.5.8M10 10c-.5-.5-1-.8-1.5-.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Top fin */}
              <path
                d="M13.5 8.5l.5-2 .5 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Pulse ring effect */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      <div
        ref={chatPanelRef}
        className={`fixed z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          bottom: `${24 - position.y}px`,
          right: `${24 - position.x}px`,
          width: 'calc(100vw - 32px)',
          maxWidth: '420px',
          height: 'calc(100vh - 100px)',
          maxHeight: '550px',
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full">
          {/* Header - Draggable */}
          <div
            className="chat-header-drag bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 cursor-move select-none touch-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-xs sm:text-sm truncate">Fish Monitor Assistant</h3>
              <p className="text-white/80 text-[10px] sm:text-xs truncate">Tanya saya tentang monitoring ikan</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => setPosition({ x: 0, y: 0 })}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                title="Reset posisi"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                title="Tutup chat"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-[10px] sm:text-xs mt-1 ${
                      msg.role === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pertanyaan..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
