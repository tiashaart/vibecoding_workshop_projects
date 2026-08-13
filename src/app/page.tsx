"use client";

import Link from 'next/link';
import { useDb } from '../hooks/useDb';

export default function Home() {
  const {
    isLoaded,
    students,
    exams,
    timetable,
    hostels,
    announcements,
    currentUserRole
  } = useDb();

  // Loading state placeholder
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalStudents = students.length;
  const activeExams = exams.length;
  const classHours = timetable.length * 1.5; // each block is 1.5 hours
  
  // Hostel capacity calculations
  const totalBeds = hostels.reduce((acc, curr) => acc + curr.capacity, 0);
  const occupiedBeds = hostels.reduce((acc, curr) => acc + curr.assignedStudentIds.length, 0);
  const hostelOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 -mb-6 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 mb-4 border border-teal-500/20">
            Welcome back
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            EduPulse SMS Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
            Manage student registrations, track schedules, schedule examinations, assign classroom and hostel rooms, and coordinate discussions in one consolidated space.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-3 text-teal-500/10 group-hover:text-teal-500/20 transition-colors">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Students</span>
          <p className="text-3xl font-bold text-white mt-2">{totalStudents}</p>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">✓ Active database</span>
            <span>registered clients</span>
          </div>
        </div>

        {/* Metric 2: Exams */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-3 text-teal-500/10 group-hover:text-teal-500/20 transition-colors">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Examinations</span>
          <p className="text-3xl font-bold text-white mt-2">{activeExams}</p>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <Link href="/exams" className="text-teal-400 font-medium hover:underline">
              View examinations &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 3: Timetable */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-3 text-teal-500/10 group-hover:text-teal-500/20 transition-colors">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Timetable Hours</span>
          <p className="text-3xl font-bold text-white mt-2">{classHours} hrs</p>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span>Allocated for standard week</span>
          </div>
        </div>

        {/* Metric 4: Hostel Occupancy */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 p-3 text-teal-500/10 group-hover:text-teal-500/20 transition-colors">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hostel Occupancy</span>
          <p className="text-3xl font-bold text-white mt-2">{hostelOccupancy}%</p>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-teal-400 font-semibold">{occupiedBeds}</span>
            <span>of {totalBeds} spaces occupied</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Quick Navigation (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950/20 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">Core Administrative Panels</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/students" className="group bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex gap-3 items-start transition-all">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">Student Registry</h4>
                  <p className="text-xs text-slate-400 mt-1">Register new admissions, view profiles, and manage status.</p>
                </div>
              </Link>

              <Link href="/exams" className="group bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex gap-3 items-start transition-all">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">Examinations Center</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage exam calendars, enter student marks, and view report cards.</p>
                </div>
              </Link>

              <Link href="/timetable" className="group bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex gap-3 items-start transition-all">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">Timetable Scheduling</h4>
                  <p className="text-xs text-slate-400 mt-1">Build daily lectures timetable slots in a dynamic visual calendar.</p>
                </div>
              </Link>

              <Link href="/allocation" className="group bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex gap-3 items-start transition-all">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">Hostel & Classroom Allocations</h4>
                  <p className="text-xs text-slate-400 mt-1">Allocate dorm rooms to students and classrooms to specific courses.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Info Section */}
          <div className="bg-gradient-to-br from-indigo-950/30 to-slate-950/40 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Need to test different role interfaces?</h4>
              <p className="text-xs text-slate-400 mt-1">
                EduPulse simulated roles allow you to toggle actions dynamically. Switch between **Lecturer (Faculty Admin)** and **Student (Client view)** in the header dropdown to view adjusted access permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Notices & Announcements (Right 1 col) */}
        <div className="space-y-6">
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Notice Board</h3>
              <Link href="/communication" className="text-xs text-teal-400 hover:underline">
                Open Portal
              </Link>
            </div>

            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No notices posted yet.</p>
              ) : (
                announcements.slice(0, 3).map((notice) => (
                  <div key={notice.id} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{notice.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{notice.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                    <div className="mt-2 text-[10px] text-teal-400/80 font-medium">
                      By {notice.author}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 text-center space-y-4">
            <h3 className="text-sm font-semibold text-white">Lecturer & Student Portal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have doubts on course works, assignments, or timetables? Engage in threads under the communication portal.
            </p>
            <Link
              href="/communication"
              className="inline-flex w-full justify-center items-center gap-1.5 px-4 py-2 bg-teal-500 text-slate-950 hover:bg-teal-400 text-xs font-bold rounded-lg transition-colors"
            >
              Go to Communications
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
