/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student } from "../../types";
import { Search, UserPlus, FileText, CheckCircle, Clock, Eye, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeDefinition } from "../../themeConfig";

interface StudentProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (id: string, updated: Partial<Student>) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
  currentTheme: ThemeDefinition;
}

export default function StudentManagement({
  students,
  onAddStudent,
  onUpdateStudent,
  onLogAudit,
  isDarkMode,
  currentTheme
}: StudentProps) {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showIDCard, setShowIDCard] = useState<Student | null>(null);

  // New Student Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newParent, setNewParent] = useState("");
  const [newParentPhone, setNewParentPhone] = useState("");
  const [newClass, setNewClass] = useState("Class 10");
  const [newSection, setNewSection] = useState("A");
  const [newBlood, setNewBlood] = useState("O+");
  const [newMedical, setNewMedical] = useState("None");
  const [newAddress, setNewAddress] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const computedEmail = newEmail || `${newName.toLowerCase().replace(/\s+/g, "") || "student"}@school.edu`;

    const newStu: Student = {
      id: `STU-0${students.length + 12}`,
      name: newName,
      email: computedEmail,
      phone: newPhone || "+1 (555) 0100-200",
      admissionNo: `ADM-2026-0${students.length + 10}`,
      className: newClass,
      section: newSection,
      parentName: newParent || "Not Provided",
      parentPhone: newParentPhone || "+1 (555) 0100-201",
      parentEmail: `${newParent.toLowerCase().replace(/\s+/g, "") || "parent"}@gmail.com`,
      address: newAddress || "Main Campus Hostel",
      dob: "2011-01-01",
      bloodGroup: newBlood,
      medicalConditions: newMedical,
      documents: [
        { title: "Admission Acceptance Document", url: "#", status: "Verified" },
        { title: "National ID / Registration Certificate", url: "#", status: "Pending" }
      ],
      status: "Active",
      gradePerformance: 85.0,
      attendanceRate: 100.0,
      pendingFees: 1500
    };

    onAddStudent(newStu);
    onLogAudit("Register Student", "Student Management", `Admitted new student ${newStu.name} to ${newStu.className}-${newStu.section}`);
    
    // Reset fields
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewParent("");
    setNewParentPhone("");
    setNewAddress("");
    setShowAddModal(false);
  };

  const toggleDocument = (studentId: string, docIndex: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const updatedDocs = [...student.documents];
    const oldStatus = updatedDocs[docIndex].status;
    updatedDocs[docIndex].status = oldStatus === "Verified" ? "Pending" : "Verified";
    onUpdateStudent(studentId, { documents: updatedDocs });
    onLogAudit("Toggle Document Status", "Student Management", `Changed ${student.name}'s document "${updatedDocs[docIndex].title}" status to ${updatedDocs[docIndex].status}`);
  };

  const handleStatusChange = (studentId: string, status: any) => {
    onUpdateStudent(studentId, { status });
    onLogAudit("Update Student Status", "Student Management", `Modified status of ID ${studentId} to ${status}`);
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "All" || s.className === selectedClass;
    const matchesStatus = selectedStatus === "All" || s.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Module Title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Student Administration</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm active:scale-95 transition-all text-sm w-fit"
          id="register-student-btn"
        >
          <UserPlus size={16} />
          Register Student
        </button>
      </div>

      {/* Filter and Search rail */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${currentTheme.cardBg} p-4 ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} shadow-sm`}>
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by student ID, Name or admission number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-950/40 text-sm focus:outline-none dark:text-gray-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Transferred">Transferred</option>
            <option value="Graduated">Graduated</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Student Database Table */}
      <div className={`${currentTheme.cardBg} ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${currentTheme.tableHeaderBg} border-b ${currentTheme.cardBorder}`}>
                <th className="p-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Student ID</th>
                <th className="p-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">FullName</th>
                <th className="p-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Class & Section</th>
                <th className="p-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Parent/Guardian</th>
                <th className="p-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              {filtered.map((s) => (
                <tr key={s.id} className={`${currentTheme.tableRowHover} border-b ${currentTheme.cardBorder} transition-colors duration-150 group`}>
                  <td className="p-4 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{s.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors duration-150">{s.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-150">{s.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium px-2.5 py-1 rounded-md text-xs group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 transition-colors duration-150">{s.className} - {s.section}</span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-gray-350">
                    <div className="font-medium text-gray-800 dark:text-gray-250 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors duration-150">{s.parentName}</div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-150">{s.parentPhone}</div>
                  </td>
                  <td className="p-4">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-none focus:outline-none shadow-sm cursor-pointer ${
                        s.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        s.status === "Suspended" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" :
                        "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-400"
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingStudent(s)}
                        className="p-1 px-2.5 border border-gray-200 dark:border-slate-700 hover:border-indigo-600 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setShowIDCard(s)}
                        className="p-1 px-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium border border-transparent hover:border-indigo-600"
                      >
                        ID Card
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No matching student profiles found. Try broad keywords or admissions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">Student Record: {viewingStudent.name}</h3>
              <button onClick={() => setViewingStudent(null)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-850">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-xs">Admission ID</div>
                  <div className="font-mono font-semibold">{viewingStudent.id}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Admission No</div>
                  <div className="font-bold">{viewingStudent.admissionNo}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Full Name</div>
                  <div className="font-medium text-gray-900 dark:text-white">{viewingStudent.name}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs text-indigo-400">Performance Index</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">{viewingStudent.gradePerformance}% Average</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Phone</div>
                  <div>{viewingStudent.phone}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Email</div>
                  <div>{viewingStudent.email}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Class allocation</div>
                  <div>{viewingStudent.className} - Section {viewingStudent.section}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Date of Birth</div>
                  <div>{viewingStudent.dob}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Blood Group</div>
                  <div>{viewingStudent.bloodGroup}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Medical Profile Notes</div>
                  <div className="text-amber-600 dark:text-amber-400">{viewingStudent.medicalConditions}</div>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
                <h4 className="font-bold">Guardian & Parent Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-xs">Parent Full Name</div>
                    <div>{viewingStudent.parentName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Contact Mobile</div>
                    <div>{viewingStudent.parentPhone}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Guardian Email</div>
                    <div>{viewingStudent.parentEmail}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Residential Address</div>
                    <div className="text-xs">{viewingStudent.address}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-slate-950 flex items-center justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ID Card Generation Screen */}
      {showIDCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-indigo-200 dark:border-indigo-900`}
          >
            {/* Elegant Header with School branding */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-center text-white relative">
              <div className="absolute top-4 right-4 cursor-pointer text-indigo-200 hover:text-white" onClick={() => setShowIDCard(null)}>
                <X size={18} />
              </div>
              <div className="font-bold text-xs uppercase tracking-widest text-indigo-400">School Enterprise OS</div>
              <div className="text-sm font-medium text-slate-100">ST. JOSEPH HIGHER COLLEGE</div>
              <div className="text-[10px] text-gray-400 tracking-wider">PREMIUM ACCESS TOKEN ID CARD</div>
            </div>

            {/* Photo & Main Details */}
            <div className="bg-white dark:bg-slate-900 p-8 text-center space-y-4">
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-950 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {showIDCard.name.split(" ").map(w => w[0]).join("")}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{showIDCard.name}</h4>
                <div className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full w-fit mx-auto mt-1">
                  STUDENT ID: {showIDCard.id}
                </div>
              </div>

              {/* Grid specifics */}
              <div className="grid grid-cols-2 text-left bg-gray-50 dark:bg-slate-950 p-4 rounded-2xl gap-3 text-xs text-gray-700 dark:text-gray-300">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Admission Year</span>
                  <span className="font-bold">2026-06 Academics</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Allocation Class</span>
                  <span className="font-bold">{showIDCard.className} - {showIDCard.section}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Blood Group</span>
                  <span className="font-bold">{showIDCard.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Contact Mobile</span>
                  <span className="font-mono">{showIDCard.phone}</span>
                </div>
              </div>

              {/* Interactive Vector QR checking mock */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
                <div className="mx-auto w-28 h-28 bg-gray-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col justify-between items-center">
                  {/* Generated QR Code Vector Representation */}
                  <div className="grid grid-cols-6 gap-0.5 w-full h-full">
                    {[...Array(36)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-full h-full rounded-[1px] ${
                          (idx % 2 === 0 && idx % 3 !== 0) || idx === 0 || idx === 5 || idx === 30 || idx === 35
                            ? "bg-slate-900 dark:bg-indigo-400"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 select-none uppercase tracking-wide">Secure QR code for Biometric Check-In/Library issuance</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-950 p-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Signature of Registrar</span>
              <span className="italic font-serif font-bold text-gray-700 dark:text-gray-300">Dr. J. Baruah</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admission Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-xl rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">New Student Admission Portal</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-850">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Charlie Brown"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Assigned Class *</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Assigned Section *</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Parent Full Name</label>
                  <input
                    type="text"
                    value={newParent}
                    onChange={(e) => setNewParent(e.target.value)}
                    placeholder="e.g. Arthur Brown"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Parent Contact Mobile</label>
                  <input
                    type="text"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Residential Address</label>
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    rows={2}
                    placeholder="Enter physical city address details..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-slate-950 text-amber-800 dark:text-indigo-400 rounded-xl text-xs flex gap-2">
                <span>⚠️</span>
                <span>Submitting creates a permanent record, automatically flags documents "Pending" in operations logs, and issues digital access ID card formats with auto RFID references.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-500 rounded-xl hover:bg-gray-150 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
