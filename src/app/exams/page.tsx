"use client";

import React, { useState } from 'react';
import { useDb } from '../../hooks/useDb';
import { Exam, ExamResult, Student } from '../../types';

export default function ExamsPage() {
  const {
    isLoaded,
    currentUserRole,
    exams,
    students,
    results,
    addExam,
    deleteExam,
    addResult,
    updateResult,
    deleteResult
  } = useDb();

  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule');

  // Schedule States
  const [isExamFormOpen, setIsExamFormOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [code, setCode] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);

  // Results States
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [marksInput, setMarksInput] = useState<string>('');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate grading formula
  const calculateGrade = (marks: number, total: number) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !code || !date || !time || !venue) {
      alert('Please fill all required fields');
      return;
    }
    addExam({
      subject,
      code,
      date,
      time,
      venue,
      totalMarks: Number(totalMarks)
    });
    setIsExamFormOpen(false);
    // Clear inputs
    setSubject('');
    setCode('');
    setDate('');
    setTime('');
    setVenue('');
    setTotalMarks(100);
  };

  const handleSaveMarks = (studentId: string, examId: string) => {
    const numericMarks = Number(marksInput);
    const selectedExam = exams.find(e => e.id === examId);
    if (!selectedExam) return;

    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > selectedExam.totalMarks) {
      alert(`Invalid marks. Must be between 0 and ${selectedExam.totalMarks}.`);
      return;
    }

    const existingResult = results.find(r => r.examId === examId && r.studentId === studentId);
    const grade = calculateGrade(numericMarks, selectedExam.totalMarks);

    if (existingResult) {
      updateResult({
        ...existingResult,
        marksObtained: numericMarks,
        grade
      });
    } else {
      addResult({
        examId,
        studentId,
        marksObtained: numericMarks,
        grade
      });
    }

    setEditingStudentId(null);
    setMarksInput('');
  };

  // Get report card for logged-in student simulation ("Alice Johnson", st-1)
  const currentStudentId = 'st-1';
  const getStudentResults = (studentId: string) => {
    return results.filter(r => r.studentId === studentId).map(res => {
      const exam = exams.find(e => e.id === res.examId);
      return {
        id: res.id,
        subject: exam ? exam.subject : 'Unknown',
        code: exam ? exam.code : 'N/A',
        marksObtained: res.marksObtained,
        totalMarks: exam ? exam.totalMarks : 100,
        grade: res.grade
      };
    });
  };

  const studentReportCard = getStudentResults(currentStudentId);
  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 border border-slate-800 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white">Examinations Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUserRole === 'Lecturer' 
              ? 'Schedule, edit examinations, and record student grades.' 
              : 'View exam dates, locations, and your academic report card.'}
          </p>
        </div>
        
        {currentUserRole === 'Lecturer' && (
          <button
            onClick={() => setIsExamFormOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Schedule Exam
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-850">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 font-semibold text-xs transition-all border-b-2 ${
            activeTab === 'schedule' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Exam Schedule
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 font-semibold text-xs transition-all border-b-2 ${
            activeTab === 'results' 
              ? 'border-teal-500 text-teal-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentUserRole === 'Lecturer' ? 'Record & View Results' : 'My Report Card'}
        </button>
      </div>

      {/* Tab Content 1: Schedule */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {exams.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No exams scheduled in this term.
            </div>
          ) : (
            exams.map((exam) => (
              <div key={exam.id} className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl space-y-4 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
                      {exam.code}
                    </span>
                    <h3 className="font-semibold text-sm text-white mt-2">{exam.subject}</h3>
                  </div>
                  
                  {currentUserRole === 'Lecturer' && (
                    <button
                      onClick={() => {
                        if (confirm(`Cancel and delete exam "${exam.subject}"? This deletes all associated grades.`)) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Cancel Exam"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-2 border-t border-slate-900 pt-3 text-xs text-slate-450">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{exam.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Max Marks: <strong className="text-teal-400">{exam.totalMarks}</strong></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 2: Results & Grades */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {currentUserRole === 'Lecturer' ? (
            /* Lecturer Dashboard View */
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-900">
                <h3 className="text-sm font-bold text-white">Record Students Performance</h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Select Exam:</label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="" disabled>-- Choose Exam --</option>
                    {exams.map(e => (
                      <option key={e.id} value={e.id}>{e.code} - {e.subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!selectedExam ? (
                <p className="text-center py-8 text-xs text-slate-500">Please schedule an exam first.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/60 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                        <th className="px-6 py-3">Student</th>
                        <th className="px-6 py-3">Roll Number</th>
                        <th className="px-6 py-3">Marks Obtained</th>
                        <th className="px-6 py-3">Grade</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 text-xs">
                      {students.map((student) => {
                        const score = results.find(r => r.examId === selectedExam.id && r.studentId === student.id);
                        const isEditing = editingStudentId === student.id;
                        
                        return (
                          <tr key={student.id} className="hover:bg-slate-900/10">
                            <td className="px-6 py-4 font-semibold text-white">{student.name}</td>
                            <td className="px-6 py-4 font-mono text-slate-450">{student.rollNumber}</td>
                            
                            {/* Marks Display / Input */}
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={marksInput}
                                    onChange={(e) => setMarksInput(e.target.value)}
                                    className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded focus:ring-1 focus:ring-teal-500 text-xs text-white"
                                    placeholder="Marks"
                                    max={selectedExam.totalMarks}
                                    min={0}
                                  />
                                  <span className="text-slate-500">/ {selectedExam.totalMarks}</span>
                                </div>
                              ) : (
                                <span className={score ? 'text-white font-medium' : 'text-slate-550'}>
                                  {score ? `${score.marksObtained} / ${selectedExam.totalMarks}` : 'N/A'}
                                </span>
                              )}
                            </td>

                            {/* Auto calculated grade */}
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <span className="text-[10px] text-slate-500 italic">Auto-graded</span>
                              ) : (
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  score?.grade === 'A+' || score?.grade === 'A'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : score?.grade === 'F'
                                      ? 'bg-red-500/10 text-red-400'
                                      : score?.grade
                                        ? 'bg-indigo-500/10 text-indigo-400'
                                        : 'bg-slate-900 text-slate-500'
                                }`}>
                                  {score ? score.grade : '--'}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-right">
                              {isEditing ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingStudentId(null)}
                                    className="px-2 py-1 border border-slate-800 hover:bg-slate-900 rounded text-[10px] text-slate-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveMarks(student.id, selectedExam.id)}
                                    className="px-2 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded text-[10px]"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingStudentId(student.id);
                                    setMarksInput(score ? String(score.marksObtained) : '');
                                  }}
                                  className="text-teal-400 hover:text-teal-300 font-medium hover:underline text-xs"
                                >
                                  {score ? 'Edit Score' : 'Record Score'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Student Personal Report Card View */
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div>
                  <h3 className="text-sm font-bold text-white">Academic Report Card</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Term: Fall 2026</p>
                </div>
                <div className="bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg text-right">
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Avg Grade</span>
                  <span className="text-sm font-bold text-teal-400">
                    {studentReportCard.length > 0 
                      ? calculateGrade(
                          studentReportCard.reduce((a, b) => a + b.marksObtained, 0),
                          studentReportCard.reduce((a, b) => a + b.totalMarks, 0)
                        )
                      : '--'}
                  </span>
                </div>
              </div>

              {studentReportCard.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No exam grades published for your account.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-500 px-4">
                    <div className="col-span-6 sm:col-span-7">Course Name</div>
                    <div className="col-span-3 sm:col-span-3">Score</div>
                    <div className="col-span-3 sm:col-span-2 text-right">Grade</div>
                  </div>

                  <div className="space-y-2.5">
                    {studentReportCard.map((report) => (
                      <div key={report.id} className="grid grid-cols-12 items-center bg-slate-900/40 border border-slate-850 p-4 rounded-lg">
                        <div className="col-span-6 sm:col-span-7">
                          <span className="text-[10px] font-mono text-slate-500 block">{report.code}</span>
                          <span className="text-xs font-bold text-white">{report.subject}</span>
                        </div>
                        <div className="col-span-3 sm:col-span-3 text-xs text-slate-350">
                          {report.marksObtained} <span className="text-slate-550">/ {report.totalMarks}</span>
                        </div>
                        <div className="col-span-3 sm:col-span-2 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            report.grade === 'A+' || report.grade === 'A'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-indigo-500/10 text-indigo-400'
                          }`}>
                            {report.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Schedule Exam Overlay Drawer */}
      {isExamFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">Schedule New Term Exam</h3>
              <button
                onClick={() => setIsExamFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Calculus"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MA-202"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Total Marks *</label>
                  <input
                    type="number"
                    required
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Start Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Venue Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auditorium Hall C"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsExamFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
