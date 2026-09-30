import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, ArrowRight } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { requests, messages, sendMessage, currentRole, setActiveTab, setSelectedRequestId, t } = useApp();
  const [selectedReqId, setSelectedReqId] = useState<string>(
    requests.length > 0 ? requests[0].id : ''
  );
  const [chatInput, setChatInput] = useState('');

  const activeRequest = requests.find((r) => r.id === selectedReqId);
  const activeMessages = messages.filter((m) => m.requestId === selectedReqId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedReqId) return;
    sendMessage(selectedReqId, chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
            {t('intermediaryCommunications')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            {t('sourcingMessages')}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {t('messagesSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Requests Channels */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-1">
            {t('requestThreads')} ({requests.length})
          </h3>

          <div className="space-y-2">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReqId(req.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedReqId === req.id
                    ? 'bg-white border-[#063B73] shadow-md ring-1 ring-[#063B73]'
                    : 'bg-white border-[#E5EAF0] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-[#063B73]">{req.id}</span>
                  <span className="text-[10px] text-slate-400">{req.category}</span>
                </div>
                <h4 className="text-xs font-bold text-[#102A43] line-clamp-1">{req.title}</h4>
                <div className="text-[11px] text-slate-500 mt-1">
                  {t('status')}: <span className="font-semibold text-[#0B8F73]">{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="lg:col-span-8">
          {activeRequest ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF0] p-6 space-y-4 shadow-xs flex flex-col h-[600px]">
              {/* Thread Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
                <div>
                  <span className="text-xs font-mono font-bold text-[#063B73]">{activeRequest.id}</span>
                  <h3 className="text-base font-bold text-[#102A43]">{activeRequest.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedRequestId(activeRequest.id);
                    setActiveTab(currentRole === 'broker' ? 'broker-workspace' : 'requests');
                  }}
                  className="text-xs font-semibold text-[#063B73] hover:underline flex items-center gap-1"
                >
                  <span>{t('viewFullFile')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {activeMessages.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 text-xs">
                    {t('noMessagesYetThread')}
                  </div>
                ) : (
                  activeMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl text-xs max-w-md ${
                        msg.senderRole === 'broker'
                          ? 'bg-[#F7F9FC] border border-[#E5EAF0] text-[#102A43] mr-auto'
                          : 'bg-[#063B73] text-white ml-auto'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 gap-4">
                        <span className="font-bold">{msg.senderName}</span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="pt-3 border-t border-[#E5EAF0] flex gap-2">
                <input
                  type="text"
                  placeholder={t('chatPlaceholder')}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('send')}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-[#E5EAF0] text-center text-slate-500">
              {t('selectConversationThread')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
