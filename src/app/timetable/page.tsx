"use client";

import React, { useState } from 'react';
import { useDb } from '../../hooks/useDb';
import { DayOfWeek, TimetableEntry } from '../../types';

export default function TimetablePage() {
  const {
    isLoaded,
    currentUserRole,
    timetable,
    classrooms,
    addTimetableEntry,
    deleteTimetableEntry
  } = useDb();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
  const [classroomId, setClassroomId] = useState('');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '11:00 AM - 12:30 PM',
    '01:00 PM - 02:30 PM',
    '03:00 PM - 04:30 PM'
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-fill classroom selector if classrooms exist
  const defaultClassroom = classrooms[0]?.id || '';

  const handleOpenForm = () => {
    setSubject('');
    setLecturer('');
    setDay('Monday');
    setTimeSlot('09:00 AM - 10:30 AM');
    setClassroomId(defaultClassroom);
    setIsFormOpen(true);
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !lecturer || !classroomId) {
      alert('Please fill out all fields');
      return;
    }

    // Check for collisions (same day, same time slot, same classroom)
    const collision = timetable.find(
      t => t.day === day && t.timeSlot === timeSlot && t.classroomId === classroomId
    );

    if (collision) {
      alert(`Conflict Detected! Room is already occupied by "${collision.subject}" at this time.`);
      return;
    }

    addTimetableEntry({
      day,
      timeSlot,
      subject,
      lecturer,
      classroomId
    });
    setIsFormOpen(false);
  };

  // Get classroom name from ID
  const getClassroomName = (id: string) => {
    const room = classrooms.find(c => c.id === id);
    return room ? room.roomName : 'Unknown Room';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 border border-slate-800 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white">Timetable Scheduling</h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUserRole === 'Lecturer'
              ? 'Arrange lecture schedules, set rooms, and review timing overlaps.'
              : 'Review your weekly schedule and class coordinates.'}
          </p>
        </div>

        {currentUserRole === 'Lecturer' && (
          <button
            onClick={handleOpenForm}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lecture Slot
          </button>
        )}
      </div>

      {/* Grid Calendar Layout (Desktop) */}
      <div className="hidden lg:block bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-6 border-b border-slate-850 bg-slate-950/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center">
          <div className="px-4 py-4 text-left border-r border-slate-850">Time Slot</div>
          {days.map(d => (
            <div key={d} className="px-4 py-4 border-r border-slate-850 last:border-r-0">{d}</div>
          ))}
        </div>

        <div className="divide-y divide-slate-850">
          {timeSlots.map((slot) => (
            <div key={slot} className="grid grid-cols-6 items-stretch">
              {/* Time axis */}
              <div className="px-4 py-6 border-r border-slate-850 bg-slate-950/20 text-center flex items-center justify-center">
                <span className="text-[11px] font-mono font-semibold text-slate-400">{slot}</span>
              </div>

              {/* Day cells */}
              {days.map((dayName) => {
                const entries = timetable.filter(t => t.day === dayName && t.timeSlot === slot);
                
                return (
                  <div key={`${dayName}-${slot}`} className="p-2.5 border-r border-slate-850 last:border-r-0 min-h-[110px] bg-slate-900/10 hover:bg-slate-900/30 transition-colors flex flex-col justify-between">
                    {entries.length === 0 ? (
                      <span className="text-[10px] text-slate-600 block text-center mt-8 italic">Free Window</span>
                    ) : (
                      entries.map((entry) => (
                        <div key={entry.id} className="h-full bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between group relative">
                          {currentUserRole === 'Lecturer' && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove lecture "${entry.subject}" from timetable?`)) {
                                  deleteTimetableEntry(entry.id);
                                }
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-0.5"
                              title="Delete Slot"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          <div>
                            <span className="text-[10px] font-bold text-teal-400 block leading-tight mb-1">{entry.subject}</span>
                            <span className="text-[9px] text-slate-450 block leading-tight">By {entry.lecturer}</span>
                          </div>
                          <div className="mt-2 pt-1 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-500 font-medium">
                            <span>Room:</span>
                            <span className="text-indigo-400 font-bold">{getClassroomName(entry.classroomId)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Responsive List View (Mobile/Tablet) */}
      <div className="block lg:hidden space-y-4">
        {days.map((dayName) => {
          const dayEntries = timetable.filter(t => t.day === dayName);
          return (
            <div key={dayName} className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-slate-900 pb-2 flex justify-between items-center">
                <span>{dayName}</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                  {dayEntries.length} Classes
                </span>
              </h3>

              {dayEntries.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic py-2">No lectures scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center bg-slate-900/40 border border-slate-850 p-3 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 block font-mono">{entry.timeSlot}</span>
                        <h4 className="text-xs font-bold text-white leading-tight">{entry.subject}</h4>
                        <span className="text-[10px] text-slate-400 block">Lecturer: {entry.lecturer}</span>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 font-bold">
                          {getClassroomName(entry.classroomId)}
                        </span>
                        
                        {currentUserRole === 'Lecturer' && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove lecture "${entry.subject}"?`)) {
                                deleteTimetableEntry(entry.id);
                              }
                            }}
                            className="block text-[10px] text-red-400 hover:underline mt-1 cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Entry Form Overlay Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">Create Timetable Entry</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Lecturer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Evelyn Carter"
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Day of Week *</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Time Slot *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    {timeSlots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Classroom Allocation *</label>
                <select
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Select Room --</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.roomName} (Cap: {c.capacity})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
