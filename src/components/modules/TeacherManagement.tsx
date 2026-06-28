/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Teacher } from "../../types";
import { Search, UserPlus, Award, Calendar, DollarSign, Star, MoreVertical, Edit, Trash, CheckCircle, BookOpen, Clock, X } from "lucide-react";
import { motion } from "motion/react";

interface TeacherProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (id: string, updated: Partial<Teacher>) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
}

export default function TeacherManagement({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onLogAudit,
  isDarkMode
}: TeacherProps) {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTimetableTeacher, setActiveTimetableTeacher] = useState<Teacher | null>(null);

  // New Teacher form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("5500");
  const [subjects, setSubjects] = useState("Physics, Mathematics");
  const [classes, setClasses] = useState("Class 10-A, Class 9-A");

  // Allocate extra timetable slot fields
  const [newDay, setNewDay] = useState<any>("Monday");
  const [newPeriod, setNewPeriod] = useState("Period 1 (08:30 - 09:15)");
  const [newClass, setNewClass] = useState("Class 10-A");
  const [newSubj, setNewSubj] = useState("General Science");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const parsedSubjects = subjects.split(",").map(s => s.trim()).filter(Boolean);
    const parsedClasses = classes.split(",").map(c => c.trim()).filter(Boolean);

    const newTea: Teacher = {
      id: `TEA-0${teachers.length + 10}`,
      name,
      email,
      phone: phone || "+1 (555) 000-111",
      qualification: qualification || "M.Ed. / Academic Specialist",
      designation: designation || "Senior Lecturer",
      status: "Active",
      subjectAllocation: parsedSubjects,
      classAllocation: parsedClasses,
      salary: Number(salary) || 5000,
      rating: 4.8,
      attendanceRate: 100.0,
      leavesApplied: 0,
      leavesApproved: 0,
      timetable: [
        { day: "Monday", period: "Period 1 (08:30 - 09:15)", class: "Class 10-A", subject: parsedSubjects[0] || "General Studies" }
      ]
    };

    onAddTeacher(newTea);
    onLogAudit("Register Teacher", "Teacher Management", `Added new educator profile ${newTea.name}, with specialization: ${parsedSubjects.join(", ")}`);
    
    // Reset Form
    setName("");
    setEmail("");
    setPhone("");
    setQualification("");
    setDesignation("");
    setSalary("5500");
    setSubjects("Physics, Mathematics");
    setClasses("Class 10-A, Class 9-A");
    setShowAddModal(false);
  };

  const addTimetableSlot = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const newSlot = { day: newDay, period: newPeriod, class: newClass, subject: newSubj };
    const updatedTimetable = [...teacher.timetable, newSlot];
    
    onUpdateTeacher(teacherId, { timetable: updatedTimetable });
    onLogAudit("Modify Timetable Schedule", "Academic Management", `Allocated new timetable slot for ${teacher.name} on ${newDay} at ${newPeriod}`);
    
    // Refresh modal focus reference
    setActiveTimetableTeacher({ ...teacher, timetable: updatedTimetable });
  };

  const removeTimetableSlot = (teacherId: string, index: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    const updatedTimetable = teacher.timetable.filter((_, idx) => idx !== index);
    onUpdateTeacher(teacherId, { timetable: updatedTimetable });
    onLogAudit("Remove Schedule Period", "Academic Management", `Dismissed schedule period index ${index} for ${teacher.name}`);
    
    setActiveTimetableTeacher({ ...teacher, timetable: updatedTimetable });
  };

  const handleUpdateStatus = (id: string, status: "Active" | "On Leave" | "Suspended") => {
    onUpdateTeacher(id, { status });
    onLogAudit("Update Teacher Status", "Teacher Management", `Modified status of teacher ${id} to ${status}`);
  };

  const filtered = teachers.filter(t => {
    const sLower = search.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(sLower) || 
                          t.id.toLowerCase().includes(sLower) || 
                          t.email.toLowerCase().includes(sLower);
    const matchesSubject = selectedSubject === "All" || t.subjectAllocation.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Faculty & Timetables</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review teacher registrations, manage academic subject catalogs, track attendance statistics, and modify live weekly periods.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:translate-y-[-1px] active:scale-95 transition-all text-sm w-fit animate-fade-in"
        >
          <UserPlus size={16} />
          Add Faculty Profile
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search our educational faculty by name, qualification, email or teacher ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
          />
        </div>
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-gray-200"
          >
            <option value="All">All Subjects Allocated</option>
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="World History">World History</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Robotics">Robotics</option>
          </select>
        </div>
      </div>

      {/* Grid of beautiful high-profile cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover-glow transition-all">
            <div className="space-y-4">
              {/* Badge designation & status toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-gray-600 dark:text-gray-300 font-bold tracking-widest px-2.5 py-1 rounded-md uppercase">
                  {t.id}
                </span>
                <select
                  value={t.status}
                  onChange={(e) => handleUpdateStatus(t.id, e.target.value as any)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border-none cursor-pointer focus:outline-none ${
                    t.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" :
                    t.status === "On Leave" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400" :
                    "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Avatar and Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xl border border-indigo-100 dark:border-indigo-900">
                  {t.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.designation}</p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{t.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-50 dark:border-slate-850 pt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-300">
                  <Award className="text-indigo-500" size={13} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Credentials:</span> {t.qualification}
                </div>

                {/* Badges parameters */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-gray-400 font-semibold">Allocated Classes:</div>
                  <div className="flex flex-wrap gap-1">
                    {t.classAllocation.map((c, i) => (
                      <span key={i} className="text-[10px] bg-slate-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 font-medium px-2 py-0.5 rounded-md border border-gray-100 dark:border-slate-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-gray-400 font-semibold font-mono">Specialist Subjects:</div>
                  <div className="flex flex-wrap gap-1">
                    {t.subjectAllocation.map((s, i) => (
                      <span key={i} className="text-[10px] bg-indigo-50/40 dark:bg-indigo-950/20 text-gray-700 dark:text-zinc-200 px-2 py-0.5 rounded-md border border-indigo-100/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics & Actions bottom area */}
            <div className="mt-4 border-t border-gray-50 dark:border-slate-850 pt-3 flex items-center justify-between text-xs">
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="bg-gray-50 dark:bg-slate-950 p-2 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">Rating</span>
                  <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    <Star size={11} fill="currentColor" /> {t.rating}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-slate-950 p-2 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-mono text-gray-400 block">Salary</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">${t.salary}</span>
                </div>
                <button
                  onClick={() => setActiveTimetableTeacher(t)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center py-2 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
                >
                  <Calendar size={12} className="mb-0.5" />
                  <span className="text-[9px] font-bold">Schedule</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center p-12 bg-white dark:bg-slate-900 rounded-3xl text-gray-400">
            No matching educators or subject allocations found in our rosters.
          </div>
        )}
      </div>

      {/* Schedule / Timetable editor panel modal */}
      {activeTimetableTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            {/* Modal Heading */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Timetable Scheduler & Periods</h3>
                <p className="text-xs text-gray-500">Configuring weekly period allocations for {activeTimetableTeacher.name}</p>
              </div>
              <button onClick={() => setActiveTimetableTeacher(null)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-850">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Add New timetable period inline */}
              <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-200/50 dark:border-slate-800/40 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 block">Allocate New Session Period</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Weekday *</label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Period / Slot Time *</label>
                    <select
                      value={newPeriod}
                      onChange={(e) => setNewPeriod(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700"
                    >
                      <option value="Period 1 (08:30 - 09:15)">Period 1 (08:30 - 09:15)</option>
                      <option value="Period 2 (09:15 - 10:00)">Period 2 (09:15 - 10:00)</option>
                      <option value="Period 3 (10:00 - 10:45)">Period 3 (10:00 - 10:45)</option>
                      <option value="Period 4 (10:45 - 11:30)">Period 4 (10:45 - 11:30)</option>
                      <option value="Afternoon Lab (13:30 - 15:00)">Afternoon Lab (13:30 - 15:00)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Assigned Class *</label>
                    <input
                      type="text"
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Specialist Subject *</label>
                    <input
                      type="text"
                      value={newSubj}
                      onChange={(e) => setNewSubj(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => addTimetableSlot(activeTimetableTeacher.id)}
                  className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-xs"
                >
                  Commit Schedule Linkage
                </button>
              </div>

              {/* Active Timetable Slots Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Assigned Periods Roster</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {activeTimetableTeacher.timetable.map((t_time, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-slate-50 relative group">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          <Clock size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{t_time.subject} - {t_time.class}</div>
                          <div className="text-[10px] text-gray-400">{t_time.day} • {t_time.period}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTimetableSlot(activeTimetableTeacher.id, idx)}
                        className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Delete slot"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                  {activeTimetableTeacher.timetable.length === 0 && (
                    <p className="col-span-2 text-center py-6 text-gray-400">This educator currently has no active weekly periods assigned.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-slate-950 flex items-center justify-end">
              <button
                onClick={() => setActiveTimetableTeacher(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-medium"
              >
                Close Timetable
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Faculty Profile modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-xl rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">New Teacher Intake Form</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-850">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4 text-sm max-h-[75\vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Educator Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Mary Curie"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.curie@school.edu"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 0192-332"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Degree Credentials & Ph.D. *</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="Ph.D. in Radiochemistry, Sorbonne"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Designation Role *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Professor, Department Chair"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Starting Basic Salary ($) *</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Subject Specialization *</label>
                  <input
                    type="text"
                    required
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    placeholder="Physics, Quantum Theory"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Class Allocations *</label>
                  <input
                    type="text"
                    required
                    value={classes}
                    onChange={(e) => setClasses(e.target.value)}
                    placeholder="Class 10-A, Class 9-B"
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-gray-500 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Onboard Faculty
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
