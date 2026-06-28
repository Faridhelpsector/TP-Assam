/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FeeCategory, FeeReceipt, InventoryItem, FinanceLedgerEntry, Student } from "../../types";
import { DollarSign, Wallet, Percent, ShieldCheck, Box, Receipt, Plus, Download, Printer, TrendingUp, TrendingDown, Layers, FileSpreadsheet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { motion } from "motion/react";

interface FeesFinanceProps {
  students: Student[];
  feeCategories: FeeCategory[];
  feeReceipts: FeeReceipt[];
  inventory: InventoryItem[];
  ledger: FinanceLedgerEntry[];
  onAddFeeReceipt: (receipt: FeeReceipt) => void;
  onAddLedgerEntry: (entry: FinanceLedgerEntry) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
  onUpdateStudent: (id: string, updated: Partial<Student>) => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
}

export default function FeesFinance({
  students,
  feeCategories,
  feeReceipts,
  inventory,
  ledger,
  onAddFeeReceipt,
  onAddLedgerEntry,
  onAddInventoryItem,
  onUpdateStudent,
  onLogAudit,
  isDarkMode
}: FeesFinanceProps) {
  const [activeTab, setActiveTab] = useState<"fees" | "finance" | "inventory" | "payroll">("fees");

  // New Fee Receipt states
  const [showFeeReceiptModal, setShowFeeReceiptModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Core Tuition Fee");
  const [receiptAmount, setReceiptAmount] = useState("1500");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [payMethod, setPayMethod] = useState<any>("UPI");

  // New Inventory Asset states
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetCat, setAssetCat] = useState<any>("Lab Equipment");
  const [assetQty, setAssetQty] = useState("10");
  const [assetCost, setAssetCost] = useState("150");
  const [assetLoc, setAssetLoc] = useState("");

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const baseAmount = Number(receiptAmount);
    const disc = Number(discountAmount);
    const totalPaid = Math.max(0, baseAmount - disc);

    const receipt: FeeReceipt = {
      id: `RCP-2026-0${feeReceipts.length + 10}`,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      category: selectedCategory,
      amount: baseAmount,
      discount: disc,
      fine: 0,
      paidAmount: totalPaid,
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().split("T")[0],
      status: "Paid"
    };

    onAddFeeReceipt(receipt);

    // Update Student outstanding balance
    const updatedPendingFee = Math.max(0, student.pendingFees - totalPaid);
    onUpdateStudent(student.id, { pendingFees: updatedPendingFee });

    // Output to general Ledger
    const ledgerEntry: FinanceLedgerEntry = {
      id: `TRX-0${ledger.length + 12}`,
      date: receipt.paymentDate,
      type: "Income",
      category: "Fee Collection",
      amount: totalPaid,
      reference: receipt.id,
      paymentMethod: payMethod
    };
    onAddLedgerEntry(ledgerEntry);

    onLogAudit("Create Fee Receipt", "Fees Management", `Recorded payment of ₹${totalPaid} for ${student.name}. Adjusted pending dues to ₹${updatedPendingFee}`);
    
    // Reset Fields
    setSelectedStudentId("");
    setReceiptAmount("1500");
    setDiscountAmount("0");
    setShowFeeReceiptModal(false);
  };

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName) return;

    const qty = Number(assetQty) || 1;
    const cost = Number(assetCost) || 10;
    const totalCost = qty * cost;

    const newItem: InventoryItem = {
      id: `INV-0${inventory.length + 10}`,
      name: assetName,
      category: assetCat,
      quantity: qty,
      unit: "pcs",
      cost: cost,
      location: assetLoc || "Main Depot",
      purchaseDate: new Date().toISOString().split("T")[0]
    };

    onAddInventoryItem(newItem);

    // Outflow from Finance ledger
    const ledgerOutflow: FinanceLedgerEntry = {
      id: `TRX-0${ledger.length + 12}`,
      date: newItem.purchaseDate,
      type: "Expense",
      category: "Inventory Purchase",
      amount: totalCost,
      reference: newItem.id,
      paymentMethod: "Bank Transfer"
    };
    onAddLedgerEntry(ledgerOutflow);

    onLogAudit("Register Asset Item", "Inventory Management", `Purchased and logged asset ${newItem.name} (QTY: ${newItem.quantity}) totaling ₹${totalCost}`);
    
    // Reset
    setAssetName("");
    setAssetQty("10");
    setAssetCost("150");
    setAssetLoc("");
    setShowAssetModal(false);
  };

  // Finance aggregated summaries
  const totalIncome = ledger.filter(item => item.type === "Income").reduce((sum, current) => sum + current.amount, 0);
  const totalExpense = ledger.filter(item => item.type === "Expense").reduce((sum, current) => sum + current.amount, 0);
  const companyProfit = totalIncome - totalExpense;

  // Compile monthly chart stats for Recharts
  const chartData = [
    { month: "Jan", Income: 11200, Expenses: 8400 },
    { month: "Feb", Income: 14500, Expenses: 9200 },
    { month: "Mar", Income: 12100, Expenses: 14000 },
    { month: "Apr", Income: 18400, Expenses: 9100 },
    { month: "May", Income: 22100, Expenses: 18000 },
    { month: "Jun", Income: totalIncome, Expenses: totalExpense }
  ];

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("fees")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "fees" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Receipt size={14} />
          Fee Tiers & Receipts
        </button>
        <button
          onClick={() => setActiveTab("finance")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "finance" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <DollarSign size={14} />
          Ledger & Revenue charts
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "inventory" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Box size={14} />
          Asset Inventory
        </button>
        <button
          onClick={() => setActiveTab("payroll")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "payroll" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Wallet size={14} />
          Payroll & HR Records
        </button>
      </div>

      {/* 1. FEES MANAGEMENT SUB TAB */}
      {activeTab === "fees" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Student Fee Distribution & receipts</h3>
              <p className="text-xs text-gray-500">Record outstanding tuition charges, allocate custom discounts, and print validated receipts for parent accounting records.</p>
            </div>
            <button
              onClick={() => setShowFeeReceiptModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit"
            >
              <Plus size={14} /> Record Student Fee Receipt
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Fee Tiers List */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] block">Standard Fee Structure</h4>
              <div className="space-y-2">
                {feeCategories.map(cat => (
                  <div key={cat.id} className="p-3 bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-between border">
                    <div>
                      <span className="font-bold block text-gray-800 dark:text-gray-200">{cat.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono tracking-wider">{cat.frequency} Plan</span>
                    </div>
                    <span className="text-indigo-600 font-bold">₹{cat.amount}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-slate-950 p-2 text-[10px] text-amber-800 rounded-xl">
                💡 Scholarship policies allow applying 10% to 50% discount offsets to qualified student profiles during card log submission.
              </div>
            </div>

            {/* Fee Receipts logs */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-slate-950 border-b font-bold uppercase tracking-wider text-[10px]">Historic Receipt audit-trail</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-400">
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Paid Category</th>
                      <th className="p-3">Net Paid</th>
                      <th className="p-3">Payment Term</th>
                      <th className="p-3 text-right">Receipt File</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-slate-850">
                    {feeReceipts.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-indigo-505">{rec.id}</td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-900 dark:text-white">{rec.studentName}</span>
                          <span className="text-[10px] block text-zinc-400">{rec.className}</span>
                        </td>
                        <td className="p-3 text-gray-700 dark:text-zinc-200">{rec.category}</td>
                        <td className="p-3 font-bold text-emerald-600">₹{rec.paidAmount}</td>
                        <td className="p-3">
                          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">{rec.paymentMethod} • {rec.paymentDate}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => alert(`Printing document: ${rec.id}\nStudent: ${rec.studentName}\nSettled Account: ₹${rec.paidAmount}\nStatus: verified CJS`)}
                            className="p-1 px-2 border hover:border-indigo-600 text-indigo-600 rounded-md bg-white hover:bg-slate-50 font-semibold"
                          >
                            <Printer size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERAL REVENUE & BUDGET MANAGEMENT SUB TAB */}
      {activeTab === "finance" && (
        <div className="space-y-6">
          {/* Revenue quick metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-450 block font-semibold">Net Consolidated Revenue</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{totalIncome}</span>
                <span className="text-[10px] text-emerald-600 block mt-1 font-bold flex items-center gap-0.5">
                  <TrendingUp size={11} /> +12.4% vs last quarter
                </span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xl font-bold">💳</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-450 block font-semibold">Operations Expenses Outflow</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{totalExpense}</span>
                <span className="text-[10px] text-rose-600 block mt-1 font-bold flex items-center gap-0.5">
                  <TrendingDown size={11} /> Increased utility asset bills
                </span>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 text-orange-600 text-xl font-bold">📉</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-450 block font-semibold">Net Operations Balance</span>
                <span className={`text-2xl font-black ${companyProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  ₹{companyProfit}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">Audit verification OK</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xl font-bold">✓</div>
            </div>
          </div>

          {/* Interactive Recharts Chart Area */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Monthly Income vs Expenditure Trend</h4>
                <p className="text-xs text-gray-500">Live graphical data feed logging fee inputs alongside facility expenditures.</p>
              </div>
              <span className="p-1 px-3 border text-[10px] rounded hover:bg-slate-50 font-bold uppercase tracking-widest text-[#1e1b4b] cursor-pointer">
                Export Ledger Sheets
              </span>
            </div>

            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Income" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expenses" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. ASSETS & INVENTORY MANAGEMENT SUB TAB */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Facility Assets & Inventory tracking</h3>
              <p className="text-xs text-gray-500">Monitor school science instruments, library furniture and computer sandboxes.</p>
            </div>
            <button
              onClick={() => setShowAssetModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit"
            >
              <Plus size={14} /> Buy Academic Asset
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-950 border-b text-gray-400">
                    <th className="p-3">Asset Code</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Category Classification</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Value / Costs per Unit</th>
                    <th className="p-3">Depot Location</th>
                    <th className="p-3 text-right">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-indigo-500">{item.id}</td>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">{item.name}</td>
                      <td className="p-3 text-gray-650">
                        <span className="bg-indigo-50 dark:bg-slate-950 text-indigo-700 px-2 py-0.5 rounded font-medium">{item.category}</span>
                      </td>
                      <td className="p-3 font-semibold">{item.quantity} {item.unit}</td>
                      <td className="p-3 font-bold text-emerald-600">₹{item.cost}</td>
                      <td className="p-3 text-gray-400 font-mono">{item.location}</td>
                      <td className="p-3 text-right text-gray-400 font-medium">{item.purchaseDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAYROLL & HR RECORDS SUB TAB */}
      {activeTab === "payroll" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Corporate Payroll ledger</h3>
            <p className="text-zinc-400">Distribute faculty salary offsets, process tax withholding structures, and download compiled employee slips.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-450 text-[10px] uppercase font-mono">
                  <th className="p-3">Account ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Allocated Class Role</th>
                  <th className="p-3">Base Compensation Class</th>
                  <th className="p-3">Taxes / Withholding</th>
                  <th className="p-3">Net payout amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-850">
                {/* Simulated list of payroll values */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-indigo-500">PAY-EMP-01</td>
                  <td className="p-3">
                    <span className="font-bold text-gray-900 dark:text-white">Dr. Aditi Mukherjee</span>
                    <span className="text-[10px] block text-zinc-400">a.mukherjee@school.edu</span>
                  </td>
                  <td className="p-3 font-medium text-gray-600">Science Head</td>
                  <td className="p-3 font-semibold text-gray-800 dark:text-zinc-200">₹6,200 / Month</td>
                  <td className="p-3 text-zinc-400">₹310 (5.0%)</td>
                  <td className="p-3 font-extrabold text-emerald-600">₹5,890</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert("Downloading PDF payroll pay slip for Dr. Aditi Mukherjee. Basic: ₹6200, Overtime Bonus: 0, Net: ₹5890. Verified on local Express backend.")}
                      className="p-1 px-2.5 bg-indigo-50 text-indigo-600 font-semibold border hover:border-indigo-600 rounded-md flex items-center gap-1 ml-auto"
                    >
                      <Download size={11} /> Grab Slip
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-indigo-500">PAY-EMP-02</td>
                  <td className="p-3">
                    <span className="font-bold text-gray-900 dark:text-white">Prof. Rakesh Shastri</span>
                    <span className="text-[10px] block text-zinc-400">rakesh.shastri@school.edu</span>
                  </td>
                  <td className="p-3 font-medium text-gray-600">History Lecturer</td>
                  <td className="p-3 font-semibold text-gray-800 dark:text-zinc-200">₹5,800 / Month</td>
                  <td className="p-3 text-zinc-400">₹290 (5.0%)</td>
                  <td className="p-3 font-extrabold text-emerald-600">₹5,510</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert("Downloading pay slip for Prof. Rakesh Shastri. Net payout amount: ₹5510. Secure PDF downloaded.")}
                      className="p-1 px-2.5 bg-indigo-50 text-indigo-600 font-semibold border hover:border-indigo-600 rounded-md flex items-center gap-1 ml-auto"
                    >
                      <Download size={11} /> Grab Slip
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW FEE RECEIPT CONVENING FORM MODAL */}
      {showFeeReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl relative"
          >
            <div className="flex justify-between items-center pb-4 border-b">
              <h4 className="font-bold">Record Pupil Fee Collection</h4>
              <button onClick={() => setShowFeeReceiptModal(false)} className="p-1 rounded hover:bg-slate-100">
                <Printer size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateReceipt} className="space-y-4 pt-4 text-sm">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Select Student *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => {
                    const stu = students.find(s => s.id === e.target.value);
                    setSelectedStudentId(e.target.value);
                    if (stu) {
                      setReceiptAmount(String(catValueMap[selectedCategory] || 1500));
                    }
                  }}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg"
                >
                  <option value="">-- Choose Pupil --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.className} - Dues: ₹{s.pendingFees})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Fee Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setReceiptAmount(String(catValueMap[e.target.value] || 1500));
                  }}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg"
                >
                  <option value="Core Tuition Fee">Core Tuition Fee (₹1500)</option>
                  <option value="Transport Facility Fee">Transport Facility Fee (₹300)</option>
                  <option value="Annual Development & Library Fee">Annual Development & Library Fee (₹800)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Gross Total (₹) *</label>
                  <input
                    type="number"
                    value={receiptAmount}
                    onChange={(e) => setReceiptAmount(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Discount Apply Offset (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg animate-pulse"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Settlement Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg"
                >
                  <option value="UPI">UPI Digital Wallet</option>
                  <option value="Credit Card">Credit Card Auth</option>
                  <option value="Bank Transfer">Wire Transfer Routing</option>
                  <option value="Cash">Cash Ledger</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <ShieldCheck size={14} /> Commit Payment & Issue Receipt
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* NEW ASSET PURCHASE MODAL */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-3xl p-6 shadow-2xl relative"
          >
            <div className="flex justify-between items-center pb-4 border-b">
              <h4 className="font-bold">Acquire Facility Asset</h4>
              <button onClick={() => setShowAssetModal(false)} className="p-1 rounded text-gray-400 hover:bg-gray-100">
                Cancel
              </button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. Dell Optiplex PC (Computer Lab)"
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Catalog Category *</label>
                <select
                  value={assetCat}
                  onChange={(e) => setAssetCat(e.target.value as any)}
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg"
                >
                  <option value="IT Appliance">IT Appliance</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Sport Asset">Sport Asset</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Quantity *</label>
                  <input
                    type="number"
                    value={assetQty}
                    onChange={(e) => setAssetQty(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Unit Costs (₹) *</label>
                  <input
                    type="number"
                    value={assetCost}
                    onChange={(e) => setAssetCost(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Shelve / Depot Location *</label>
                <input
                  type="text"
                  required
                  value={assetLoc}
                  onChange={(e) => setAssetLoc(e.target.value)}
                  placeholder="e.g. IT server room, Room 302 cupboard"
                  className="w-full p-2 border border-gray-200 dark:bg-slate-950 dark:border-slate-850 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95"
              >
                Onboard Purchase Offset & Authorize Ledger Outflow
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const catValueMap: { [key: string]: number } = {
  "Core Tuition Fee": 1500,
  "Transport Facility Fee": 300,
  "Annual Development & Library Fee": 800
};
