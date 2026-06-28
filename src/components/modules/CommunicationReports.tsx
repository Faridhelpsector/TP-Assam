/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CommunicationItem, Student, FeeReceipt, ExamRecord } from "../../types";
import { Search, Mail, MessageSquare, Plus, CheckCircle, FileSpreadsheet, Download, Printer, UserCircle } from "lucide-react";
import { motion } from "motion/react";

interface CommunicationReportsProps {
  students: Student[];
  feeReceipts: FeeReceipt[];
  examRecords: ExamRecord[];
  communications: CommunicationItem[];
  onAddCommunication: (com: CommunicationItem) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
}

export default function CommunicationReports({
  students,
  feeReceipts,
  examRecords,
  communications,
  onAddCommunication,
  onLogAudit
}: CommunicationReportsProps) {
  const [activeTab, setActiveTab] = useState<"comms" | "reports">("comms");

  // New Circular states
  const [showComModal, setShowComModal] = useState(false);
  const [comTitle, setComTitle] = useState("");
  const [comCat, setComCat] = useState<any>("Circular");
  const [comContent, setComContent] = useState("");

  // Report download selections
  const [reportType, setReportType] = useState<"gpa" | "cleared" | "audits">("gpa");

  const handlePostCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comTitle || !comContent) return;

    const newCom: CommunicationItem = {
      id: `COM-0${communications.length + 10}`,
      title: comTitle,
      content: comContent,
      sender: "System Super Admin",
      targetRoles: [],
      date: new Date().toISOString().split("T")[0],
      type: comCat
    };

    onAddCommunication(newCom);
    onLogAudit("Broadcast Notice", "Communication Center", `Dispatched school circular: "${comTitle}" via ${comCat}`);
    
    // Reset Fields
    setComTitle("");
    setComContent("");
    setShowComModal(false);
  };

  const handleDownloadSheet = () => {
    onLogAudit("Export Spreadsheet", "Reports & Analytics", `Exported tabular data for category: ${reportType.toUpperCase()}`);
    alert(`File Prepared for Download!\n\nName: eduglyde_report_${reportType}.xlsx\nRows gathered: ${students.length}\nHash: SHA-256 Verified.\nFormat: Excel Spreadsheet`);
  };

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("comms")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "comms" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <MessageSquare size={14} />
          School Circulars Board & WhatsApp gateways
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "reports" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <FileSpreadsheet size={14} />
          Report Card & Export Builders
        </button>
      </div>

      {/* 1. COMMUNICATION BOARD */}
      {activeTab === "comms" && (
        <div className="space-y-6 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Announcements Board & WhatsApp Dispatchers</h3>
              <p className="text-xs text-gray-500">Post notices to student channels, issue email digests, and record instant notification statuses.</p>
            </div>
            <button
              onClick={() => setShowComModal(true)}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit"
            >
              <Plus size={14} /> Draft Board Circular
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of published notices */}
            <div className="lg:col-span-2 space-y-4">
              {communications.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-[9px] bg-slate-100 text-zinc-500 font-mono tracking-widest px-2.5 py-0.5 rounded font-bold uppercase mr-2">
                      Notice: {item.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-indigo-600">{item.type} Channel</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#111827] dark:text-white text-sm">{item.title}</h4>
                    <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">By {item.sender} on {item.date}</span>
                  </div>

                  <p className="text-xs text-gray-650 dark:text-gray-400 bg-gray-50 dark:bg-slate-950 p-3 rounded-2xl border leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Simulated gateway triggers */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] block">Corporate Notification Gateways</h4>
              <div className="space-y-3 text-xs leading-relaxed text-zinc-500">
                <div className="p-3.5 bg-gray-50 dark:bg-slate-950 border rounded-2xl flex items-center gap-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">WhatsApp Business API</span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">● Operational (24,801 pings)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-slate-950 border rounded-2xl flex items-center gap-3">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block font-sans">Mandrill / Mailchimp SMTP</span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">● Connected (14,402 sent)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-slate-950 border rounded-2xl flex items-center gap-3">
                  <div className="text-2xl text-indigo-505">📱</div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block font-mono">Twilio SMS Bulk Gateway</span>
                    <span className="text-[10px] text-rose-500 block font-semibold font-sans">● Exhausted credits (₹0 remaining)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REPORT builders AND EXPORTS PANEL */}
      {activeTab === "reports" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs text-slate-800 dark:text-white">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Analytical transcript and spreadsheet exports</h3>
            <p className="text-zinc-400">Generate instantly formatted reports on GPA rankings, fee collections and audit databases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-300/40 text-xs">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Select Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
              >
                <option value="gpa">Standard GPA Merit Listings</option>
                <option value="cleared">Cleared Fee Dues clearances</option>
                <option value="audits">Operations System Action logs</option>
              </select>
            </div>
            <div className="flex flex-col justify-end p-1">
              <span className="text-[10.5px] text-zinc-400 block mb-1">Rows consolidated: {students.length} Candidates</span>
            </div>
            <button
              onClick={handleDownloadSheet}
              className="px-5 py-2.5 h-11 bg-indigo-650 hover:bg-slate-850 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 font-semibold active:opacity-95 transition-all text-sm w-fit"
            >
              <Download size={15} /> Consolidate Excel sheet
            </button>
          </div>

          {/* Quick Preview table of GPA report card structure */}
          {reportType === "gpa" && (
            <div className="border rounded-2xl overflow-hidden mt-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 font-bold tracking-wide uppercase text-[9.5px]">Spreadsheet Preview: GPA Ranking list</div>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-950 border-b text-zinc-500 font-mono">
                      <th className="p-3">Admissions Code</th>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Weekly Attendance Rate</th>
                      <th className="p-3">Performance Index (CGPA)</th>
                      <th className="p-3 text-right">Standard status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-indigo-505">{s.id}</td>
                        <td className="p-3 font-semibold">{s.name}</td>
                        <td className="p-3 text-zinc-400 font-mono">{s.attendanceRate}% Logged</td>
                        <td className="p-3 font-black text-indigo-600">{s.gradePerformance}% Average</td>
                        <td className="p-3 text-right">
                          <span className={`${s.gradePerformance >= 70 ? "text-emerald-600" : "text-rose-600"}`}>
                            {s.gradePerformance >= 50 ? "Passing Grade" : "Retention Warn"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cleared Fee Report */}
          {reportType === "cleared" && (
            <div className="border rounded-2xl overflow-hidden mt-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 font-bold uppercase text-[9.5px]">Spreadsheet Preview: Fee Defaulter accounts details</div>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-950 border-b text-zinc-500 font-mono">
                      <th className="p-3">Pupil Code</th>
                      <th className="p-3">FullName</th>
                      <th className="p-3">Assigned Class Room</th>
                      <th className="p-3">Outstanding Dues Balance</th>
                      <th className="p-3 text-right">Account clearance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/10 dark:hover:bg-slate-800/10">
                        <td className="p-3 font-mono text-zinc-405">{s.id}</td>
                        <td className="p-3 font-semibold">{s.name}</td>
                        <td className="p-3 text-zinc-400">{s.className}</td>
                        <td className="p-3 font-black text-rose-650 text-rose-600">${s.pendingFees} Dues</td>
                        <td className="p-3 text-right">
                          {s.pendingFees === 0 ? (
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">VERIFIED CLEARED</span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">DEFAULTER RISK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DRAFT BOARD NOTICE MODAL */}
      {showComModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs text-slate-805">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-3xl p-6 shadow-2xl relative"
          >
            <div className="pb-4 border-b flex justify-between items-center">
              <h4 className="font-bold text-indigo-650">Draft Circular Board Announcement</h4>
              <button onClick={() => setShowComModal(false)} className="p-1 rounded hover:bg-slate-100">
                Cancel
              </button>
            </div>
            <form onSubmit={handlePostCommunication} className="space-y-4 pt-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Circular Title *</label>
                <input
                  type="text"
                  required
                  value={comTitle}
                  onChange={(e) => setComTitle(e.target.value)}
                  placeholder="e.g. Schedule Changes for Computer Lab Sessions"
                  className="w-full p-2.5 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Target Channel Cateogry *</label>
                <select
                  value={comCat}
                  onChange={(e) => setComCat(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl"
                >
                  <option value="Circular">Circular Board Bulletin</option>
                  <option value="SMS">Twilio SMS Bulk Gateway</option>
                  <option value="Announcement">Announcements System board</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Circular Content *</label>
                <textarea
                  required
                  value={comContent}
                  onChange={(e) => setComContent(e.target.value)}
                  rows={4}
                  placeholder="Draft notice body content details..."
                  className="w-full p-2.5 border border-gray-200 dark:text-zinc-900 focus:outline-none rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all"
              >
                Broadcast Circular
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
