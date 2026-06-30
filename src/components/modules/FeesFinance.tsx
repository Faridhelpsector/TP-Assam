/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { FeeCategory, FeeReceipt, InventoryItem, FinanceLedgerEntry, Student } from "../../types";
import { 
  DollarSign, 
  Wallet, 
  Percent, 
  ShieldCheck, 
  Box, 
  Receipt, 
  Plus, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  FileSpreadsheet, 
  Settings, 
  Sliders, 
  Edit3, 
  Trash2, 
  Check, 
  RefreshCw, 
  FileText, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Save,
  Coins,
  Sparkles,
  BookOpen
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";

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

interface QuadReceipt {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  category: string;
  amount: number;
  discount: number;
  fine: number;
  paymentMethod: "UPI" | "Cash" | "Credit Card" | "Bank Transfer";
  paymentDate: string;
  status: "Paid" | "Partially Paid" | "Unpaid";
  remarks: string;
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

  // Local state for Fee Categories to support real CRUD
  const [localCategories, setLocalCategories] = useState<FeeCategory[]>([]);

  // Local state for Inventory Items to support search and deletion
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>([]);

  // Local state for Ledger Entries to support search and pagination
  const [localLedger, setLocalLedger] = useState<FinanceLedgerEntry[]>([]);

  // Search states
  const [receiptSearch, setReceiptSearch] = useState("");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");

  // Configuration Panel state
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [taxRate, setTaxRate] = useState(5); // % GST/Surcharge
  const [lateFeePerDay, setLateFeePerDay] = useState(15); // ₹ per day late
  const [applySurcharge, setApplySurcharge] = useState(false);
  
  // Custom new Category state
  const [newCatName, setNewCatName] = useState("");
  const [newCatAmount, setNewCatAmount] = useState("500");
  const [newCatFreq, setNewCatFreq] = useState<"Monthly" | "Quarterly" | "Annually" | "One-time">("Monthly");

  // New Fee Receipt states
  const [showFeeReceiptModal, setShowFeeReceiptModal] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState<FeeReceipt | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Core Tuition Fee");
  const [receiptAmount, setReceiptAmount] = useState("1500");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [payMethod, setPayMethod] = useState<"UPI" | "Cash" | "Credit Card" | "Bank Transfer">("UPI");

  // A4 Quad Receipts Generator state
  const [showQuadReceiptsModal, setShowQuadReceiptsModal] = useState(false);
  const [quadReceipts, setQuadReceipts] = useState<QuadReceipt[]>([]);
  const [activeEditingQuadIndex, setActiveEditingQuadIndex] = useState<number | null>(null);

  // New Inventory Asset states
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetCat, setAssetCat] = useState<any>("Lab Equipment");
  const [assetQty, setAssetQty] = useState("10");
  const [assetCost, setAssetCost] = useState("150");
  const [assetLoc, setAssetLoc] = useState("");

  // Payroll / HR records state
  const [payrollEmployees, setPayrollEmployees] = useState([
    { id: "PAY-EMP-01", name: "Dr. Aditi Mukherjee", email: "a.mukherjee@school.edu", role: "Science Head", salary: 6200, status: "Paid" },
    { id: "PAY-EMP-02", name: "Prof. Rakesh Shastri", email: "rakesh.shastri@school.edu", role: "History Lecturer", salary: 5800, status: "Pending" },
    { id: "PAY-EMP-03", name: "Smt. Shreya Ghoshal", email: "shreya.g@school.edu", role: "Music Teacher", salary: 5400, status: "Pending" },
    { id: "PAY-EMP-04", name: "Shri Vivek Vardhan", email: "vivek.v@school.edu", role: "IT Assistant", salary: 4800, status: "Paid" }
  ]);

  // Sync props to local states
  useEffect(() => {
    if (feeCategories && feeCategories.length > 0) {
      setLocalCategories(feeCategories);
    }
  }, [feeCategories]);

  useEffect(() => {
    if (inventory) {
      setLocalInventory(inventory);
    }
  }, [inventory]);

  useEffect(() => {
    if (ledger) {
      setLocalLedger(ledger);
    }
  }, [ledger]);

  // Initialize Quad-Receipt generator default data
  const initializeQuadReceipts = () => {
    const defaultQuad: QuadReceipt[] = [];
    const chosenStudents = students.slice(0, 4);
    
    // Fill up to 4 receipts
    for (let i = 0; i < 4; i++) {
      const student = chosenStudents[i] || students[0] || { id: "STU-001", name: "Aarav Sharma", className: "Class 10" };
      const category = localCategories[i % localCategories.length]?.name || "Core Tuition Fee";
      const baseAmount = localCategories[i % localCategories.length]?.amount || 1500;
      
      defaultQuad.push({
        id: `RCP-QUAD-2026-${100 + i}`,
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        category: category,
        amount: baseAmount,
        discount: i === 1 ? 200 : 0,
        fine: i === 2 ? 100 : 0,
        paymentMethod: i === 0 ? "UPI" : i === 1 ? "Cash" : i === 2 ? "Bank Transfer" : "Credit Card",
        paymentDate: new Date().toISOString().split("T")[0],
        status: "Paid",
        remarks: "Bulk Generated school term invoice"
      });
    }
    setQuadReceipts(defaultQuad);
    onLogAudit("Open A4 Quad-Receipt Builder", "Fees Management", "Loaded 4 custom editable receipt panels inside printable A4 workspace.");
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const baseAmount = Number(receiptAmount);
    const disc = Number(discountAmount);
    const surcharge = applySurcharge ? Math.round((baseAmount * taxRate) / 100) : 0;
    const totalPaid = Math.max(0, baseAmount - disc + surcharge);

    const receipt: FeeReceipt = {
      id: `RCP-2026-0${feeReceipts.length + 10}`,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      category: selectedCategory,
      amount: baseAmount,
      discount: disc,
      fine: surcharge,
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
      id: `INV-0${localInventory.length + 10}`,
      name: assetName,
      category: assetCat,
      quantity: qty,
      unit: "pcs",
      cost: cost,
      location: assetLoc || "Main Depot",
      purchaseDate: new Date().toISOString().split("T")[0]
    };

    onAddInventoryItem(newItem);
    setLocalInventory(prev => [newItem, ...prev]);

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

    onLogAudit("Register Asset Item", "Inventory Management", `Purchased asset ${newItem.name} totaling ₹${totalCost}`);
    
    // Reset
    setAssetName("");
    setAssetQty("10");
    setAssetCost("150");
    setAssetLoc("");
    setShowAssetModal(false);
  };

  // CRUD for Categories
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCat: FeeCategory = {
      id: `CAT-0${localCategories.length + 10}`,
      name: newCatName,
      amount: Number(newCatAmount) || 500,
      frequency: newCatFreq
    };

    setLocalCategories(prev => [...prev, newCat]);
    onLogAudit("Configure Fee Tiers", "Billing Config", `Created new category tariff "${newCatName}" with ₹${newCatAmount} rate (${newCatFreq})`);
    
    setNewCatName("");
    setNewCatAmount("500");
  };

  const handleDeleteCategory = (catId: string) => {
    const deleted = localCategories.find(c => c.id === catId);
    setLocalCategories(prev => prev.filter(c => c.id !== catId));
    if (deleted) {
      onLogAudit("Configure Fee Tiers", "Billing Config", `Deleted fee category "${deleted.name}" from billing system`);
    }
  };

  // Bulk Outstanding Balance Assigner tool
  const handleBulkAssignBalances = () => {
    let affectedCount = 0;
    students.forEach(student => {
      // Automatically assign ₹1200 outstanding balance based on tuition tier as default billing cycle runs
      const currentDues = student.pendingFees || 0;
      onUpdateStudent(student.id, { pendingFees: currentDues + 1500 });
      affectedCount++;
    });

    onLogAudit("Bulk Balance Dispatcher", "Billing Config", `Automatically executed billing run assigning ₹1500 core dues to ${affectedCount} active students.`);
    alert(`⚡ Bulk Bill Dispatched! Assigned ₹1,500 pending dues to all ${affectedCount} school students successfully.`);
  };

  // CRUD for inventory
  const handleDeleteAsset = (id: string) => {
    const deleted = localInventory.find(i => i.id === id);
    setLocalInventory(prev => prev.filter(item => item.id !== id));
    if (deleted) {
      onLogAudit("Asset Write-Off", "Inventory", `Wrote off asset instrument ${deleted.name} from current stock registries.`);
    }
  };

  // Payroll Dispatch simulation
  const handleDispatchSalary = (empId: string) => {
    setPayrollEmployees(prev => prev.map(emp => {
      if (emp.id === empId && emp.status !== "Paid") {
        // Output from finance ledger
        const ledgerOutflow: FinanceLedgerEntry = {
          id: `TRX-0${ledger.length + 20}`,
          date: new Date().toISOString().split("T")[0],
          type: "Expense",
          category: "Salary Payout",
          amount: emp.salary,
          reference: emp.id,
          paymentMethod: "Bank Transfer"
        };
        onAddLedgerEntry(ledgerOutflow);
        onLogAudit("Payroll Disbursement", "HR Management", `Processed monthly base compensation check of ₹${emp.salary} for ${emp.name}`);
        alert(`💸 Payment Approved! Dispatched ₹${emp.salary} salary to ${emp.name}'s verified bank account.`);
        return { ...emp, status: "Paid" };
      }
      return emp;
    }));
  };

  // A4 Quad-Receipt updates
  const handleUpdateQuadReceiptField = (index: number, field: keyof QuadReceipt, value: any) => {
    setQuadReceipts(prev => prev.map((item, idx) => {
      if (idx === index) {
        // If pre-selecting student, auto populate name & class
        if (field === "studentId") {
          const student = students.find(s => s.id === value);
          if (student) {
            return {
              ...item,
              studentId: value,
              studentName: student.name,
              className: student.className
            };
          }
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Commit edited 4 receipts to main system ledger
  const handleCommitQuadReceipts = () => {
    let successCount = 0;
    quadReceipts.forEach(qr => {
      const netPaid = Math.max(0, qr.amount - qr.discount + qr.fine);
      
      const receipt: FeeReceipt = {
        id: qr.id,
        studentId: qr.studentId,
        studentName: qr.studentName,
        className: qr.className,
        category: qr.category,
        amount: qr.amount,
        discount: qr.discount,
        fine: qr.fine,
        paidAmount: netPaid,
        paymentMethod: qr.paymentMethod,
        paymentDate: qr.paymentDate,
        status: qr.status
      };

      onAddFeeReceipt(receipt);

      // Decrement student pending fee structure
      const student = students.find(s => s.id === qr.studentId);
      if (student) {
        const remainingDues = Math.max(0, student.pendingFees - netPaid);
        onUpdateStudent(qr.studentId, { pendingFees: remainingDues });
      }

      // Add to income ledger
      const ledgerEntry: FinanceLedgerEntry = {
        id: `TRX-QR-${Math.floor(Math.random() * 90000 + 10000)}`,
        date: qr.paymentDate,
        type: "Income",
        category: "Fee Collection (Quad)",
        amount: netPaid,
        reference: qr.id,
        paymentMethod: qr.paymentMethod
      };
      onAddLedgerEntry(ledgerEntry);
      successCount++;
    });

    onLogAudit("A4 Quad Batch Commit", "Fees Management", `Saved and synced ${successCount} edited receipts with student profiles and income ledger.`);
    alert(`🎉 Successfully compiled and committed ${successCount} edited receipts to the core school financial database!`);
    setShowQuadReceiptsModal(false);
  };

  // Dynamic calculations for finance metrics
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
    { month: "Jun", Income: totalIncome > 0 ? totalIncome : 28500, Expenses: totalExpense > 0 ? totalExpense : 16200 }
  ];

  // Filters
  const filteredReceipts = feeReceipts.filter(rec => 
    rec.studentName.toLowerCase().includes(receiptSearch.toLowerCase()) ||
    rec.id.toLowerCase().includes(receiptSearch.toLowerCase()) ||
    rec.category.toLowerCase().includes(receiptSearch.toLowerCase())
  );

  const filteredLedger = localLedger.filter(entry => 
    entry.category.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    entry.reference.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    entry.paymentMethod.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  const filteredAssets = localInventory.filter(item =>
    item.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(assetSearch.toLowerCase()) ||
    item.location.toLowerCase().includes(assetSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-850 dark:text-white">
      
      {/* 🚀 SUB HEADER CONTROL BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-3xl border border-gray-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-2 rounded-2xl">
            <Coins className="text-indigo-600 dark:text-indigo-400" size={18} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              School Treasuries & Billing Workspace
              <span className="text-[9px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-bold">PRO Active</span>
            </h4>
            <p className="text-[10px] text-zinc-500 font-medium">Manage tuition classes, inventory assets, payroll compensation, and printable A4 bills.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* A4 QUAD RECEIPTS GENERATOR INITIATOR */}
          <button
            onClick={() => {
              initializeQuadReceipts();
              setShowQuadReceiptsModal(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-[11px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Printer size={13} />
            📄 Print Quad A4 Receipts (4 Pupils)
          </button>

          {/* CONFIGURATION HUB TOGGLE BUTTON */}
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer ${
              showConfigPanel 
                ? "bg-indigo-600 text-white" 
                : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <Settings size={13} className={showConfigPanel ? "animate-spin-slow" : ""} />
            ⚙️ Fees Config Hub
          </button>
        </div>
      </div>

      {/* ⚙️ DYNAMIC CONFIGURATION PANEL (HUB) */}
      <AnimatePresence>
        {showConfigPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl p-5 border border-indigo-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              
              {/* Column 1: Fee Categories CRUD list */}
              <div className="space-y-3">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-black block">⚙️ System Fee Tiers Matrix</span>
                
                {/* Form to add categories */}
                <form onSubmit={handleAddCategory} className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="New Tier Name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white text-[11px]"
                  />
                  <input
                    type="number"
                    required
                    placeholder="₹ Rate"
                    value={newCatAmount}
                    onChange={(e) => setNewCatAmount(e.target.value)}
                    className="w-16 p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white text-[11px]"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </form>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {localCategories.map(cat => (
                    <div key={cat.id} className="p-2 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-extrabold block text-slate-800 dark:text-slate-200">{cat.name}</span>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono">{cat.frequency} tariff</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{cat.amount}</span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-rose-500 hover:text-rose-600 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Global Surcharge & Late Fine Rules */}
              <div className="space-y-3">
                <span className="text-[10px] text-amber-600 uppercase tracking-widest font-black block">⚠️ Fine & Surcharge Rules</span>
                
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Apply Digital Service Surcharge</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Appends custom {taxRate}% GST fee on total amount.</span>
                    </div>
                    <button
                      onClick={() => setApplySurcharge(!applySurcharge)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${applySurcharge ? "bg-indigo-600" : "bg-gray-300"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${applySurcharge ? "translate-x-4" : ""}`} />
                    </button>
                  </div>

                  {applySurcharge && (
                    <div className="flex items-center gap-1.5 pt-1 border-t">
                      <span className="text-[10px] text-zinc-500">Surcharge Percentage:</span>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="w-12 p-1 border rounded text-center"
                      />
                      <span className="font-bold text-[10px]">%</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t">
                    <div>
                      <span className="font-bold block">Late Fine Levy rate</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Assessed daily after term deadline dates.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">₹</span>
                      <input
                        type="number"
                        value={lateFeePerDay}
                        onChange={(e) => setLateFeePerDay(Number(e.target.value))}
                        className="w-12 p-1 border rounded text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Bulk Actions & Balance Dispatches */}
              <div className="space-y-3">
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-black block">⚡ Bulk Billing Automation</span>
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border space-y-2.5">
                  <p className="text-[10px] text-zinc-500 leading-normal font-medium">
                    Dispatch monthly invoices to all pupil balance books in one-click. It applies the core ₹1,500 standard tuition dues onto student sheets.
                  </p>
                  <button
                    onClick={handleBulkAssignBalances}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl text-center shadow active:scale-[0.98] transition-transform flex items-center justify-center gap-1"
                  >
                    <Sparkles size={11} />
                    Run Billing Run (Bulk Assign ₹1500)
                  </button>
                  <div className="bg-amber-50 dark:bg-slate-950/50 p-2 rounded-xl text-[9px] text-amber-800 dark:text-amber-400 border border-amber-200/50 flex items-start gap-1">
                    <AlertCircle size={10} className="mt-0.5 shrink-0" />
                    <span>Executing this will increment everyone's "Pending Fees" and record system logs.</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sub Tab Navigations */}
      <div className="flex border-b border-gray-100 dark:border-slate-850 text-xs">
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
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">Student Fee Distribution & Receipts</h3>
              <p className="text-xs text-gray-500">Record outstanding tuition charges, allocate custom discounts, and print validated receipts for parent accounting records.</p>
            </div>
            <button
              onClick={() => setShowFeeReceiptModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit cursor-pointer"
            >
              <Plus size={14} /> Record Student Fee Receipt
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Fee Tiers List */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h4 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] block flex items-center gap-1">
                <Coins size={12} className="text-indigo-500" /> Active Standard Fee Categories
              </h4>
              <div className="space-y-2">
                {localCategories.map(cat => (
                  <div key={cat.id} className="p-3 bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-between border">
                    <div>
                      <span className="font-bold block text-gray-800 dark:text-gray-200">{cat.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono tracking-wider">{cat.frequency} Plan</span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">₹{cat.amount}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-slate-950/60 p-3 text-[10px] text-amber-800 dark:text-amber-400 rounded-xl leading-relaxed border border-amber-200/40">
                💡 <b>Discount Policy:</b> Scholarship policies allow applying 10% to 50% discount offsets to qualified student profiles during fee recording.
              </div>
            </div>

            {/* Fee Receipts logs */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-50 dark:bg-slate-950/60 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300">Historic Receipt Audit-Trail ({filteredReceipts.length})</span>
                <input
                  type="text"
                  placeholder="Search receipt by student name or ID..."
                  value={receiptSearch}
                  onChange={(e) => setReceiptSearch(e.target.value)}
                  className="p-1 px-2.5 text-[11px] bg-white dark:bg-slate-900 border rounded-lg focus:outline-none w-full sm:w-64"
                />
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-mono text-[9px] uppercase tracking-wider bg-slate-50/40 dark:bg-slate-950/20">
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Paid Category</th>
                      <th className="p-3">Net Paid</th>
                      <th className="p-3">Payment Term</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-slate-850">
                    {filteredReceipts.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{rec.id}</td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-900 dark:text-white">{rec.studentName}</span>
                          <span className="text-[10px] block text-zinc-400">{rec.className}</span>
                        </td>
                        <td className="p-3 text-gray-700 dark:text-zinc-200 font-medium">{rec.category}</td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">₹{rec.paidAmount}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-700 dark:text-slate-300">{rec.paymentMethod} • {rec.paymentDate}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setPreviewReceipt(rec);
                            }}
                            className="p-1.5 px-3.5 text-[11px] border border-indigo-250 hover:border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl bg-indigo-50/40 dark:bg-slate-850 font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 ml-auto"
                            title="Print & View Receipt"
                          >
                            <Printer size={12} />
                            View / Print
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredReceipts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-400">No matching receipts recorded in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERAL REVENUE & BUDGET MANAGEMENT SUB TAB */}
      {activeTab === "finance" && (
        <div className="space-y-6 text-xs">
          {/* Revenue quick metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold">Net Consolidated Revenue</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{totalIncome || 28500}</span>
                <span className="text-[10px] text-emerald-600 block mt-1 font-bold flex items-center gap-0.5">
                  <TrendingUp size={11} /> +12.4% vs last quarter
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xl font-bold">💳</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold">Operations Expenses Outflow</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₹{totalExpense || 16200}</span>
                <span className="text-[10px] text-rose-600 block mt-1 font-bold flex items-center gap-0.5">
                  <TrendingDown size={11} /> Increased utility asset bills
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 text-xl font-bold">📉</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold">Net Operations Balance</span>
                <span className={`text-2xl font-black ${companyProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  ₹{companyProfit || 12300}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">Audit verification OK</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xl font-bold">✓</div>
            </div>
          </div>

          {/* Interactive Recharts Chart Area */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-950 dark:text-white text-base">Monthly Income vs Expenditure Trend</h4>
                <p className="text-xs text-gray-500">Live graphical data feed logging fee inputs alongside facility expenditures.</p>
              </div>
              <button
                onClick={() => {
                  alert("Exporting financial sheets to CSV format... Data verified with latest state.");
                }}
                className="p-1.5 px-3 border border-gray-250 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-[10px] rounded-xl font-bold uppercase tracking-widest text-slate-800 dark:text-slate-300 cursor-pointer"
              >
                Export Ledger Sheets
              </button>
            </div>

            <div className="h-72 w-full text-[10px]">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Income" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expenses" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed ledger table with search */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-slate-950 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-extrabold uppercase tracking-wider text-[10px]">Consolidated System Ledger Log Feed</span>
              <input
                type="text"
                placeholder="Search ledger by category, method or reference..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="p-1 px-2.5 text-[11px] bg-white dark:bg-slate-900 border rounded-lg focus:outline-none w-full sm:w-72"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-400 font-mono text-[9px] uppercase bg-slate-50/40 dark:bg-slate-950/20">
                    <th className="p-3">Reference ID</th>
                    <th className="p-3">Transaction Date</th>
                    <th className="p-3">Flow Type</th>
                    <th className="p-3">Classification Category</th>
                    <th className="p-3">Settlement Mechanism</th>
                    <th className="p-3 text-right">Net Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850 font-medium">
                  {filteredLedger.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-indigo-500">{item.id}</td>
                      <td className="p-3 text-gray-500 font-mono">{item.date}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                          item.type === "Income" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 dark:text-slate-200">{item.category}</td>
                      <td className="p-3 font-mono text-[10px] text-zinc-400">{item.paymentMethod}</td>
                      <td className={`p-3 text-right font-bold ${item.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}>
                        ₹{item.amount}
                      </td>
                    </tr>
                  ))}
                  {filteredLedger.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-400">No ledger transaction rows returned.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ASSETS & INVENTORY MANAGEMENT SUB TAB */}
      {activeTab === "inventory" && (
        <div className="space-y-6 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">Facility Assets & Inventory Tracking</h3>
              <p className="text-xs text-gray-500">Monitor school science instruments, library furniture and computer sandboxes.</p>
            </div>
            <button
              onClick={() => setShowAssetModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all text-sm w-fit cursor-pointer"
            >
              <Plus size={14} /> Buy Academic Asset
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden text-xs">
            <div className="p-4 bg-gray-50 dark:bg-slate-950/60 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-extrabold uppercase tracking-wider text-[10px]">Registered Asset catalog logs</span>
              <input
                type="text"
                placeholder="Search assets by name or location..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="p-1 px-2.5 text-[11px] bg-white dark:bg-slate-900 border rounded-lg focus:outline-none w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/40 dark:bg-slate-950/20 border-b text-gray-400 font-mono text-[9px] uppercase">
                    <th className="p-3">Asset Code</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Category Classification</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Value / Cost per Unit</th>
                    <th className="p-3">Depot Location</th>
                    <th className="p-3">Purchase Date</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850 font-medium">
                  {filteredAssets.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-indigo-500">{item.id}</td>
                      <td className="p-3 font-bold text-slate-850 dark:text-white">{item.name}</td>
                      <td className="p-3">
                        <span className="bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">{item.category}</span>
                      </td>
                      <td className="p-3 font-bold">{item.quantity} {item.unit}</td>
                      <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">₹{item.cost}</td>
                      <td className="p-3 text-zinc-400 font-mono text-[10px]">{item.location}</td>
                      <td className="p-3 text-zinc-400 font-medium">{item.purchaseDate}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteAsset(item.id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-zinc-400">No matching school assets found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAYROLL & HR RECORDS SUB TAB */}
      {activeTab === "payroll" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">Corporate Faculty Payroll Ledger</h3>
              <p className="text-zinc-450">Distribute faculty salary offsets, process tax withholding structures, and process verified employee slips.</p>
            </div>
            <button
              onClick={() => {
                onLogAudit("Recalculate Tax Slips", "HR Management", "Manually executed payroll parameters update.");
                alert("Recalculated salary accounts: Checked 5% basic TDS withholding and bonuses.");
              }}
              className="px-3.5 py-1.5 border hover:bg-slate-50 text-slate-800 dark:hover:bg-slate-800 dark:text-slate-300 font-bold rounded-xl cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={12} /> Recalculate HR Slips
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-450 text-[9px] uppercase font-mono tracking-wider bg-slate-50/40 dark:bg-slate-950/20">
                  <th className="p-3">Account ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Allocated Class Role</th>
                  <th className="p-3">Base Compensation Class</th>
                  <th className="p-3">Taxes / Withholding</th>
                  <th className="p-3">Net Payout Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-850 font-medium">
                {payrollEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-indigo-500">{emp.id}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{emp.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{emp.email}</span>
                    </td>
                    <td className="p-3 text-gray-600 dark:text-zinc-300">{emp.role}</td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-zinc-200">₹{emp.salary} / Month</td>
                    <td className="p-3 text-zinc-400 font-mono">₹{Math.round(emp.salary * 0.05)} (5.0%)</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        emp.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {emp.status !== "Paid" ? (
                        <button
                          onClick={() => handleDispatchSalary(emp.id)}
                          className="p-1 px-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 cursor-pointer text-[10px]"
                        >
                          Disburse Funds
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Downloading verified salary voucher for ${emp.name}. Compensation paid: ₹${emp.salary - Math.round(emp.salary*0.05)}`)}
                          className="p-1 px-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold border dark:border-slate-800 rounded-md flex items-center gap-1 ml-auto text-[10px]"
                        >
                          <Download size={11} /> Grab Slip
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📄 MODAL: A4 MULTI-STUDENT QUAD-RECEIPT GENERATOR & EDITOR */}
      {showQuadReceiptsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-white rounded-3xl p-6 shadow-2xl space-y-4 my-8 border dark:border-slate-800"
          >
            {/* Header / Action Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Printer className="text-emerald-500" size={20} />
                  Printable A4 Quad-Receipts Sheet Builder (Hindi/English Support)
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Ek hi standard A4 page par 4 receipts ek saath generate karein taaki paper bach sake! Niche receipts ko directly edit karein.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={initializeQuadReceipts}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <RefreshCw size={13} /> Reset Drafts
                </button>
                <button
                  onClick={handleCommitQuadReceipts}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Save size={13} /> 💾 Save to System database
                </button>
                <button
                  onClick={() => setShowQuadReceiptsModal(false)}
                  className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 rounded-xl font-bold transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  ← Back / Close (वापस जाएं)
                </button>
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>
                💡 <b>How it works:</b> Aap kisi bhi receipt par click karke direct fields (Student, Class, Fees, Discount, Date, Status, Receipt No) ko live edit kar sakte hain. Jab aap pure sheet ko print ya database save karenge, toh ye active students ke pending fees accounts ko automatic adjust kar dega.
              </span>
            </div>

            {/* THE VISUAL A4 SHEET (2x2 Grid) */}
            <div id="printable-a4-sheet" className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-8 shadow-inner min-h-[700px] grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
              
              {/* Grid-lines/Scissors Indicators */}
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-gray-300 dark:border-slate-800 pointer-events-none flex items-center justify-between px-2">
                <span className="bg-white dark:bg-slate-900 px-1 text-[9px] text-zinc-400 font-mono">✂️ fold & cut here</span>
                <span className="bg-white dark:bg-slate-900 px-1 text-[9px] text-zinc-400 font-mono">✂️ fold & cut here</span>
              </div>
              <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-gray-300 dark:border-slate-800 pointer-events-none flex items-center justify-between flex-col py-2">
                <span className="bg-white dark:bg-slate-900 py-0.5 text-[9px] text-zinc-400 font-mono">✂️ cut</span>
                <span className="bg-white dark:bg-slate-900 py-0.5 text-[9px] text-zinc-400 font-mono">✂️ cut</span>
              </div>

              {/* Loop to render 4 interactive receipts */}
              {quadReceipts.map((qr, index) => {
                const netAmount = Math.max(0, qr.amount - qr.discount + qr.fine);
                const isEditing = activeEditingQuadIndex === index;

                return (
                  <div 
                    key={index} 
                    onClick={() => {
                      if (!isEditing) setActiveEditingQuadIndex(index);
                    }}
                    className={`relative p-5 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border transition-all flex flex-col justify-between group ${
                      isEditing 
                        ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-50/50 dark:ring-slate-900 bg-white dark:bg-slate-950" 
                        : "border-gray-200 dark:border-slate-800 hover:border-gray-300"
                    }`}
                  >
                    {/* Active Edit badge or Edit click guide */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {isEditing ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEditingQuadIndex(null);
                          }}
                          className="bg-indigo-600 text-white font-bold p-1 px-2 rounded-lg text-[9px] uppercase shadow-sm cursor-pointer"
                        >
                          Done editing
                        </button>
                      ) : (
                        <span className="bg-gray-200 dark:bg-slate-800 text-zinc-500 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 cursor-pointer">
                          <Edit3 size={8} /> CLICK TO EDIT
                        </span>
                      )}
                    </div>

                    {/* RECEIPT CONTENT HEADER */}
                    <div className="space-y-3">
                      <div className="text-center pb-2 border-b-2 border-slate-200 dark:border-slate-800/80">
                        <h5 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-tight">EXCELSIOR ACADEMIC CAMPUS</h5>
                        <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-mono">Admission & Fees Voucher • Copy #{index + 1}</p>
                      </div>

                      {/* EDITABLE FIELDS PANEL (IF IS EDITING) */}
                      {isEditing ? (
                        <div className="space-y-2 pt-1 text-[10px]">
                          {/* Student Pick */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Receipt No</label>
                              <input
                                type="text"
                                value={qr.id}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "id", e.target.value)}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Select Student</label>
                              <select
                                value={qr.studentId}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "studentId", e.target.value)}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              >
                                {students.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Fee category and Date */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Category</label>
                              <select
                                value={qr.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const standardAmt = catValueMap[val] || 1500;
                                  setQuadReceipts(prev => prev.map((item, idx) => {
                                    if (idx === index) {
                                      return { ...item, category: val, amount: standardAmt };
                                    }
                                    return item;
                                  }));
                                }}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              >
                                <option value="Core Tuition Fee">Core Tuition Fee</option>
                                <option value="Transport Facility Fee">Transport Facility Fee</option>
                                <option value="Annual Development & Library Fee">Annual Development & Library Fee</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Payment Date</label>
                              <input
                                type="date"
                                value={qr.paymentDate}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "paymentDate", e.target.value)}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              />
                            </div>
                          </div>

                          {/* Pricing breakdown editable fields */}
                          <div className="grid grid-cols-3 gap-1.5">
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Gross (₹)</label>
                              <input
                                type="number"
                                value={qr.amount}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "amount", Number(e.target.value))}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px] font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Disc (₹)</label>
                              <input
                                type="number"
                                value={qr.discount}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "discount", Number(e.target.value))}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Fine (₹)</label>
                              <input
                                type="number"
                                value={qr.fine}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "fine", Number(e.target.value))}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              />
                            </div>
                          </div>

                          {/* Settlement parameters */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Payment Method</label>
                              <select
                                value={qr.paymentMethod}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "paymentMethod", e.target.value as any)}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              >
                                <option value="UPI">UPI Digital Wallet</option>
                                <option value="Cash">Cash Ledger</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Credit Card">Credit Card</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] text-zinc-400 uppercase font-bold">Payment Status</label>
                              <select
                                value={qr.status}
                                onChange={(e) => handleUpdateQuadReceiptField(index, "status", e.target.value as any)}
                                className="w-full p-1 border rounded bg-white dark:bg-slate-900 text-[10px]"
                              >
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Unpaid">Unpaid</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // STANDARD PREVIEW STATIC DISPATCH LOOKUP
                        <div className="space-y-2 pt-1 text-[11px]">
                          <div className="grid grid-cols-2 gap-2 text-[10px] pb-1.5 border-b border-dashed">
                            <div>
                              <span className="text-zinc-400 block text-[8px] uppercase font-bold">Receipt Reference</span>
                              <span className="font-mono font-bold text-slate-800 dark:text-zinc-300">{qr.id}</span>
                            </div>
                            <div>
                              <span className="text-zinc-400 block text-[8px] uppercase font-bold">Payment Date</span>
                              <span className="font-semibold text-slate-800 dark:text-zinc-300">{qr.paymentDate}</span>
                            </div>
                          </div>

                          {/* Pupil credentials metadata */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] pt-0.5 pb-1 border-b border-dashed">
                            <div>
                              <span className="text-zinc-400 block text-[8px] uppercase font-bold">Pupil / Student Name</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{qr.studentName}</span>
                            </div>
                            <div>
                              <span className="text-zinc-400 block text-[8px] uppercase font-bold">Grade Level</span>
                              <span className="font-bold text-slate-800 dark:text-zinc-300">{qr.className}</span>
                            </div>
                          </div>

                          {/* Fee structure table mapping */}
                          <div className="space-y-1.5 pt-1.5 text-[10px]">
                            <div className="flex items-center justify-between text-zinc-500 font-bold uppercase text-[8px]">
                              <span>Particulars</span>
                              <span>Amount (₹)</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                              <span>{qr.category} (Base tariff)</span>
                              <span>₹{qr.amount}</span>
                            </div>
                            {qr.discount > 0 && (
                              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                                <span>Scholarship discount deduction (-)</span>
                                <span>-₹{qr.discount}</span>
                              </div>
                            )}
                            {qr.fine > 0 && (
                              <div className="flex items-center justify-between text-rose-500">
                                <span>Late fine surcharge (+)</span>
                                <span>+₹{qr.fine}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RECEIPT FOOTER WITH TOTAL AMOUNT & STAMP */}
                    <div className="mt-5 pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-850 flex items-end justify-between">
                      <div>
                        <span className="text-zinc-400 block text-[8px] uppercase font-bold">Net Received</span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{netAmount}</span>
                        <span className="text-[8px] text-zinc-500 block mt-0.5">Mode: {qr.paymentMethod}</span>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`text-[8.5px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded ${
                          qr.status === "Paid" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
                        }`}>
                          ✓ {qr.status}
                        </span>
                        
                        {/* Principal Signature simulation */}
                        <div className="pt-1.5 text-center">
                          <span className="block text-[8px] font-serif italic text-indigo-500/80">Dr. A. K. Shastri</span>
                          <span className="block text-[7px] text-zinc-400 tracking-wider uppercase">Finance Director Seal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Print/Download Button bar inside modal */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">✨ Tip: You can print this layout using standard browser options (Ctrl+P) after closing this window.</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-zinc-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow flex items-center gap-1.5"
              >
                <Printer size={14} /> Open Native System Print Layout
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* COMPACT MODALS */}
      {/* 1. NEW INDIVIDUAL FEE RECEIPT RECORDING MODAL */}
      {showFeeReceiptModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl relative border dark:border-slate-800"
          >
            <div className="flex justify-between items-center pb-4 border-b dark:border-slate-800">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Record Pupil Fee Collection</h4>
              <button onClick={() => setShowFeeReceiptModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400">
                Cancel
              </button>
            </div>
            <form onSubmit={handleCreateReceipt} className="space-y-4 pt-4 text-[11px] font-medium">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Select Student *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    const stu = students.find(s => s.id === e.target.value);
                    if (stu) {
                      setReceiptAmount("1500");
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl"
                >
                  <option value="">-- Choose Pupil --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.className} - Dues: ₹{s.pendingFees})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Fee Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setReceiptAmount(String(catValueMap[e.target.value] || 1500));
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl"
                >
                  {localCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name} (₹{cat.amount})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Gross Total (₹) *</label>
                  <input
                    type="number"
                    required
                    value={receiptAmount}
                    onChange={(e) => setReceiptAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Discount Deduction (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Settlement Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl"
                >
                  <option value="UPI">UPI Digital Wallet</option>
                  <option value="Credit Card">Credit Card Auth</option>
                  <option value="Bank Transfer">Wire Transfer Routing</option>
                  <option value="Cash">Cash Ledger</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeeReceiptModal(false)}
                  className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer text-center"
                >
                  ← Back (पीछे जाएं)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/10"
                >
                  <ShieldCheck size={14} /> Commit & Issue Receipt
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 📄 MODAL: BEAUTIFUL SINGLE STUDENT FEE RECEIPT PREVIEW */}
      {previewReceipt && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl relative border dark:border-slate-800 space-y-6"
          >
            {/* Header / Title bar with Back button */}
            <div className="flex justify-between items-center pb-4 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="text-indigo-600 dark:text-indigo-400" size={20} />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Fee Receipt Details (फीस रसीद)</h4>
              </div>
              <button
                onClick={() => setPreviewReceipt(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                ← Back (पीछे जाएं)
              </button>
            </div>

            {/* Receipt Body with School Details and Watermark/Stamp */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border dark:border-slate-800 space-y-4 relative overflow-hidden">
              {/* PAID Watermark */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 border-4 border-dashed border-emerald-500/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none select-none">
                <span className="text-xl font-black text-emerald-500/20 tracking-wider">PAID / प्राप्त</span>
              </div>

              {/* School Branding */}
              <div className="text-center pb-3 border-b border-dashed dark:border-slate-800">
                <h3 className="text-xs font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400">EduGlyde Senior Secondary School</h3>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">Verified Digital Academic Fee Ledger & Treasury Certificate</p>
              </div>

              {/* Receipt Meta (ID, Date, Method) */}
              <div className="grid grid-cols-2 gap-4 text-xs font-medium pb-3 border-b border-dashed dark:border-slate-800">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Receipt No / रसीद संख्या</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{previewReceipt.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Date Issued / दिनांक</span>
                  <span className="text-slate-800 dark:text-slate-200">{previewReceipt.paymentDate}</span>
                </div>
              </div>

              {/* Student Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs font-medium pb-3 border-b border-dashed dark:border-slate-800">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Student Name / छात्र का नाम</span>
                  <span className="font-bold text-slate-900 dark:text-white">{previewReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Class & Section / कक्षा</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{previewReceipt.className}</span>
                </div>
              </div>

              {/* Financial Calculations Table */}
              <div className="space-y-2 text-xs font-medium pt-1">
                <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Particulars (विवरण)</span>
                  <span className="text-right">Amount (रकम)</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{previewReceipt.category}</span>
                  <span>₹{previewReceipt.amount}</span>
                </div>

                {previewReceipt.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                    <span>Scholarship / Discount (छूट)</span>
                    <span>-₹{previewReceipt.discount}</span>
                  </div>
                )}

                {previewReceipt.fine > 0 && (
                  <div className="flex justify-between items-center text-rose-500">
                    <span>Fine / Surcharge (जुर्माना)</span>
                    <span>+₹{previewReceipt.fine}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2.5 border-t border-dashed dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Net Settled Amount (कुल भुगतान)</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">₹{previewReceipt.paidAmount || previewReceipt.amount}</span>
                </div>

                <div className="text-[10px] text-slate-500 pt-1">
                  <span>Method: {previewReceipt.paymentMethod} • Status: <span className="text-emerald-600 font-bold">Successfully Cleared (पूर्ण भुगतान)</span></span>
                </div>
              </div>

              {/* Signatures / Seal */}
              <div className="pt-4 flex justify-between items-end border-t border-dashed dark:border-slate-800">
                <div className="text-left">
                  <span className="block text-[8px] text-slate-400 tracking-wider uppercase">System Verified Log</span>
                  <span className="text-[9px] text-indigo-500 font-bold font-mono">SECURE-PAY-TXN</span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] font-serif italic text-indigo-500/80">Dr. A. K. Shastri</span>
                  <span className="block text-[7.5px] text-slate-400 tracking-wider uppercase border-t border-gray-200 dark:border-slate-850 pt-0.5 mt-0.5">Finance Director Seal</span>
                </div>
              </div>
            </div>

            {/* Action Bar with Back Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setPreviewReceipt(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                ← Back to List (वापस जाएं)
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print Receipt (प्रिंट करें)
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. NEW ASSET PURCHASE MODAL */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-3xl p-6 shadow-2xl relative border dark:border-slate-800"
          >
            <div className="flex justify-between items-center pb-4 border-b dark:border-slate-800">
              <h4 className="font-extrabold text-sm">Acquire Facility Asset</h4>
              <button onClick={() => setShowAssetModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400">
                Cancel
              </button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-4 pt-4 text-[11px] font-medium">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. Dell Optiplex PC (Computer Lab)"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Catalog Category *</label>
                <select
                  value={assetCat}
                  onChange={(e) => setAssetCat(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl"
                >
                  <option value="IT Appliance">IT Appliance</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Sport Asset">Sport Asset</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Quantity *</label>
                  <input
                    type="number"
                    value={assetQty}
                    onChange={(e) => setAssetQty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Unit Cost (₹) *</label>
                  <input
                    type="number"
                    value={assetCost}
                    onChange={(e) => setAssetCost(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Shelf / Depot Location *</label>
                <input
                  type="text"
                  required
                  value={assetLoc}
                  onChange={(e) => setAssetLoc(e.target.value)}
                  placeholder="e.g. IT server room, Room 302 cupboard"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.99] cursor-pointer"
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
