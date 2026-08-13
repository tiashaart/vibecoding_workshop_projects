"use client";

import React, { useState } from 'react';
import { useDb } from '../../hooks/useDb';
import { Classroom, HostelRoom, Student } from '../../types';

export default function AllocationsPage() {
  const {
    isLoaded,
    currentUserRole,
    hostels,
    classrooms,
    students,
    addHostelRoom,
    deleteHostelRoom,
    allocateHostelStudent,
    deallocateHostelStudent,
    addClassroom,
    deleteClassroom
  } = useDb();

  const [activeTab, setActiveTab] = useState<'hostel' | 'classroom'>('hostel');

  // Hostel states
  const [isHostelFormOpen, setIsHostelFormOpen] = useState(false);
  const [block, setBlock] = useState('Alpha Male Dorm');
  const [roomNumber, setRoomNumber] = useState('');
  const [hostelCapacity, setHostelCapacity] = useState(2);
  const [allocationRoomId, setAllocationRoomId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Classroom states
  const [isClassroomFormOpen, setIsClassroomFormOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [classroomCapacity, setClassroomCapacity] = useState(40);
  const [assignedCourse, setAssignedCourse] = useState('');
  const [hasProjector, setHasProjector] = useState(true);
  const [hasPCs, setHasPCs] = useState(false);
  const [hasWhiteboard, setHasWhiteboard] = useState(true);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Find students who are not allocated to any hostel room
  const getAllocatedStudentIds = () => {
    return hostels.flatMap(h => h.assignedStudentIds);
  };

  const getUnallocatedStudents = () => {
    const allocatedIds = getAllocatedStudentIds();
    return students.filter(s => s.status === 'Active' && !allocatedIds.includes(s.id));
  };

  const handleCreateHostelRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) {
      alert('Room number is required');
      return;
    }
    addHostelRoom({
      block,
      roomNumber,
      capacity: Number(hostelCapacity)
    });
    setIsHostelFormOpen(false);
    setRoomNumber('');
    setHostelCapacity(2);
  };

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !assignedCourse) {
      alert('Room name and course assignment are required');
      return;
    }

    const resources: string[] = [];
    if (hasProjector) resources.push('Projector');
    if (hasPCs) resources.push('PCs / Computers');
    if (hasWhiteboard) resources.push('Whiteboard');

    addClassroom({
      roomName,
      capacity: Number(classroomCapacity),
      resources,
      assignedCourse
    });

    setIsClassroomFormOpen(false);
    setRoomName('');
    setClassroomCapacity(40);
    setAssignedCourse('');
    setHasProjector(true);
    setHasPCs(false);
    setHasWhiteboard(true);
  };

  const handleAllocateStudent = (roomId: string) => {
    if (!selectedStudentId) {
      alert('Select a student first');
      return;
    }
    allocateHostelStudent(roomId, selectedStudentId);
    setAllocationRoomId(null);
    setSelectedStudentId('');
  };

  const getStudentName = (id: string) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Unknown Student';
  };

  const unallocatedStudents = getUnallocatedStudents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 border border-slate-800 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white">Hostel & Classroom Allocations</h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUserRole === 'Lecturer'
              ? 'Organize hostel bed space assignments and distribute classroom facilities.'
              : 'Review your hostel room roommates and classroom technical setups.'}
          </p>
        </div>

        {currentUserRole === 'Lecturer' && (
          <div>
            {activeTab === 'hostel' ? (
              <button
                onClick={() => setIsHostelFormOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Hostel Room
              </button>
            ) : (
              <button
                onClick={() => setIsClassroomFormOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Classroom
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-850">
        <button
          onClick={() => setActiveTab('hostel')}
          className={`px-4 py-2.5 font-semibold text-xs transition-all border-b-2 ${
            activeTab === 'hostel' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Hostel Allocations
        </button>
        <button
          onClick={() => setActiveTab('classroom')}
          className={`px-4 py-2.5 font-semibold text-xs transition-all border-b-2 ${
            activeTab === 'classroom' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Classroom Resources
        </button>
      </div>

      {/* Tab Content 1: Hostel Room allocations */}
      {activeTab === 'hostel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {hostels.length === 0 ? (
            <p className="col-span-full py-12 text-center text-slate-500 text-xs">No hostels registered.</p>
          ) : (
            hostels.map((room) => {
              const bedsLeft = room.capacity - room.assignedStudentIds.length;
              const isFull = bedsLeft === 0;

              return (
                <div key={room.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">{room.block}</span>
                        <h3 className="text-sm font-bold text-white mt-1">Room {room.roomNumber}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isFull 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isFull ? 'Room Full' : `${bedsLeft} Space(s) Left`}
                        </span>
                        
                        {currentUserRole === 'Lecturer' && room.assignedStudentIds.length === 0 && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove room ${room.roomNumber} from database?`)) {
                                deleteHostelRoom(room.id);
                              }
                            }}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            title="Delete Room"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Assigned Roommates List */}
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Students</p>
                      {room.assignedStudentIds.length === 0 ? (
                        <p className="text-[11px] text-slate-650 italic">No students allocated yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {room.assignedStudentIds.map(studentId => (
                            <div key={studentId} className="flex justify-between items-center bg-slate-900/60 border border-slate-850 px-2.5 py-1.5 rounded-lg text-xs">
                              <span className="text-white font-medium">{getStudentName(studentId)}</span>
                              
                              {currentUserRole === 'Lecturer' && (
                                <button
                                  onClick={() => deallocateHostelStudent(room.id, studentId)}
                                  className="text-[10px] text-slate-500 hover:text-red-400 hover:underline transition-colors"
                                >
                                  Deallocate
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Allocate Drawer button */}
                  {currentUserRole === 'Lecturer' && !isFull && (
                    <div className="pt-4 mt-2 border-t border-slate-900/50">
                      {allocationRoomId === room.id ? (
                        <div className="flex gap-2">
                          <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-850 rounded text-[11px] text-white focus:outline-none"
                          >
                            <option value="">-- Choose Student --</option>
                            {unallocatedStudents.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAllocateStudent(room.id)}
                            className="px-3 py-1 bg-teal-500 text-slate-950 font-bold rounded text-[11px] hover:bg-teal-400"
                          >
                            Allocate
                          </button>
                          <button
                            onClick={() => setAllocationRoomId(null)}
                            className="px-1.5 py-1 border border-slate-850 text-slate-400 hover:text-white rounded text-[11px]"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAllocationRoomId(room.id);
                            setSelectedStudentId('');
                          }}
                          className="w-full text-center py-2 border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/30 rounded-lg text-xs font-semibold text-teal-400 transition-all cursor-pointer"
                        >
                          + Allocate Bed Space
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content 2: Classroom allocations */}
      {activeTab === 'classroom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classrooms.length === 0 ? (
            <p className="col-span-full py-12 text-center text-slate-500 text-xs">No classrooms registered.</p>
          ) : (
            classrooms.map((room) => (
              <div key={room.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{room.roomName}</h3>
                      <span className="text-[10px] text-slate-450 mt-1 block">Capacity: <strong className="text-white">{room.capacity} seats</strong></span>
                    </div>

                    {currentUserRole === 'Lecturer' && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove classroom "${room.roomName}"? This will affect timetable allocations.`)) {
                            deleteClassroom(room.id);
                          }
                        }}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Delete Room"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Equipped Tech Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {room.resources.length === 0 ? (
                        <span className="text-slate-600 text-[10px] italic">No technical tools added.</span>
                      ) : (
                        room.resources.map(res => (
                          <span key={res} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-350 border border-slate-800">
                            {res}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-900 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Dedicated Course:</span>
                  <span className="inline-flex px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    {room.assignedCourse}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Hostel Add Room Drawer Modal */}
      {isHostelFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">Create Hostel Room Block</h3>
              <button
                onClick={() => setIsHostelFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateHostelRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Hostel Dormitory Block *</label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="Alpha Male Dorm">Alpha Male Dorm</option>
                  <option value="Beta Female Dorm">Beta Female Dorm</option>
                  <option value="Gamma Mixed Dorm">Gamma Mixed Dorm</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-302"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Total Bed Capacity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={6}
                    value={hostelCapacity}
                    onChange={(e) => setHostelCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsHostelFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classroom Add Drawer Modal */}
      {isClassroomFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">Create New Classroom</h3>
              <button
                onClick={() => setIsClassroomFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateClassroom} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Classroom Code / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 402 (Physics Lab)"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Desk Seating Capacity *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={150}
                    value={classroomCapacity}
                    onChange={(e) => setClassroomCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Assigned Course Dept *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Sc. CS"
                    value={assignedCourse}
                    onChange={(e) => setAssignedCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Equipped Features / Tools</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasProjector}
                      onChange={(e) => setHasProjector(e.target.checked)}
                      className="rounded accent-teal-500"
                    />
                    Multimedia Projector / Screen
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPCs}
                      onChange={(e) => setHasPCs(e.target.checked)}
                      className="rounded accent-teal-500"
                    />
                    Lab Computer Terminals (PCs)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasWhiteboard}
                      onChange={(e) => setHasWhiteboard(e.target.checked)}
                      className="rounded accent-teal-500"
                    />
                    Magnetic Interactive Whiteboard
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsClassroomFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
