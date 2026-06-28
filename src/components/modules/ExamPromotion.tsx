/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ExamRecord, Student } from "../../types";
import { Search, Trophy, Landmark, GraduationCap, Plus, ArrowRight, UserCheck, Calculator, Star, ShieldAlert, X } from "lucide-react";
import { motion } from "motion/react";

interface ExamPromotionProps {
  students: Student[];
  examRecords: ExamRecord[];
  onAddExamRecord: (record: ExamRecord) => void;
  onUpdateExamRecord: (id: string, updated: Partial<ExamRecord>) => void;
  onUpdateStudent: (id: string, updated: Partial<Student>) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
}

export default function ExamPromotion({
  students,
  examRecords,
  onAddExamRecord,
  onUpdateExamRecord,
  onUpdateStudent,
  onLogAudit,
  isDarkMode
}: ExamPromotionProps) {
  const [activeTab, setActiveTab] = useState<"exams" | "merit" | "promotion">("exams");

  // New Exam schedule states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [examClass, setExamClass] = useState("Class 10");
  const [examSubj, setExamSubj] = useState("Physics");
  const [examDate, setExamDate] = useState("2026-07-15");

  // Marks entering states
  const [selectedExamId, setSelectedExamId] = useState("");
  const [editingMarksExam, setEditingMarksExam] = useState<ExamRecord | null>(null);

  // New marks form inputs
  const [marksState, setMarksState] = useState<{ [studentId: string]: string }>({});

  const handleScheduleExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle) return;

    const newPrac: ExamRecord = {
      id: `EXM-0${examRecords.length + 10}`,
      title: examTitle,
      className: examClass,
      subject: examSubj,
      examDate: examDate,
      maxMarks: 100,
      marksEntered: [],
      published: false
    };

    onAddExamRecord(newPrac);
    onLogAudit("Schedule Examination Period", "Examination Management", `Scheduled new standardized test "${examTitle}" for class ${examClass} on ${examDate}`);
    
    // Reset
    setExamTitle("");
    setShowScheduleModal(false);
  };

  const startMarksEntry = (exam: ExamRecord) => {
    setEditingMarksExam(exam);
    const initialMarks: { [studentId: string]: string } = {};
    students.filter(s => s.className === exam.className).forEach(s => {
      const existing = exam.marksEntered.find(m => m.studentId === s.id);
      initialMarks[s.id] = existing ? String(existing.marksObtained) : "";
    });
    setMarksState(initialMarks);
  };

  const handleSaveMarks = () => {
    if (!editingMarksExam) return;

    const marksEnteredList = Object.entries(marksState).map(([studentId, scoreStr]) => {
      const score = Number(scoreStr) || 0;
      let grade = "F";
      if (score >= 90) grade = "A+";
      else if (score >= 80) grade = "A";
      else if (score >= 70) grade = "B";
      else if (score >= 60) grade = "C";
      else if (score >= 50) grade = "D";

      return { studentId, marksObtained: score, grade };
    });

    onUpdateExamRecord(editingMarksExam.id, {
      marksEntered: marksEnteredList,
      published: true
    });

    // Dynamically calculate and update student GPA averages based on their score entries
    marksEnteredList.forEach(item => {
      const student = students.find(s => s.id === item.studentId);
      if (student) {
        // Average with prior average or override for realism
        const newGpa = Math.floor((student.gradePerformance + item.marksObtained) / 2);
        onUpdateStudent(item.studentId, { gradePerformance: newGpa });
      }
    });

    onLogAudit("Submit Marks Entry", "Examination Management", `Logged customized term results database block for EXM Code: ${editingMarksExam.id}`);
    
    setEditingMarksExam(null);
  };

  const handleBatchPromotion = (fromClass: string, toClass: string) => {
    const classStu = students.filter(s => s.className === fromClass && s.status === "Active");
    let promotedCount = 0;
    let failedCount = 0;

    classStu.forEach(s => {
      if (s.gradePerformance >= 50) {
        onUpdateStudent(s.id, { className: toClass, pendingFees: s.pendingFees + 500 });
        promotedCount++;
      } else {
        failedCount++;
      }
    });

    onLogAudit("Batch Student Promotion", "Promotion Management", `Executed batch graduation for ${fromClass} to ${toClass}. Passed: ${promotedCount}, Retained: ${failedCount}`);
    alert(`Batch Promotion Complete!\n\nPromoted: ${promotedCount} Students to ${toClass}\nFailed / Retained: ${failedCount} (Averages below 50% threshold)`);
  };

  // Compile merit database rankings based on current GPA averages
  const meritList = [...students]
    .sort((a, b) => b.gradePerformance - a.gradePerformance);

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs text-slate-800 dark:text-white">
        <button
          onClick={() => setActiveTab("exams")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "exams" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Landmark size={14} />
          Scheduling & Marks Entry
        </button>
        <button
          onClick={() => setActiveTab("merit")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "merit" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Trophy size={14} />
          Merit Lists & Rankings
        </button>
        <button
          onClick={() => setActiveTab("promotion")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "promotion" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <GraduationCap size={14} />
          Batch Promotion Portal
        </button>
      </div>

      {/* 1. EXAMINATIONS TABLE AND RESULT SCRIBE SUB TAB */}
      {activeTab === "exams" && (
        <div className="space-y-6 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Exam schedules & Mark entries</h3>
              <p className="text-xs text-gray-400">Establish upcoming tests, configure grade scales, and input standardized result metrics.</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit"
            >
              <Plus size={14} /> Schedule New Term Exam
            </button>
          </div>

          {/* Exam listings card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examRecords.map(ex => (
              <div key={ex.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-zinc-500 font-bold px-2 py-0.5 rounded mr-2 uppercase">
                      {ex.id}
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded">
                      {ex.className} • {ex.subject}
                    </span>
                    <h4 className="font-extrabold text-base text-gray-950 dark:text-white mt-1.5">{ex.title}</h4>
                  </div>
                  <span className="text-[10px] text-zinc-400 block font-bold font-mono uppercase">{ex.examDate}</span>
                </div>

                <div className="border-t pt-3 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Class: {ex.className}</span>
                  {ex.published ? (
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-990/30 font-bold px-2.5 py-0.5 rounded-full">
                      ● Grading Output Live
                    </span>
                  ) : (
                    <span className="text-amber-600 bg-amber-50 dark:bg-amber-990/30 font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                      ● Slated (No Marks Entered)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => startMarksEntry(ex)}
                  className="w-full py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-slate-100 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {ex.published ? "Modify Grade Sheets" : "Scribe Student Marks"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MERIT LIST / RANK CALCULATION SUB TAB */}
      {activeTab === "merit" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Academic Merit Registry & Honor Roll Rankings</h3>
            <p className="text-zinc-400 font-medium">Auto-derived ranks compiled based on standard grade averages.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-450 uppercase text-[10px]">
                  <th className="p-3">Rank No</th>
                  <th className="p-3">Pupil Name</th>
                  <th className="p-3">Standard Class</th>
                  <th className="p-3">CGPA Percentage Index</th>
                  <th className="p-3">Attendance Index</th>
                  <th className="p-3 text-right">Academic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-850">
                {meritList.map((m_stu, idx) => (
                  <tr key={m_stu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${
                        idx === 0 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        idx === 1 ? "bg-slate-100 text-slate-800 border" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-gray-900 dark:text-white">{m_stu.name}</span>
                      <span className="text-[10px] block text-zinc-400 font-mono">Admission ID: {m_stu.id}</span>
                    </td>
                    <td className="p-3 font-semibold text-gray-700 dark:text-zinc-300">{m_stu.className} - {m_stu.section}</td>
                    <td className="p-3 text-emerald-600 font-black">{m_stu.gradePerformance}% Average</td>
                    <td className="p-3 font-mono text-zinc-400">{m_stu.attendanceRate}%</td>
                    <td className="p-3 text-right">
                      {m_stu.gradePerformance >= 90 ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">Summa Cum Laude</span>
                      ) : m_stu.gradePerformance >= 75 ? (
                        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded text-[10px]">Pass with Distinction</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">Satisfactory</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BATCH PROMOTIONS SUB TAB */}
      {activeTab === "promotion" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs text-slate-800 dark:text-white">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Batch Graduation and promotion portal</h3>
            <p className="text-zinc-400">Transition entire class structures to the next tier based on minimum grade thresholds. Keeps safety rules active to prevent failing candidates from passing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-gray-50 dark:bg-slate-950 p-5 rounded-3xl border border-gray-200/60 shadow-inner space-y-4">
              <h4 className="font-bold text-indigo-600 flex items-center gap-1">
                <GraduationCap size={16} /> Standard Promotion Formula
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Applying promotions checks each child's historical Term CGPA. Candidates with a Grade Performance below <strong>50%</strong> are automatically retained in their current class; all passing records are elevated to the configured subsequent tier.
              </p>
              <div className="grid grid-cols-2 gap-3 text-semibold">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Source Class</span>
                  <span className="font-bold text-gray-900 dark:text-white">Class 9</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Target Class</span>
                  <span className="font-bold text-gray-900 dark:text-white">Class 10</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleBatchPromotion("Class 9", "Class 10")}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md rounded-xl text-center flex items-center justify-center gap-1 active:scale-95"
              >
                Promote Qualified Class 9 candidates <ArrowRight size={13} />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-slate-950 p-5 rounded-3xl border border-gray-200/60 shadow-inner space-y-4">
              <h4 className="font-bold text-emerald-600 flex items-center gap-1">
                <UserCheck size={16} /> Secondary Graduation Trigger
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Applies to high-tier school candidates. Elevating Class 10 graduates them permanently out of the system rosters into the "Graduated" database archive ledger and issues digital leaving certificates.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Source Class</span>
                  <span className="font-bold text-gray-900 dark:text-white">Class 10</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Target Class Status</span>
                  <span className="font-bold text-emerald-600">Graduated Alumni</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleBatchPromotion("Class 10", "Alumni")}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all cursor-pointer shadow"
              >
                Graduate Qualified Class 10 Alumni
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARKS EDITOR INLINE SUB DIALOG MODAL */}
      {editingMarksExam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl relative ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="pb-4 border-b flex justify-between items-center">
              <div>
                <h4 className="font-bold text-indigo-650">Recording Marks Entry</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Exam title: {editingMarksExam.title} (Max: {editingMarksExam.maxMarks} Marks)</p>
              </div>
              <button onClick={() => setEditingMarksExam(null)} className="p-1 rounded hover:bg-slate-100">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 pt-4 max-h-[50vh] overflow-y-auto">
              {students.filter(s => s.className === editingMarksExam.className).map(s => (
                <div key={s.id} className="flex justify-between items-center p-2 rounded-xl bg-gray-50 dark:bg-slate-950 border">
                  <div>
                    <span className="font-bold block">{s.name}</span>
                    <span className="text-[9px] text-zinc-400 font-mono">Admission ID: {s.id}</span>
                  </div>
                  <input
                    type="number"
                    max={editingMarksExam.maxMarks}
                    min={0}
                    value={marksState[s.id] || ""}
                    onChange={(e) => setMarksState({ ...marksState, [s.id]: e.target.value })}
                    placeholder="Marks scale"
                    className="p-1.5 w-24 text-center rounded bg-white border border-gray-200 font-bold focus:outline-none dark:text-gray-900 text-xs"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveMarks}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all text-xs flex items-center justify-center gap-1"
            >
              <Calculator size={14} /> Commit Grade Entries
            </button>
          </motion.div>
        </div>
      )}

      {/* SCHEDULE TERM MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl relative ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="pb-4 border-b flex justify-between items-center">
              <h4 className="font-bold">Schedule Term Exam</h4>
              <button onClick={() => setShowScheduleModal(false)} className="p-1.5 rounded hover:bg-slate-100">
                Cancel
              </button>
            </div>
            <form onSubmit={handleScheduleExam} className="space-y-4 pt-4">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-semibold uppercase">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Term 2 General Science Quiz"
                  className="w-full p-2.5 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl font-medium focus:outline-none focus:ring-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Target Class *</label>
                  <select
                    value={examClass}
                    onChange={(e) => setExamClass(e.target.value)}
                    className="w-full p-2 border rounded-xl dark:bg-slate-950"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Standard Subject *</label>
                  <select
                    value={examSubj}
                    onChange={(e) => setExamSubj(e.target.value)}
                    className="w-full p-2 border rounded-xl dark:bg-slate-950"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="World History">World History</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Scheduled Date *</label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full p-2 border rounded-xl dark:bg-slate-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Commit Exam to Academic Board
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
