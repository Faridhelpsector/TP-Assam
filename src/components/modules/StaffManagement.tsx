/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Staff } from "../../types";
import { Search, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StaffManagementProps {
  staffList: Staff[];
  onAddStaff: (member: Staff) => void;
  onUpdateStaff: (id: string, updated: Partial<Staff>) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
}

export default function StaffManagement({
  staffList,
  onAddStaff,
  onUpdateStaff,
  onLogAudit,
  isDarkMode
}: StaffManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // New staff form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("Librarian");
  const [dept, setDept] = useState<"Security" | "Administration" | "Maintenance" | "Kitchen" | "IT Support" | "Reception">("Administration");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("3200");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newMember: Staff = {
      id: `STF-0${staffList.length + 11}`,
      name,
      role,
      department: dept,
      phone,
      email: `${name.toLowerCase().replace(/\s/g, "")}@eduglyde.com`,
      salary: Number(salary) || 3000,
      status: "Active",
      attendanceRate: 98.4
    };

    onAddStaff(newMember);
    onLogAudit("Add Staff Member", "Staff Management", `Directly onboarded operational staff member ${name} (${role}) into department ${dept}`);
    
    // Reset Form
    setName("");
    setPhone("");
    setSalary("3200");
    setShowAddModal(false);
  };

  const toggleStatus = (id: string, current: "Active" | "Inactive") => {
    const nextStatus = current === "Active" ? "Inactive" : "Active";
    onUpdateStaff(id, { status: nextStatus });
    onLogAudit("Toggle Staff Status", "Staff Management", `Altered employment activity state of Staff member ID: ${id}`);
  };

  const filteredStaff = staffList.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === "All" || item.department === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-white">
      {/* Module Title banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Operational Staff Directory</h3>
          <p className="text-xs text-gray-500">Monitor supportive administration units, receptionists, medical officers and general logistics professionals.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 text-sm w-fit"
        >
          <Plus size={14} /> Onboard Staff
        </button>
      </div>

      {/* Row filtering controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search operational staff by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-501 dark:text-white"
          />
        </div>
        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full p-2 rounded-xl border border-gray-200 bg-gray-50 dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Administration">Administration</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
            <option value="IT Support">IT Support</option>
            <option value="Reception">Reception</option>
          </select>
        </div>
      </div>

      {/* Cards list grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(member => (
          <div key={member.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] bg-slate-50 border px-2 py-0.5 rounded font-mono font-bold text-zinc-500 uppercase dark:bg-slate-950 mr-2">
                    {member.id}
                  </span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded uppercase">
                    {member.department}
                  </span>
                </div>
                <button
                  onClick={() => toggleStatus(member.id, member.status)}
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    member.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {member.status}
                </button>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-gray-900 dark:text-white">{member.name}</h4>
                <p className="text-[11px] text-zinc-400 font-medium tracking-wide block">{member.role}</p>
              </div>

              <div className="pt-2 border-t text-[11px] text-zinc-500 font-medium space-y-1 bg-gray-50 dark:bg-slate-950 p-2 rounded-xl">
                <div>📧 email: {member.email}</div>
                <div>📞 phone: {member.phone}</div>
                <div>📈 Attendance Rate: {member.attendanceRate}%</div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-between items-center text-xs">
              <span className="text-emerald-600 font-bold">Salary: ${member.salary} / Month</span>
              <span className="text-zinc-400 font-semibold">Allocated</span>
            </div>
          </div>
        ))}
      </div>

      {/* ONBOARD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 text-slate-805 dark:text-white rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="pb-4 border-b flex justify-between items-center">
                <h4 className="font-bold">Onboard Operational Staff</h4>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-slate-100">
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 font-semibold text-slate-800 dark:text-zinc-100">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Yadav"
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Role Description *</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Lead Groundkeeper"
                      className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase mb-1">Department *</label>
                    <select
                      value={dept}
                      onChange={(e) => setDept(e.target.value as any)}
                      className="w-full p-2 border rounded-xl dark:bg-slate-950 focus:outline-none"
                    >
                      <option value="Administration">Administration</option>
                      <option value="Security">Security</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Reception">Reception</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Base Monthly Salary ($) *</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-slate-850 text-white font-bold rounded-xl text-xs active:scale-95 transition-all"
                >
                  Confirm Staff Placement
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
