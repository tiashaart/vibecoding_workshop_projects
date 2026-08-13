"use client";

import React, { useState } from 'react';
import { useDb } from '../../hooks/useDb';
import { Announcement, ForumThread } from '../../types';

export default function CommunicationPage() {
  const {
    isLoaded,
    currentUserRole,
    announcements,
    threads,
    addAnnouncement,
    deleteAnnouncement,
    addThread,
    addMessageToThread,
    deleteThread
  } = useDb();

  const [activeTab, setActiveTab] = useState<'announcements' | 'forum'>('announcements');

  // Announcement States
  const [isAnnounceFormOpen, setIsAnnounceFormOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Forum States
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isThreadFormOpen, setIsThreadFormOpen] = useState(false);
  
  // New Thread States
  const [threadTitle, setThreadTitle] = useState('');
  const [threadCategory, setThreadCategory] = useState('General');
  const [threadMessage, setThreadMessage] = useState('');

  // Reply State
  const [replyContent, setReplyContent] = useState('');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle posting announcement
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) {
      alert('Please fill out all fields');
      return;
    }
    addAnnouncement({
      title: annTitle,
      content: annContent,
      author: currentUserRole === 'Lecturer' ? 'Dr. Evelyn Carter' : 'Alice Johnson'
    });
    setIsAnnounceFormOpen(false);
    setAnnTitle('');
    setAnnContent('');
  };

  // Handle starting thread
  const handleStartThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle || !threadMessage) {
      alert('Please fill out all fields');
      return;
    }

    const authorName = currentUserRole === 'Lecturer' ? 'Dr. Evelyn Carter' : 'Alice Johnson';
    addThread(threadTitle, threadCategory, authorName, threadMessage, currentUserRole);
    
    setIsThreadFormOpen(false);
    setThreadTitle('');
    setThreadCategory('General');
    setThreadMessage('');
  };

  // Handle posting reply
  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent || !selectedThreadId) return;

    const authorName = currentUserRole === 'Lecturer' ? 'Dr. Evelyn Carter' : 'Alice Johnson';
    addMessageToThread(selectedThreadId, authorName, currentUserRole, replyContent);
    setReplyContent('');
  };

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 border border-slate-800 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white">Lecturer & Student Communication Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish academic bulletins or engage in Q&A discussion channels.
          </p>
        </div>

        <div>
          {activeTab === 'announcements' && currentUserRole === 'Lecturer' && (
            <button
              onClick={() => setIsAnnounceFormOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Publish Notice
            </button>
          )}

          {activeTab === 'forum' && !selectedThreadId && (
            <button
              onClick={() => setIsThreadFormOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Discussion
            </button>
          )}
        </div>
      </div>

      {/* Tabs (Hide when viewing a single thread details to focus layout) */}
      {!selectedThreadId && (
        <div className="flex border-b border-slate-850">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 font-semibold text-xs transition-all border-b-2 ${
              activeTab === 'announcements'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Announcements Board
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2.5 font-semibold text-xs transition-all border-b-2 ${
              activeTab === 'forum'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Discussion Forums
          </button>
        </div>
      )}

      {/* Tab Content 1: Announcement Board */}
      {activeTab === 'announcements' && !selectedThreadId && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-xs">No announcements published.</p>
          ) : (
            announcements.map((notice) => (
              <div key={notice.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors relative group">
                {currentUserRole === 'Lecturer' && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this announcement?')) {
                        deleteAnnouncement(notice.id);
                      }
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
                    title="Delete announcement"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-900 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">{notice.title}</h3>
                    <span className="text-[10px] text-teal-400 font-semibold mt-1 inline-block">By {notice.author}</span>
                  </div>
                  <span className="text-xs text-slate-550 font-mono sm:mt-1">{notice.date}</span>
                </div>

                <p className="text-slate-350 text-xs sm:text-sm leading-relaxed mt-4 whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 2: Discussion Forum Thread list */}
      {activeTab === 'forum' && !selectedThreadId && (
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950/60 border-b border-slate-900">
            <h3 className="text-xs font-bold text-white">Active General & Course Subchannels</h3>
          </div>

          {threads.length === 0 ? (
            <p className="text-center py-12 text-slate-550 text-xs">No active discussion channels found.</p>
          ) : (
            <div className="divide-y divide-slate-900/70">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className="p-5 hover:bg-slate-900/20 transition-all flex justify-between items-center cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-800 text-slate-450 uppercase">
                        {thread.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Started by {thread.author}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-400 transition-colors leading-tight">
                      {thread.title}
                    </h4>

                    <span className="text-[10px] text-slate-550 block font-mono">Channel active: {thread.date}</span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 group-hover:border-teal-500/20 group-hover:text-teal-400 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {thread.messages.length}
                      </span>
                    </div>

                    {currentUserRole === 'Lecturer' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove discussion thread "${thread.title}"?`)) {
                            deleteThread(thread.id);
                          }
                        }}
                        className="text-slate-600 hover:text-red-400 p-1.5 transition-colors"
                        title="Delete Thread"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Forum Thread Detailed Chat View */}
      {selectedThreadId && selectedThread && (
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[60vh] max-h-[80vh]">
          {/* Detailed Header */}
          <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-900 flex items-center justify-between">
            <button
              onClick={() => setSelectedThreadId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 rounded-lg hover:bg-slate-900 text-xs font-semibold text-slate-350 transition-colors cursor-pointer"
            >
              &larr; Back to Forums
            </button>

            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-805 text-slate-400 uppercase">
              {selectedThread.category}
            </span>
          </div>

          {/* Conversation Bubbles */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/10">
            <div className="border-b border-slate-900 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">{selectedThread.title}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Discussion started by {selectedThread.author} on {selectedThread.date}</p>
            </div>

            <div className="space-y-4">
              {selectedThread.messages.map((msg) => {
                const isLecturer = msg.role === 'Lecturer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] sm:max-w-[70%] p-4 rounded-xl space-y-1.5 shadow border ${
                      isLecturer
                        ? 'ml-auto bg-indigo-950/30 border-indigo-900/40 text-right rounded-tr-none'
                        : 'mr-auto bg-slate-900/60 border-slate-800 text-left rounded-tl-none'
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold text-slate-400 ${
                      isLecturer ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-white">{msg.author}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wide ${
                        isLecturer 
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                          : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      }`}>
                        {msg.role}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line text-left">
                      {msg.content}
                    </p>

                    <span className="text-[9px] text-slate-550 block font-mono">{msg.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Form Footer */}
          <form onSubmit={handlePostReply} className="p-4 bg-slate-950 border-t border-slate-900 flex gap-3">
            <textarea
              rows={2}
              required
              placeholder={`Write reply as ${currentUserRole === 'Lecturer' ? 'Staff (Dr. Evelyn)' : 'Student (Alice)'}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer self-end h-10"
            >
              Reply
            </button>
          </form>
        </div>
      )}

      {/* Publish Announcement Drawer Modal */}
      {isAnnounceFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">Publish Academic Bulletin Notice</h3>
              <button
                onClick={() => setIsAnnounceFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePostAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Lab Submissions"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Content Details *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft announcement details here..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAnnounceFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Start Discussion Thread Modal */}
      {isThreadFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">Open Discussion Thread</h3>
              <button
                onClick={() => setIsThreadFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleStartThread} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Topic / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Questions on Project 1"
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Channel Category *</label>
                  <select
                    value={threadCategory}
                    onChange={(e) => setThreadCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="General">General Doubts</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Hostel & Facilities">Hostel & Facilities</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Initial Message *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Introduce the question or topic details..."
                  value={threadMessage}
                  onChange={(e) => setThreadMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsThreadFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Open Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
