/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AttendanceRecord, ClassElement, LMSLecture, HomeworkAssignment, Student, Teacher, Staff } from "../../types";
import { Check, X, CalendarCheck, ShieldAlert, Award, QrCode, BookOpen, Send, Download, Plus, Video, Play, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AcademicAttendanceProps {
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  classes: ClassElement[];
  attendance: AttendanceRecord[];
  lmsLectures: LMSLecture[];
  homework: HomeworkAssignment[];
  onAddAttendance: (record: AttendanceRecord) => void;
  onAddHomework: (hw: HomeworkAssignment) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
}

export default function AcademicAttendance({
  students,
  teachers,
  staff,
  classes,
  attendance,
  lmsLectures,
  homework,
  onAddAttendance,
  onAddHomework,
  onLogAudit
}: AcademicAttendanceProps) {
  const [activeTab, setActiveTab] = useState<"attendance" | "academics" | "lms" | "homework">("attendance");
  
  // Real-time attendance filters
  const [targetType, setTargetType] = useState<"Student" | "Teacher" | "Staff">("Student");
  const [attendanceDate, setAttendanceDate] = useState("2026-06-11");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrTargetUnitId, setQrTargetUnitId] = useState("");

  // Quiz state
  const [quizResults, setQuizResults] = useState<{ [lectureId: string]: { [questionIdx: number]: number } }>({});
  const [quizVerified, setQuizVerified] = useState<{ [lectureId: string]: boolean }>({});

  // New Homework state
  const [showNewHwModal, setShowNewHwModal] = useState(false);
  const [hwClass, setHwClass] = useState("Class 10-A");
  const [hwSubject, setHwSubject] = useState("Physics");
  const [hwTitle, setHwTitle] = useState("");
  const [hwDesc, setHwDesc] = useState("");
  const [hwDue, setHwDue] = useState("2026-06-18");

  // QR Check-In / Biometric Check-In Handler
  const handleQRCheckIn = (id: string, type: "Student" | "Teacher" | "Staff") => {
    let name = "";
    if (type === "Student") {
      const s = students.find(item => item.id === id);
      if (s) name = s.name;
    } else if (type === "Teacher") {
      const t = teachers.find(item => item.id === id);
      if (t) name = t.name;
    } else {
      const s = staff.find(item => item.id === id);
      if (s) name = s.name;
    }

    if (!name) {
      alert("Invalid ID token scanned. Please select a valid profile from the database.");
      return;
    }

    const checkInRecord: AttendanceRecord = {
      id: `ATT-0${attendance.length + 10}`,
      targetId: id,
      type,
      name,
      date: attendanceDate,
      status: "Present",
      checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      remarks: "QR Badge biometric handshake success"
    };

    onAddAttendance(checkInRecord);
    onLogAudit("QR Attendance Scan", "Attendance Management", `Checked-in ${type} ${name} using bio-secure QR credentials`);
    
    // Close QR Check-In Scanner
    setShowQRScanner(false);
    setQrTargetUnitId("");
  };

  const handleQuickAttendanceMark = (targetId: string, type: "Student" | "Teacher" | "Staff", name: string, status: "Present" | "Absent" | "Late") => {
    const record: AttendanceRecord = {
      id: `ATT-0${attendance.length + 10}`,
      targetId,
      type,
      name,
      date: attendanceDate,
      status,
      checkInTime: status === "Present" || status === "Late" ? "08:15" : undefined,
      remarks: "Manually cataloged by administration officer"
    };
    onAddAttendance(record);
    onLogAudit("Record Attendance", "Attendance Management", `Logged manual attendance status for ${name} as ${status}`);
  };

  const handleQuizAnswer = (lectureId: string, qIdx: number, val: number) => {
    setQuizResults(prev => ({
      ...prev,
      [lectureId]: {
        ...(prev[lectureId] || {}),
        [qIdx]: val
      }
    }));
  };

  const handleVerifyQuiz = (lectureId: string) => {
    setQuizVerified(prev => ({
      ...prev,
      [lectureId]: true
    }));
  };

  const handlePublishHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDesc) return;

    const newHw: HomeworkAssignment = {
      id: `HW-0${homework.length + 12}`,
      className: hwClass,
      subject: hwSubject,
      title: hwTitle,
      description: hwDesc,
      publishedDate: "2026-06-11",
      dueDate: hwDue,
      submissions: []
    };

    onAddHomework(newHw);
    onLogAudit("Publish Homework Assignment", "Homework & Assignments", `Dispatched homework "${hwTitle}" to ${hwClass}`);
    
    // Reset fields
    setHwTitle("");
    setHwDesc("");
    setShowNewHwModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation header */}
      <div className="flex border-b border-gray-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "attendance" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" 
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <CalendarCheck size={16} />
          QR Attendance Records
        </button>
        <button
          onClick={() => setActiveTab("academics")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "academics" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" 
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <BookOpen size={16} />
          Classes & Lesson Plans
        </button>
        <button
          onClick={() => setActiveTab("lms")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "lms" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" 
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Video size={16} />
          Learning Library (LMS)
        </button>
        <button
          onClick={() => setActiveTab("homework")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "homework" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" 
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <FileCheck size={16} />
          Homework & Assignments
        </button>
      </div>

      {/* 1. ATTENDANCE SUB MODULE */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          {/* Section banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">QR / Biometric Smart Handshake Check-In</h3>
              <p className="text-xs text-gray-500">Scan digital QR codes to record immediate gate check-ins, compile monthly statistical sheets, or manually override absence logs.</p>
            </div>
            
            {/* Quick check-in prompt button */}
            <button
              onClick={() => setShowQRScanner(true)}
              className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all text-sm w-fit"
            >
              <QrCode size={15} />
              Open QR Scanner Gate
            </button>
          </div>

          {/* Controls table filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 text-xs">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Roster Pool</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white border border-gray-200 dark:border-slate-800"
              >
                <option value="Student">Students</option>
                <option value="Teacher">Faculty (Teachers)</option>
                <option value="Staff">Operations Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Target Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white border border-gray-200 dark:border-slate-800"
              />
            </div>
            <div className="bg-indigo-50/50 dark:bg-slate-950 p-2 rounded-xl flex items-center justify-between gap-3 text-[11px]">
              <div>
                <span className="block font-bold">Total Scanned Today:</span>
                <span className="text-xs text-indigo-600 block">{attendance.filter(r => r.date === attendanceDate).length} Records</span>
              </div>
              <span className="text-xl">📊</span>
            </div>
          </div>

          {/* Quick Roster Marker Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-slate-950 font-bold text-xs flex justify-between items-center border-b border-gray-150">
              <span>Active {targetType} Enrollment</span>
              <span className="text-gray-400">Date: {attendanceDate}</span>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400">
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Current Attendance status for: {attendanceDate}</th>
                    <th className="p-4 text-right">Actions / Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                  {/* Students list */}
                  {targetType === "Student" && students.map(s => {
                    const logged = attendance.find(a => a.targetId === s.id && a.date === attendanceDate);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/30">
                        <td className="p-4 font-mono font-bold text-indigo-500">{s.id}</td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900 dark:text-white">{s.name}</span>
                          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded ml-2 text-[10px] text-gray-600 dark:text-gray-400">{s.className} - {s.section}</span>
                        </td>
                        <td className="p-4">
                          {logged ? (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              logged.status === "Present" ? "bg-emerald-100 text-emerald-800" :
                              logged.status === "Late" ? "bg-amber-100 text-amber-800" :
                              "bg-rose-100 text-rose-800"
                            }`}>
                              ● {logged.status} {logged.checkInTime ? `(${logged.checkInTime})` : ""}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not Checked In Yet</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleQuickAttendanceMark(s.id, "Student", s.name, "Present")}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold active:opacity-80"
                          >
                            Mark Present
                          </button>
                          <button
                            onClick={() => handleQuickAttendanceMark(s.id, "Student", s.name, "Absent")}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-2.5 py-1 rounded-lg font-semibold active:opacity-80"
                          >
                            Mark Absent
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Teachers list */}
                  {targetType === "Teacher" && teachers.map(t => {
                    const logged = attendance.find(a => a.targetId === t.id && a.date === attendanceDate);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/30">
                        <td className="p-4 font-mono font-bold text-indigo-500">{t.id}</td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900 dark:text-white">{t.name}</span>
                          <span className="block text-[10px] text-gray-400">{t.designation}</span>
                        </td>
                        <td className="p-4">
                          {logged ? (
                            <span className="bg-emerald-100 text-emerald-800 px-2 rounded-full font-bold">● {logged.status} ({logged.checkInTime})</span>
                          ) : (
                            <span className="text-gray-400 italic">No entry logs reported</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleQuickAttendanceMark(t.id, "Teacher", t.name, "Present")}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md"
                          >
                            Manual Flag Present
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACADEMICS & LESSON PLANNERS MODULE */}
      {activeTab === "academics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map(c => (
              <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900 dark:text-white">{c.name} - Section {c.section}</h4>
                    <span className="text-[10px] text-gray-400 block uppercase">Standard Location: Room {c.roomNo}</span>
                  </div>
                  <span className="bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-md text-xs">
                    {c.studentsCount} Students
                  </span>
                </div>

                <div className="border-t border-gray-50 mt-4 pt-3 space-y-2 text-xs">
                  <div className="font-semibold text-gray-400 block uppercase tracking-wider text-[10px]">Academic Curriculum Subjects:</div>
                  <div className="space-y-1.5 shadow-inner p-2 rounded-lg bg-gray-50 dark:bg-slate-950">
                    {c.subjects.map((subj, s_idx) => {
                      const tea = teachers.find(t => t.id === subj.teacherId);
                      return (
                        <div key={s_idx} className="flex justify-between items-center text-[11.5px]">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{subj.name}</span>
                          <span className="text-gray-405 text-xs">By {tea ? tea.name : "Unallocated"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-gray-400 block uppercase tracking-wider text-[10px]">Syllabus tracking progress:</div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: c.name === "Class 10" ? "74%" : "48%" }} />
                  </div>
                  <span className="text-[10px] text-emerald-600 block text-right font-semibold">
                    {c.name === "Class 10" ? "74% Syllabus Completed" : "48% Syllabus Completed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LMS MODULE */}
      {activeTab === "lms" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lmsLectures.map(lec => (
              <div key={lec.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Subject and tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold tracking-widest px-2.5 py-1 rounded uppercase">
                      {lec.subject}
                    </span>
                    {lec.hasVirtualClass && (
                      <span className="flex items-center gap-1 text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                        <Video size={10} /> Live: Today at 10:00 AM
                      </span>
                    )}
                  </div>

                  {/* Lecture description details */}
                  <div>
                    <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">{lec.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lec.description}</p>
                  </div>

                  {/* Live video player card representation */}
                  {lec.videoUrl ? (
                    <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center group cursor-pointer border border-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] text-gray-400 font-mono">Chapter Study Guide Session video</span>
                        <span className="text-xs text-slate-100 font-bold">{lec.title}</span>
                      </div>
                      <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white group-hover:scale-110 active:scale-95 transition-all">
                        <Play fill="currentColor" size={20} />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50/50 dark:bg-slate-950/40 rounded-xl text-center border text-[11px] text-amber-800 dark:text-indigo-400 font-semibold">
                      🎥 This session is a standard classroom seminar. Study slide files are provided below.
                    </div>
                  )}

                  {/* Study PDF List */}
                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-gray-400 block uppercase tracking-wider text-[9px]">Study Handouts:</div>
                    {lec.studyMaterials.map((file, f_idx) => (
                      <div key={f_idx} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-slate-950">
                        <span className="font-medium text-gray-700 dark:text-zinc-200">{file.name} ({file.size})</span>
                        <a href="#download" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 text-[11px]">
                          <Download size={11} /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Micro Quiz Area */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-850 space-y-3">
                  <h5 className="font-bold text-xs uppercase text-zinc-500 flex items-center gap-1">
                    <Award size={13} className="text-indigo-500" /> Topic Practice Quiz Check
                  </h5>
                  {lec.quizzes.map((q, q_idx) => {
                    const selectedOpt = quizResults[lec.id]?.[q_idx];
                    const isCorrect = selectedOpt === q.answerIndex;
                    const verified = quizVerified[lec.id];

                    return (
                      <div key={q_idx} className="p-3 bg-zinc-50 dark:bg-slate-950 rounded-xl space-y-2 text-xs">
                        <div className="font-semibold text-gray-800 dark:text-zinc-200">{q.question}</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {q.options.map((opt, o_idx) => (
                            <button
                              key={o_idx}
                              onClick={() => handleQuizAnswer(lec.id, q_idx, o_idx)}
                              className={`p-2 rounded-lg text-left text-[11px] ${
                                selectedOpt === o_idx
                                  ? verified
                                    ? isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                    : "bg-indigo-600 text-white"
                                  : "bg-white dark:bg-slate-900 border hover:bg-zinc-100"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {verified && (
                          <div className={`mt-1 font-bold text-[10px] ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                            {isCorrect ? "✓ Correct Answer!" : `✗ Incorrect (Correct is: ${q.options[q.answerIndex]})`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!quizVerified[lec.id] && (
                    <button
                      onClick={() => handleVerifyQuiz(lec.id)}
                      className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-900 text-white rounded-lg text-xs font-bold transition-all active:scale-95"
                    >
                      Audit Quiz Answers
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HOMEWORK SUB MODULE */}
      {activeTab === "homework" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Homework & Assignment Distribution</h3>
              <p className="text-xs text-gray-500">Coordinate and publish structured tasks, define due date structures, and manage graded submissions.</p>
            </div>
            <button
              onClick={() => setShowNewHwModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm cursor-pointer active:scale-95 transition-all w-fit"
            >
              <Plus size={14} /> Add Homework
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {homework.map(hw_item => (
              <div key={hw_item.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold px-2 py-0.5 rounded tracking-wide font-mono mr-2">
                      {hw_item.id}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium px-2 py-0.5 rounded">
                      {hw_item.className} • {hw_item.subject}
                    </span>
                    <h4 className="font-extrabold text-base text-gray-900 dark:text-white mt-1.5">{hw_item.title}</h4>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold block uppercase">Due: {hw_item.dueDate}</span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                  {hw_item.description}
                </p>

                {/* Submissions Log inside cards */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">Students Submissions Tracker:</div>
                  <div className="space-y-1.5">
                    {hw_item.submissions.map((sub, s_idx) => (
                      <div key={s_idx} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-slate-950">
                        <div>
                          <span className="font-semibold block">{sub.studentName}</span>
                          <span className="text-[9px] text-zinc-400 font-mono">Date: {sub.submittedDate} • File: {sub.filePath}</span>
                        </div>
                        {sub.grade ? (
                          <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 font-bold px-2 py-0.5 rounded text-[10px]">
                            Grades: {sub.grade}
                          </span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 font-medium px-2 py-0.5 rounded text-[10px]">
                            Awaiting Grade
                          </span>
                        )}
                      </div>
                    ))}
                    {hw_item.submissions.length === 0 && (
                      <p className="text-[11px] text-zinc-400 italic">No students submissions reported for this assignment yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR GATE SCANNER MODAL */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6 relative border border-slate-800"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-base text-white">Biometric QR Gate Check-In</h4>
                <p className="text-[10px] text-gray-400 tracking-wider">SECURE CAMPUS GATES DEPUTY CAMERA</p>
              </div>
              <button onClick={() => setShowQRScanner(false)} className="p-1 rounded-full bg-slate-900 text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Simulated Live Camera with scan grids */}
            <div className="aspect-square bg-slate-900 border-2 border-indigo-500/50 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center">
              <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-[1px] animate-pulse" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br" />

              {/* Scanning visual overlay bar */}
              <div className="w-full h-1 bg-indigo-500 absolute top-0 shadow-[0_0_15px_#6366f1] animate-bounce" style={{ animationDuration: '3s' }} />

              <QrCode size={96} strokeWidth={1} className="text-indigo-400/30" />
              <p className="absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] text-gray-400 select-none">CAMERA FEED ACTIVE • WAITING FOR ID PIN SCAN</p>
            </div>

            {/* Quick selectors for simulation */}
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase text-gray-400 font-bold block">Quick Simulate Card scan:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQRCheckIn("STU-001", "Student")}
                  className="p-2 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-gray-300 font-mono text-[10px] rounded-lg transition-all"
                >
                  Scan STU-001 (Aarav S.)
                </button>
                <button
                  type="button"
                  onClick={() => handleQRCheckIn("STU-002", "Student")}
                  className="p-2 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-gray-300 font-mono text-[10px] rounded-lg transition-all"
                >
                  Scan STU-002 (Aniket P.)
                </button>
                <button
                  type="button"
                  onClick={() => handleQRCheckIn("TEA-001", "Teacher")}
                  className="p-2 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-gray-300 font-mono text-[10px] rounded-lg transition-all"
                >
                  Scan TEA-001 (Aditi M.)
                </button>
                <button
                  type="button"
                  onClick={() => handleQRCheckIn("STF-001", "Staff")}
                  className="p-2 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-gray-300 font-mono text-[10px] rounded-lg transition-all"
                >
                  Scan STF-001 (Rajesh Y.)
                </button>
              </div>
            </div>

            <p className="text-[9px] text-gray-400 text-center select-none uppercase tracking-widest">Powered by Local RFID / Biometric Gate handshake APIs</p>
          </motion.div>
        </div>
      )}

      {/* NEW HOMEWORK MODAL */}
      {showNewHwModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl relative text-sm dark:text-white"
          >
            <div className="flex justify-between items-center pb-4 border-b">
              <h4 className="font-bold text-gray-900 dark:text-white">Distribute New Homework</h4>
              <button onClick={() => setShowNewHwModal(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handlePublishHomework} className="space-y-4 pt-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Target Class *</label>
                <select
                  value={hwClass}
                  onChange={(e) => setHwClass(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none"
                >
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Class 10-B">Class 10-B</option>
                  <option value="Class 9-A">Class 9-A</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Subject Assignment *</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="World History">World History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="e.g. Einstein's Special Relativity Concepts"
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Detailed Instructions / Questions *</label>
                <textarea
                  required
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Submission Deadline *</label>
                <input
                  type="date"
                  required
                  value={hwDue}
                  onChange={(e) => setHwDue(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold hover:translate-y-[-1px] transition-all"
              >
                Dispatch Assignment
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
