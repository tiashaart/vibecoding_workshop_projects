export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  course: string;
  phone: string;
  gender: string;
  status: 'Active' | 'Inactive';
}

export interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  venue: string;
  totalMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  timeSlot: string; // e.g., "09:00 - 10:30"
  subject: string;
  lecturer: string;
  classroomId: string;
}

export interface HostelRoom {
  id: string;
  block: string;
  roomNumber: string;
  capacity: number;
  assignedStudentIds: string[];
}

export interface Classroom {
  id: string;
  roomName: string;
  capacity: number;
  resources: string[]; // e.g. Projector, Lab Equipment
  assignedCourse: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  messages: ForumMessage[];
}

export interface ForumMessage {
  id: string;
  author: string;
  role: 'Lecturer' | 'Student';
  content: string;
  date: string;
}
