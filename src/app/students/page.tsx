"use client";

import React, { useState } from 'react';
import { useDb } from '../../hooks/useDb';
import { Student } from '../../types';

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent, isLoaded } = useDb();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [course, setCourse] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Female');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter students based on search and department
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || student.department === deptFilter;
    
    return matchesSearch && matchesDept;
  });

  const getUniqueDepartments = () => {
    const depts = new Set(students.map((s) => s.department));
    return ['All', ...Array.from(depts)];
  };

  const handleOpenAddForm = () => {
    setEditingStudent(null);
    setName('');
    setRollNumber(`CS2026${String(students.length + 1).padStart(3, '0')}`);
    setEmail('');
    setDepartment('Computer Science');
    setCourse('');
    setPhone('');
    setGender('Female');
    setStatus('Active');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setEmail(student.email);
    setDepartment(student.department);
    setCourse(student.course);
    setPhone(student.phone);
    setGender(student.gender);
    setStatus(student.status);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNumber || !email || !course) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingStudent) {
      updateStudent({
        id: editingStudent.id,
        name,
        rollNumber,
        email,
        department,
        course,
        phone,
        gender,
        status,
      });
    } else {
      addStudent({
        name,
        rollNumber,
        email,
        department,
        course,
        phone,
        gender,
        status,
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 border border-slate-800 p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white">Student Registry</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, search, and register student accounts in the local directory.</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register Student
        </button>
      </div>

      {/* Filters & Actions Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, roll number, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/40 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 shrink-0">Department:</label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            {getUniqueDepartments().map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Register/Edit Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="text-sm font-bold text-white">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Michael Scott"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0100"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Course Program *</label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Sc. Computer Science"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === 'Female'}
                        onChange={() => setGender('Female')}
                        className="accent-teal-500"
                      />
                      Female
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === 'Male'}
                        onChange={() => setGender('Male')}
                        className="accent-teal-500"
                      />
                      Male
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Academic Status</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={status === 'Active'}
                        onChange={() => setStatus('Active')}
                        className="accent-teal-500"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={status === 'Inactive'}
                        onChange={() => setStatus('Inactive')}
                        className="accent-teal-500"
                      />
                      Inactive
                    </label>
                  </div>
                </div>
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
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student List Table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-3">
            <svg className="w-12 h-12 mx-auto text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs">No registered students found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/60 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roll Number</th>
                  <th className="px-6 py-4">Department & Course</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-xs">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-900/30 transition-colors">
                    {/* Student Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          student.gender === 'Female' ? 'bg-teal-500/10 text-teal-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <span className="text-[10px] text-slate-500">{student.gender}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Roll Number */}
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-300">
                      {student.rollNumber}
                    </td>

                    {/* Department & Course */}
                    <td className="px-6 py-4">
                      <p className="text-slate-350">{student.department}</p>
                      <span className="text-[10px] text-slate-500">{student.course}</span>
                    </td>

                    {/* Contact Details */}
                    <td className="px-6 py-4 text-[11px] text-slate-400">
                      <p>{student.email}</p>
                      <p className="mt-0.5 text-slate-500">{student.phone || 'N/A'}</p>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        student.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Actions dropdown/buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditForm(student)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-teal-400 transition-colors"
                          title="Edit Student"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove student "${student.name}"? This will clear all their exam marks and room allocations.`)) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-red-900 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Student"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
