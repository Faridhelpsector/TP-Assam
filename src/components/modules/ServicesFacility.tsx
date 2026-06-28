/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookRecord, TransportVehicle, HostelRoom, Student } from "../../types";
import { Search, Library, Bus, Home, Plus, Clock, Undo, Compass, Navigation, UserCheck, ShieldAlert, BookMarked, Pin } from "lucide-react";
import { motion } from "motion/react";

interface ServicesFacilityProps {
  students: Student[];
  books: BookRecord[];
  vehicles: TransportVehicle[];
  hostels: HostelRoom[];
  onAddBook: (book: BookRecord) => void;
  onUpdateBook: (id: string, updated: Partial<BookRecord>) => void;
  onUpdateVehicle: (id: string, updated: Partial<TransportVehicle>) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
}

export default function ServicesFacility({
  students,
  books,
  vehicles,
  hostels,
  onAddBook,
  onUpdateBook,
  onUpdateVehicle,
  onLogAudit,
  isDarkMode
}: ServicesFacilityProps) {
  const [activeTab, setActiveTab] = useState<"library" | "transport" | "hostel">("library");

  // Book Issuing Form states
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [issueStudentId, setIssueStudentId] = useState("");
  const [dueDays, setDueDays] = useState("14");

  // Filter Search
  const [bookSearch, setBookSearch] = useState("");

  // GPS Simulation variables
  const [activeGpsSimulation, setActiveGpsSimulation] = useState<string | null>(null);

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find(b => b.id === selectedBookId);
    const student = students.find(s => s.id === issueStudentId);

    if (!book || !student) return;
    if (book.copiesAvailable <= 0) {
      alert("All physical copies of this book are currently issued. Reserve in digital queue!");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const dueTime = new Date();
    dueTime.setDate(dueTime.getDate() + Number(dueDays));
    const dueStr = dueTime.toISOString().split("T")[0];

    const currentLogs = [...book.issuedLogs, {
      studentId: student.id,
      studentName: student.name,
      issueDate: todayStr,
      dueDate: dueStr,
      fineAmount: 0
    }];

    onUpdateBook(book.id, {
      copiesAvailable: Math.max(0, book.copiesAvailable - 1),
      issuedLogs: currentLogs
    });

    onLogAudit("Issue Library Book", "Library Management", `Issued "${book.title}" to ${student.name}. Due on: ${dueStr}`);
    
    // Reset Fields
    setSelectedBookId("");
    setIssueStudentId("");
    setShowIssueModal(false);
  };

  const handleReturnBook = (bookId: string, logIndex: number) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const logItem = book.issuedLogs[logIndex];
    const updatedLogs = [...book.issuedLogs];
    updatedLogs[logIndex] = { ...logItem, returnDate: new Date().toISOString().split("T")[0] };

    onUpdateBook(book.id, {
      copiesAvailable: book.copiesAvailable + 1,
      issuedLogs: updatedLogs
    });

    onLogAudit("Return Library Book", "Library Management", `Returned "${book.title}" from Student Code: ${logItem.studentId}`);
  };

  const handleSimulateGPSUpdate = (vehId: string) => {
    const vehicle = vehicles.find(v => v.id === vehId);
    if (!vehicle) return;

    // Simulate small fractional GPS coordinates movement around Singapore / Southeast Asia coordinates
    const deltaLat = (Math.random() - 0.5) * 0.01;
    const deltaLng = (Math.random() - 0.5) * 0.01;
    const newCoords = {
      lat: vehicle.gpsCoordinates.lat + deltaLat,
      lng: vehicle.gpsCoordinates.lng + deltaLng
    };

    onUpdateVehicle(vehicle.id, { gpsCoordinates: newCoords });
    onLogAudit("GPS Simulation ping", "Transport Management", `Refreshed transit coordinates for vehicle ${vehicle.vehicleNo}: LAT ${newCoords.lat.toFixed(4)}, LNG ${newCoords.lng.toFixed(4)}`);
    setActiveGpsSimulation(vehicle.id);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
    b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.category.toLowerCase().includes(bookSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("library")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "library" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Library size={14} />
          Library Inventory Registers
        </button>
        <button
          onClick={() => setActiveTab("transport")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "transport" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Bus size={14} />
          Transport Routes & Live GPS
        </button>
        <button
          onClick={() => setActiveTab("hostel")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "hostel" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Home size={14} />
          Hostel Occupancy Blocks
        </button>
      </div>

      {/* 1. LIBRARY SUB MODULE */}
      {activeTab === "library" && (
        <div className="space-y-6 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Central Book Inventory Ledger</h3>
              <p className="text-xs text-gray-500">Log incoming ISBN accessions, manage loan periods, and monitor active fine returns.</p>
            </div>
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit"
            >
              <BookMarked size={14} /> Issue Book to Pupil
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search library book catalogs by title, author, category or shelf number..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {/* Book Catalog list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBooks.map(b => (
              <div key={b.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded font-mono border text-zinc-500 mr-2 uppercase">
                      ISBN: {b.isbn}
                    </span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded font-mono uppercase">
                      Shelf: {b.shelveLocation}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${b.copiesAvailable > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {b.copiesAvailable} / {b.copiesTotal} Available
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-gray-900 dark:text-white">{b.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-medium">Written by {b.author} • {b.category}</p>
                </div>

                {/* Issued log list inside cards */}
                <div className="border-t pt-3 space-y-2 text-xs">
                  <div className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">Active Borrower logs:</div>
                  <div className="space-y-1.5">
                    {b.issuedLogs.map((log, l_idx) => (
                      <div key={l_idx} className="p-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold block text-gray-800 dark:text-gray-200">{log.studentName} ({log.studentId})</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">Loan Term: {log.issueDate} to <strong className="text-zinc-650">{log.dueDate}</strong></span>
                        </div>
                        {log.returnDate ? (
                          <span className="text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded">Returned: {log.returnDate}</span>
                        ) : (
                          <button
                            onClick={() => handleReturnBook(b.id, l_idx)}
                            className="bg-indigo-50 text-indigo-650 hover:bg-indigo-100 font-bold px-3 py-1 rounded transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}
                      </div>
                    ))}
                    {b.issuedLogs.length === 0 && (
                      <p className="text-[11px] text-zinc-400 italic">No copies are currently in active library circulation.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TRANSPORT & ROUTING SECTION */}
      {activeTab === "transport" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-800 dark:text-white">
          {/* Active fleet info panel */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[10px] block">Academic Fleet Registers</h4>
            <div className="space-y-3">
              {vehicles.map(v => (
                <div key={v.id} className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-150/70 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-indigo-600 font-bold block">{v.vehicleNo}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">{v.route}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded text-[10px]">Active</span>
                  </div>

                  <div className="text-[11px] text-gray-650 font-medium space-y-1 bg-white p-2 rounded-xl border">
                    <div>🚐 Driver: {v.driverName}</div>
                    <div>📞 Contact: {v.driverPhone}</div>
                    <div>Capacity: {v.capacity} seats</div>
                  </div>

                  <button
                    onClick={() => handleSimulateGPSUpdate(v.id)}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 space-x-1"
                  >
                    <span>Ping GPS Satellite Coordinates</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Micro Map GPS vector graphics widget */}
          <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-slate-800 h-[420px]">
            <div>
              <h4 className="font-bold flex items-center gap-1.5 text-base">
                <Compass className="text-indigo-400 animate-spin" size={16} /> GPS Integrated Dispatch Monitoring Grid
              </h4>
              <p className="text-[10px] text-gray-400 tracking-wider">LIVE VEICLES TRANSIT DISPOSITION IN THE SOUTH-EAST CAMPUS ROUTINGS</p>
            </div>

            {/* Vector Simulated map grids */}
            <div className="h-64 bg-[#0a0f1d] border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
              {/* Coordinate grid lines */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.03] text-[9px] text-[#cbd5e1] font-mono pointer-events-none">
                {[...Array(72)].map((_, idx) => (
                  <div key={idx} className="border-r border-b" />
                ))}
              </div>

              {/* Transit road paths vector sketch */}
              <svg className="absolute inset-0 w-full h-full text-indigo-500/20 stroke-2" fill="none">
                <path d="M 0 100 Q 200 220 400 130 T 800 240" stroke="currentColor" strokeDasharray="5, 5" />
                <path d="M 120 0 Q 300 180 340 400" stroke="currentColor" strokeDasharray="3, 3" />
              </svg>

              {/* Active bus dots on coordinate grid */}
              {vehicles.map((v) => {
                // Determine layout positions based on fractional mock GPS values
                const l_val = Math.floor((v.gpsCoordinates.lat - 10.70) * 1200) % 80;
                const r_val = Math.floor((v.gpsCoordinates.lng - 106.65) * 1200) % 80;

                return (
                  <motion.div
                    key={v.id}
                    animate={{ scale: activeGpsSimulation === v.id ? [1, 1.2, 1] : 1 }}
                    style={{ left: `${Math.max(10, Math.min(85, 30 + r_val))}%`, top: `${Math.max(10, Math.min(85, 20 + l_val))}%` }}
                    className="absolute z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="p-1.5 bg-indigo-500 rounded-xl relative shadow-md">
                      <Bus size={15} />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-1 -right-1 border border-white animate-pulse" />
                    </div>
                    <span className="mt-1 font-mono text-[9px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded block">
                      {v.vehicleNo}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest pointer-events-none select-none">GPS Satellite Coordinates Sync OK • Latitude 10.7769N, Longitude 106.7009E</p>
          </div>
        </div>
      )}

      {/* 3. HOSTEL ROOM SUBTAB */}
      {activeTab === "hostel" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-800 dark:text-white">
          {hostels.map(room => (
            <div key={room.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-[#111827] dark:text-white text-base">Room {room.roomNo}</h4>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">{room.block}</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${room.occupiedBeds === room.bedCapacity ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {room.occupiedBeds} / {room.bedCapacity} Occupied
                </span>
              </div>

              <div className="flex justify-between text-[11px] bg-gray-50 dark:bg-slate-950 p-2.5 rounded-xl text-gray-650">
                <span>Room Class: <strong>{room.type} Block</strong></span>
                <span className="font-bold text-gray-900 dark:text-white">${room.monthlyFee} / Month</span>
              </div>

              <div className="pt-2 border-t space-y-2">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">Residency Logs:</span>
                {room.residents.map((res, r_idx) => {
                  const stu = students.find(s => s.id === res.studentId);
                  return (
                    <div key={r_idx} className="flex justify-between items-center text-[11.5px] border-b pb-1.5 last:border-0 last:pb-0">
                      <span>✓ {stu ? stu.name : "Alumni pupil"} ({res.studentId})</span>
                      <span className="text-zinc-400">Bed Allocation: #{res.bedNo}</span>
                    </div>
                  );
                })}
                {room.residents.length === 0 && (
                  <p className="text-zinc-400 italic font-medium">This room is currently empty and fully sanitized for new bookings.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOK ISSUE MODAL DIALOG */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-3xl p-6 shadow-2xl relative`}
          >
            <div className="pb-4 border-b flex justify-between items-center">
              <h4 className="font-bold text-[#4f46e5]">Issue Book to Student</h4>
              <button onClick={() => setShowIssueModal(false)} className="p-1 rounded hover:bg-slate-100">
                ✕
              </button>
            </div>
            <form onSubmit={handleIssueBook} className="space-y-4 pt-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Select Book Catalog Title *</label>
                <select
                  required
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl"
                >
                  <option value="">-- Choose Book --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id} disabled={b.copiesAvailable <= 0}>
                      {b.title} (Available: {b.copiesAvailable})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Select Borrower Pupil *</label>
                <select
                  required
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Loan Period Limit *</label>
                <select
                  value={dueDays}
                  onChange={(e) => setDueDays(e.target.value)}
                  className="w-full p-2 border rounded-xl dark:bg-slate-950"
                >
                  <option value="7">7 Days standard</option>
                  <option value="14">14 Days academic limit</option>
                  <option value="28">28 Days holiday loan</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all"
              >
                Dispatch Book & Log Loan
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
