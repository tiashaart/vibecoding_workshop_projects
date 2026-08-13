"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Exam,
  ExamResult,
  TimetableEntry,
  HostelRoom,
  Classroom,
  Announcement,
  ForumThread,
  ForumMessage
} from '../types';

interface DbContextType {
  isLoaded: boolean;
  currentUserRole: 'Lecturer' | 'Student';
  setCurrentUserRole: (role: 'Lecturer' | 'Student') => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (updatedStudent: Student) => void;
  deleteStudent: (id: string) => void;
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (updatedExam: Exam) => void;
  deleteExam: (id: string) => void;
  results: ExamResult[];
  addResult: (result: Omit<ExamResult, 'id'>) => void;
  updateResult: (updatedResult: ExamResult) => void;
  deleteResult: (id: string) => void;
  timetable: TimetableEntry[];
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (updatedEntry: TimetableEntry) => void;
  deleteTimetableEntry: (id: string) => void;
  hostels: HostelRoom[];
  addHostelRoom: (room: Omit<HostelRoom, 'id' | 'assignedStudentIds'>) => void;
  allocateHostelStudent: (roomId: string, studentId: string) => void;
  deallocateHostelStudent: (roomId: string, studentId: string) => void;
  deleteHostelRoom: (id: string) => void;
  classrooms: Classroom[];
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  updateClassroom: (updatedClassroom: Classroom) => void;
  deleteClassroom: (id: string) => void;
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  threads: ForumThread[];
  addThread: (title: string, category: string, author: string, content: string, role: 'Lecturer' | 'Student') => void;
  addMessageToThread: (threadId: string, author: string, role: 'Lecturer' | 'Student', content: string) => void;
  deleteThread: (id: string) => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

// Default mock data
const DEFAULT_STUDENTS: Student[] = [
  { id: 'st-1', name: 'Alice Johnson', rollNumber: 'CS2026001', email: 'alice@university.edu', department: 'Computer Science', course: 'B.Sc. CS', phone: '+1 555-0199', gender: 'Female', status: 'Active' },
  { id: 'st-2', name: 'Bob Smith', rollNumber: 'EE2026002', email: 'bob@university.edu', department: 'Electrical Engineering', course: 'B.Tech EE', phone: '+1 555-0142', gender: 'Male', status: 'Active' },
  { id: 'st-3', name: 'Chloe Miller', rollNumber: 'ME2026003', email: 'chloe@university.edu', department: 'Mechanical Engineering', course: 'B.Tech ME', phone: '+1 555-0188', gender: 'Female', status: 'Active' },
];

const DEFAULT_EXAMS: Exam[] = [
  { id: 'ex-1', subject: 'Data Structures & Algorithms', code: 'CS-201', date: '2026-09-15', time: '09:00 AM', venue: 'Exam Hall A', totalMarks: 100 },
  { id: 'ex-2', subject: 'Linear Circuit Analysis', code: 'EE-102', date: '2026-09-17', time: '01:00 PM', venue: 'Seminar Hall 1', totalMarks: 100 },
  { id: 'ex-3', subject: 'Thermodynamics', code: 'ME-204', date: '2026-09-20', time: '09:00 AM', venue: 'Block C - Room 301', totalMarks: 100 },
];

const DEFAULT_RESULTS: ExamResult[] = [
  { id: 'er-1', examId: 'ex-1', studentId: 'st-1', marksObtained: 92, grade: 'A+' },
  { id: 'er-2', examId: 'ex-1', studentId: 'st-2', marksObtained: 78, grade: 'B' },
  { id: 'er-3', examId: 'ex-2', studentId: 'st-2', marksObtained: 85, grade: 'A' },
];

const DEFAULT_TIMETABLE: TimetableEntry[] = [
  { id: 'tt-1', day: 'Monday', timeSlot: '09:00 AM - 10:30 AM', subject: 'Data Structures & Algorithms', lecturer: 'Dr. Evelyn Carter', classroomId: 'cr-1' },
  { id: 'tt-2', day: 'Monday', timeSlot: '11:00 AM - 12:30 PM', subject: 'Thermodynamics', lecturer: 'Prof. Marcus Vance', classroomId: 'cr-2' },
  { id: 'tt-3', day: 'Wednesday', timeSlot: '09:00 AM - 10:30 AM', subject: 'Data Structures & Algorithms', lecturer: 'Dr. Evelyn Carter', classroomId: 'cr-1' },
  { id: 'tt-4', day: 'Thursday', timeSlot: '01:00 PM - 02:30 PM', subject: 'Linear Circuit Analysis', lecturer: 'Dr. Albert Patel', classroomId: 'cr-3' },
];

const DEFAULT_HOSTELS: HostelRoom[] = [
  { id: 'hr-1', block: 'Alpha Male Dorm', roomNumber: 'A-101', capacity: 2, assignedStudentIds: ['st-2'] },
  { id: 'hr-2', block: 'Alpha Male Dorm', roomNumber: 'A-102', capacity: 2, assignedStudentIds: [] },
  { id: 'hr-3', block: 'Beta Female Dorm', roomNumber: 'B-201', capacity: 2, assignedStudentIds: ['st-1'] },
  { id: 'hr-4', block: 'Beta Female Dorm', roomNumber: 'B-202', capacity: 2, assignedStudentIds: ['st-3'] },
];

const DEFAULT_CLASSROOMS: Classroom[] = [
  { id: 'cr-1', roomName: 'Room 302 (CS Lab)', capacity: 40, resources: ['Projector', 'PCs', 'Whiteboard'], assignedCourse: 'B.Sc. CS' },
  { id: 'cr-2', roomName: 'Room 105', capacity: 60, resources: ['Projector', 'Whiteboard', 'Microphone'], assignedCourse: 'B.Tech ME' },
  { id: 'cr-3', roomName: 'Room 204 (EE Lab)', capacity: 30, resources: ['Oscilloscopes', 'Breadboards', 'Projector'], assignedCourse: 'B.Tech EE' },
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: 'an-1', title: 'Mid-term Exams Schedule Published', content: 'The mid-term exams schedule for Fall 2026 has been published under the Examination section. Please review your respective venues and timings.', date: '2026-08-10', author: 'Academic Dean' },
  { id: 'an-2', title: 'Hostel Maintenance Drive', content: 'Routine electrical and plumbing maintenance will take place in Alpha Male Dorm on Saturday, August 16, between 9:00 AM and 4:00 PM.', date: '2026-08-12', author: 'Hostel Warden' },
];

const DEFAULT_THREADS: ForumThread[] = [
  {
    id: 'th-1',
    title: 'Doubts regarding DSA Assignment 2 (Red-Black Trees)',
    category: 'Computer Science',
    author: 'Alice Johnson',
    date: '2026-08-11',
    messages: [
      { id: 'm-1', author: 'Alice Johnson', role: 'Student', content: 'Hello everyone, in Assignment 2, are we supposed to implement the deletion operation for Red-Black trees as well, or just insertion?', date: '2026-08-11 10:15 AM' },
      { id: 'm-2', author: 'Dr. Evelyn Carter', role: 'Lecturer', content: 'Hi Alice. Deletion is not required for this assignment; you only need to cover insertion and tree rotations to maintain balance.', date: '2026-08-11 11:30 AM' }
    ]
  },
  {
    id: 'th-2',
    title: 'Recommended Textbooks for Thermodynamics',
    category: 'Mechanical Engineering',
    author: 'Chloe Miller',
    date: '2026-08-12',
    messages: [
      { id: 'm-3', author: 'Chloe Miller', role: 'Student', content: 'Can anyone recommend reference books for Thermodynamics? The lecture notes are good, but I need more practice problems.', date: '2026-08-12 02:40 PM' }
    ]
  }
];

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'Lecturer' | 'Student'>('Lecturer');
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [hostels, setHostels] = useState<HostelRoom[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      function getOrInit<T>(key: string, defaultData: T): T {
        const stored = localStorage.getItem(`sms_${key}`);
        if (stored) {
          try {
            return JSON.parse(stored) as T;
          } catch {
            return defaultData;
          }
        }
        localStorage.setItem(`sms_${key}`, JSON.stringify(defaultData));
        return defaultData;
      }

      setStudents(getOrInit('students', DEFAULT_STUDENTS));
      setExams(getOrInit('exams', DEFAULT_EXAMS));
      setResults(getOrInit('results', DEFAULT_RESULTS));
      setTimetable(getOrInit('timetable', DEFAULT_TIMETABLE));
      setHostels(getOrInit('hostels', DEFAULT_HOSTELS));
      setClassrooms(getOrInit('classrooms', DEFAULT_CLASSROOMS));
      setAnnouncements(getOrInit('announcements', DEFAULT_ANNOUNCEMENTS));
      setThreads(getOrInit('threads', DEFAULT_THREADS));
      
      const storedRole = localStorage.getItem('sms_user_role');
      if (storedRole === 'Lecturer' || storedRole === 'Student') {
        setCurrentUserRole(storedRole);
      } else {
        localStorage.setItem('sms_user_role', 'Lecturer');
      }
      
      setIsLoaded(true);
    }
  }, []);

  const handleSetRole = (role: 'Lecturer' | 'Student') => {
    setCurrentUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sms_user_role', role);
    }
  };

  // Sync helper
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`sms_${key}`, JSON.stringify(data));
    }
  };

  // Student CRUD
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: `st-${Date.now()}` };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveToStorage('students', updated);
  };

  const updateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    saveToStorage('students', updated);
  };

  const deleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveToStorage('students', updated);
    
    const updatedHostels = hostels.map(h => ({
      ...h,
      assignedStudentIds: h.assignedStudentIds.filter(sid => sid !== id)
    }));
    setHostels(updatedHostels);
    saveToStorage('hostels', updatedHostels);

    const updatedResults = results.filter(r => r.studentId !== id);
    setResults(updatedResults);
    saveToStorage('results', updatedResults);
  };

  // Exam CRUD
  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = { ...exam, id: `ex-${Date.now()}` };
    const updated = [...exams, newExam];
    setExams(updated);
    saveToStorage('exams', updated);
  };

  const updateExam = (updatedExam: Exam) => {
    const updated = exams.map(e => e.id === updatedExam.id ? updatedExam : e);
    setExams(updated);
    saveToStorage('exams', updated);
  };

  const deleteExam = (id: string) => {
    const updated = exams.filter(e => e.id !== id);
    setExams(updated);
    saveToStorage('exams', updated);

    const updatedResults = results.filter(r => r.examId !== id);
    setResults(updatedResults);
    saveToStorage('results', updatedResults);
  };

  // Exam Result CRUD
  const addResult = (result: Omit<ExamResult, 'id'>) => {
    const newResult: ExamResult = { ...result, id: `er-${Date.now()}` };
    const updated = [...results, newResult];
    setResults(updated);
    saveToStorage('results', updated);
  };

  const updateResult = (updatedResult: ExamResult) => {
    const updated = results.map(r => r.id === updatedResult.id ? updatedResult : r);
    setResults(updated);
    saveToStorage('results', updated);
  };

  const deleteResult = (id: string) => {
    const updated = results.filter(r => r.id !== id);
    setResults(updated);
    saveToStorage('results', updated);
  };

  // Timetable CRUD
  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = { ...entry, id: `tt-${Date.now()}` };
    const updated = [...timetable, newEntry];
    setTimetable(updated);
    saveToStorage('timetable', updated);
  };

  const updateTimetableEntry = (updatedEntry: TimetableEntry) => {
    const updated = timetable.map(t => t.id === updatedEntry.id ? updatedEntry : t);
    setTimetable(updated);
    saveToStorage('timetable', updated);
  };

  const deleteTimetableEntry = (id: string) => {
    const updated = timetable.filter(t => t.id !== id);
    setTimetable(updated);
    saveToStorage('timetable', updated);
  };

  // Hostel Allocation
  const addHostelRoom = (room: Omit<HostelRoom, 'id' | 'assignedStudentIds'>) => {
    const newRoom: HostelRoom = { ...room, id: `hr-${Date.now()}`, assignedStudentIds: [] };
    const updated = [...hostels, newRoom];
    setHostels(updated);
    saveToStorage('hostels', updated);
  };

  const allocateHostelStudent = (roomId: string, studentId: string) => {
    const cleanedHostels = hostels.map(h => ({
      ...h,
      assignedStudentIds: h.assignedStudentIds.filter(sid => sid !== studentId)
    }));

    const updated = cleanedHostels.map(h => {
      if (h.id === roomId && h.assignedStudentIds.length < h.capacity) {
        return {
          ...h,
          assignedStudentIds: [...h.assignedStudentIds, studentId]
        };
      }
      return h;
    });
    setHostels(updated);
    saveToStorage('hostels', updated);
  };

  const deallocateHostelStudent = (roomId: string, studentId: string) => {
    const updated = hostels.map(h => {
      if (h.id === roomId) {
        return {
          ...h,
          assignedStudentIds: h.assignedStudentIds.filter(sid => sid !== studentId)
        };
      }
      return h;
    });
    setHostels(updated);
    saveToStorage('hostels', updated);
  };

  const deleteHostelRoom = (id: string) => {
    const updated = hostels.filter(h => h.id !== id);
    setHostels(updated);
    saveToStorage('hostels', updated);
  };

  // Classroom Allocation
  const addClassroom = (classroom: Omit<Classroom, 'id'>) => {
    const newClassroom: Classroom = { ...classroom, id: `cr-${Date.now()}` };
    const updated = [...classrooms, newClassroom];
    setClassrooms(updated);
    saveToStorage('classrooms', updated);
  };

  const updateClassroom = (updatedClassroom: Classroom) => {
    const updated = classrooms.map(c => c.id === updatedClassroom.id ? updatedClassroom : c);
    setClassrooms(updated);
    saveToStorage('classrooms', updated);
  };

  const deleteClassroom = (id: string) => {
    const updated = classrooms.filter(c => c.id !== id);
    setClassrooms(updated);
    saveToStorage('classrooms', updated);
  };

  // Announcements
  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `an-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    saveToStorage('announcements', updated);
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveToStorage('announcements', updated);
  };

  // Forum Threads
  const addThread = (title: string, category: string, author: string, content: string, role: 'Lecturer' | 'Student') => {
    const timestampStr = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = new Date().toISOString().split('T')[0];
    const newThread: ForumThread = {
      id: `th-${Date.now()}`,
      title,
      category,
      author,
      date: dateStr,
      messages: [
        {
          id: `m-${Date.now()}`,
          author,
          role,
          content,
          date: `${dateStr} ${timestampStr}`
        }
      ]
    };
    const updated = [newThread, ...threads];
    setThreads(updated);
    saveToStorage('threads', updated);
  };

  const addMessageToThread = (threadId: string, author: string, role: 'Lecturer' | 'Student', content: string) => {
    const timestampStr = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = new Date().toISOString().split('T')[0];
    const newMsg: ForumMessage = {
      id: `m-${Date.now()}`,
      author,
      role,
      content,
      date: `${dateStr} ${timestampStr}`
    };

    const updated = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });
    setThreads(updated);
    saveToStorage('threads', updated);
  };

  const deleteThread = (id: string) => {
    const updated = threads.filter(t => t.id !== id);
    setThreads(updated);
    saveToStorage('threads', updated);
  };

  return (
    <DbContext.Provider value={{
      isLoaded,
      currentUserRole,
      setCurrentUserRole: handleSetRole,
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      exams,
      addExam,
      updateExam,
      deleteExam,
      results,
      addResult,
      updateResult,
      deleteResult,
      timetable,
      addTimetableEntry,
      updateTimetableEntry,
      deleteTimetableEntry,
      hostels,
      addHostelRoom,
      allocateHostelStudent,
      deallocateHostelStudent,
      deleteHostelRoom,
      classrooms,
      addClassroom,
      updateClassroom,
      deleteClassroom,
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      threads,
      addThread,
      addMessageToThread,
      deleteThread
    }}>
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
}
