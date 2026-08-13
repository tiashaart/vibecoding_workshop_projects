"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDb } from '../hooks/useDb';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUserRole, setCurrentUserRole, isLoaded } = useDb();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Student Registration',
      href: '/students',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      name: 'Examinations',
      href: '/exams',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Timetable',
      href: '/timetable',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Hostel & Classrooms',
      href: '/allocation',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Communication Portal',
      href: '/communication',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  const getPageTitle = () => {
    const item = navItems.find((x) => x.href === pathname);
    return item ? item.name : 'Student Management System';
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight text-white">EduPulse SMS</h1>
            <span className="text-xs text-slate-400">Student Management</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 pl-2.5'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">DB Status</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Local Active
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-tight text-white">EduPulse</h1>
              <span className="text-xs text-slate-400">Student System</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 pl-2.5'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">DB Status</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Local Active
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden bg-slate-900">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 h-16 border-b border-slate-800 bg-slate-950/30 backdrop-blur-md">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Current Page Title */}
          <h2 className="hidden md:block text-lg font-semibold text-white">
            {getPageTitle()}
          </h2>

          <div className="flex items-center gap-4 ml-auto md:ml-0">
            {/* Simulation Identity selector */}
            <div className="flex items-center gap-2">
              <label className="hidden sm:inline-block text-xs font-medium text-slate-400">
                Acting As:
              </label>
              {isLoaded ? (
                <select
                  value={currentUserRole}
                  onChange={(e) => setCurrentUserRole(e.target.value as 'Lecturer' | 'Student')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-teal-500 hover:bg-slate-855 transition-colors cursor-pointer"
                >
                  <option value="Lecturer">Lecturer (Staff)</option>
                  <option value="Student">Student (Client)</option>
                </select>
              ) : (
                <div className="w-24 h-7 rounded bg-slate-800 animate-pulse"></div>
              )}
            </div>

            {/* Profile Avatar indicator */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentUserRole === 'Lecturer' ? 'bg-indigo-500 text-white' : 'bg-teal-500 text-slate-950'
              }`}>
                {currentUserRole === 'Lecturer' ? 'L' : 'S'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">
                  {currentUserRole === 'Lecturer' ? 'Dr. Evelyn Carter' : 'Alice Johnson'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {currentUserRole === 'Lecturer' ? 'Faculty Admin' : 'CS Undergrad'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-slate-800 bg-slate-950/20 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 EduPulse Student Management System. Built with Next.js & TailwindCSS.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Support Desk</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
