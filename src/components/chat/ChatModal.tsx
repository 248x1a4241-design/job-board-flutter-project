import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  Briefcase,
  Clock,
  Sparkles,
  Paperclip,
} from 'lucide-react';

export const ChatModal: React.FC = () => {
  const {
    isChatModalOpen,
    setIsChatModalOpen,
    activeChatTarget,
    currentUser,
    messages,
    sendMessage,
    users,
    openChatWith,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isChatModalOpen || !currentUser) return null;

  // Determine active conversation partner
  // Default to first contact if none selected
  const otherUsers = users.filter((u) => u.id !== currentUser.id);
  const currentChatUser =
    activeChatTarget || {
      id: otherUsers[0]?.id || 'user_recruiter_1',
      name: otherUsers[0]?.name || 'Sarah Jenkins',
      role: otherUsers[0]?.role || 'recruiter',
      jobTitle: 'Senior Flutter & Dart Mobile Engineer',
    };

  // Filter messages between currentUser and currentChatUser
  const conversationMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === currentChatUser.id) ||
      (m.senderId === currentChatUser.id && m.receiverId === currentUser.id)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      currentChatUser.id,
      currentChatUser.name,
      inputText,
      currentChatUser.jobId,
      currentChatUser.jobTitle
    );
    setInputText('');
  };

  const sendQuickReply = (text: string) => {
    sendMessage(
      currentChatUser.id,
      currentChatUser.name,
      text,
      currentChatUser.jobId,
      currentChatUser.jobTitle
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full h-[620px] max-h-[92vh] flex shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Conversations List */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hidden sm:flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Direct Messages</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {otherUsers.map((user) => {
              const isActive = user.id === currentChatUser.id;
              const lastMsg = [...messages]
                .reverse()
                .find(
                  (m) =>
                    (m.senderId === user.id && m.receiverId === currentUser.id) ||
                    (m.senderId === currentUser.id && m.receiverId === user.id)
                );

              return (
                <div
                  key={user.id}
                  onClick={() =>
                    openChatWith({
                      id: user.id,
                      name: user.name,
                      role: user.role,
                      jobTitle: currentChatUser.jobTitle,
                    })
                  }
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden flex-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 capitalize font-medium">
                      {user.role.replace('_', ' ')}
                    </p>
                    {lastMsg && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {lastMsg.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {currentChatUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentChatUser.name}
                </h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • {currentChatUser.role?.replace('_', ' ') || 'Recruiter'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatModalOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Job Context Banner */}
          {currentChatUser.jobTitle && (
            <div className="px-4 py-2 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Discussing: <strong>{currentChatUser.jobTitle}</strong></span>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conversationMessages.length > 0 ? (
              conversationMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  No messages yet with {currentChatUser.name}
                </p>
                <p className="text-[11px] mt-1">
                  Send a message or pick a quick suggestion below to begin!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium">Quick:</span>
            {currentUser.role === 'job_seeker' ? (
              <>
                <button
                  onClick={() => sendQuickReply('Hi, is this position open to remote candidates?')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 shrink-0 transition"
                >
                  Remote options?
                </button>
                <button
                  onClick={() => sendQuickReply('Thank you! I am available for an interview on Tuesday or Wednesday.')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 shrink-0 transition"
                >
                  Interview availability
                </button>
                <button
                  onClick={() => sendQuickReply('Here is my updated portfolio and GitHub profile link!')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 shrink-0 transition"
                >
                  Share portfolio
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => sendQuickReply('We loved your background and would like to arrange an introductory chat!')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 shrink-0 transition"
                >
                  Schedule intro call
                </button>
                <button
                  onClick={() => sendQuickReply('Could you share your GitHub or any Flutter sample code repos?')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 shrink-0 transition"
                >
                  Request code samples
                </button>
              </>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
