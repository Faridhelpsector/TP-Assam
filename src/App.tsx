/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Student,
  Teacher,
  Staff,
  ClassElement,
  AttendanceRecord,
  FeeCategory,
  FeeReceipt,
  ExamRecord,
  BookRecord,
  TransportVehicle,
  HostelRoom,
  CommunicationItem,
  HomeworkAssignment,
  LMSLecture,
  InventoryItem,
  FinanceLedgerEntry,
  AuditLog,
  UserRole,
  LandingTopper,
  LandingFaculty,
  LandingCurriculum,
  LandingFAQ,
  LandingTexts
} from "./types";

import {
  initialStudents,
  initialTeachers,
  initialStaff,
  initialClasses,
  initialAttendance,
  initialFeeCategories,
  initialFeeReceipts,
  initialExamRecords,
  initialBooks,
  initialVehicles,
  initialHostels,
  initialCommunications,
  initialHomework,
  initialLMSLectures,
  initialInventory,
  initialLedger,
  initialAuditLogs,
  getStoredData,
  setStoredData,
  initialToppers,
  initialFaculty,
  initialCurriculums,
  initialFAQs,
  initialLandingTexts
} from "./data/mockData";

// Icons imports from lucide-react
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Sparkles,
  Search,
  MessageSquare,
  Lock,
  Sun,
  Moon,
  Menu,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Bell,
  Camera,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  DollarSign,
  User,
  LogOut,
  Library,
  Bus,
  MapPin,
  FileSpreadsheet,
  Plus,
  X,
  Settings,
  Contact
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

// Modules layout
import StudentManagement from "./components/modules/StudentManagement";
import TeacherManagement from "./components/modules/TeacherManagement";
import StaffManagement from "./components/modules/StaffManagement";
import AcademicAttendance from "./components/modules/AcademicAttendance";
import FeesFinance from "./components/modules/FeesFinance";
import ExamPromotion from "./components/modules/ExamPromotion";
import ServicesFacility from "./components/modules/ServicesFacility";
import CommunicationReports from "./components/modules/CommunicationReports";
import SecuritySettings from "./components/modules/SecuritySettings";
import FaceScannerAttendance from "./components/modules/FaceScannerAttendance";
import LockScreen from "./components/LockScreen";
import LandingPage from "./components/LandingPage";
import LandingCMSPanel from "./components/modules/LandingCMSPanel";
import IdCardGenerator from "./components/modules/IdCardGenerator";
import { builtInThemes, ThemeDefinition } from "./themeConfig";

type ActiveTab =
  | "dashboard"
  | "students"
  | "teachers"
  | "staff"
  | "academics"
  | "finance"
  | "exams"
  | "facilities"
  | "comms"
  | "security"
  | "id-cards"
  | "landing-cms";

export default function App() {
  // Theme dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("edu_theme_dark");
    return saved === "true";
  });

  // Global Multi-Theme Switcher State
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem("edu_theme_id") || "modern-education-pro";
  });

  const currentTheme = builtInThemes.find(t => t.id === currentThemeId) || builtInThemes[0];

  useEffect(() => {
    localStorage.setItem("edu_theme_id", currentThemeId);
  }, [currentThemeId]);

  // Collapsible Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Core Data Lists State with LocalStorage Persistence
  const [students, setStudents] = useState<Student[]>(() => getStoredData("students", initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => getStoredData("teachers", initialTeachers));
  const [staff, setStaff] = useState<Staff[]>(() => getStoredData("staff", initialStaff));
  const [classes, setClasses] = useState<ClassElement[]>(() => getStoredData("classes", initialClasses));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStoredData("attendance", initialAttendance));
  const [feeCategories] = useState<FeeCategory[]>(() => getStoredData("fee_categories", initialFeeCategories));
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>(() => getStoredData("fee_receipts", initialFeeReceipts));
  const [examRecords, setExamRecords] = useState<ExamRecord[]>(() => getStoredData("exam_records", initialExamRecords));
  const [books, setBooks] = useState<BookRecord[]>(() => getStoredData("books", initialBooks));
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(() => getStoredData("vehicles", initialVehicles));
  const [hostels] = useState<HostelRoom[]>(() => getStoredData("hostels", initialHostels));
  const [communications, setCommunications] = useState<CommunicationItem[]>(() => getStoredData("communications", initialCommunications));
  const [homework, setHomework] = useState<HomeworkAssignment[]>(() => getStoredData("homework", initialHomework));
  const [lmsLectures] = useState<LMSLecture[]>(() => getStoredData("lms_lectures", initialLMSLectures));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getStoredData("inventory", initialInventory));
  const [ledger, setLedger] = useState<FinanceLedgerEntry[]>(() => getStoredData("ledger", initialLedger));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStoredData("audit_logs", initialAuditLogs));

  // Landing Page dynamic content states
  const [landingToppers, setLandingToppers] = useState<LandingTopper[]>(() => getStoredData("landing_toppers", initialToppers));
  const [landingFaculty, setLandingFaculty] = useState<LandingFaculty[]>(() => getStoredData("landing_faculty", initialFaculty));
  const [landingCurriculums, setLandingCurriculums] = useState<LandingCurriculum[]>(() => getStoredData("landing_curriculums", initialCurriculums));
  const [landingFAQs, setLandingFAQs] = useState<LandingFAQ[]>(() => getStoredData("landing_faqs", initialFAQs));
  const [landingTexts, setLandingTexts] = useState<LandingTexts>(() => getStoredData("landing_texts", initialLandingTexts));

  // Secondary State
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("edu_admin_logged_in") !== "false";
  });
  const [academicSessions, setAcademicSessions] = useState<string[]>(() => {
    return getStoredData("academic_sessions_list", ["Session 2024-25", "Session 2025-26", "Session 2026-27"]);
  });
  const [activeAcademicSession, setActiveAcademicSession] = useState<string>(() => {
    return localStorage.getItem("edu_active_session") || "Session 2026-27";
  });
  const [showCreateSessionModal, setShowCreateSessionModal] = useState<boolean>(false);
  const [newSessionNameInput, setNewSessionNameInput] = useState<string>("");
  const [dashboardSubTab, setDashboardSubTab] = useState<"overview" | "face-scanner">("overview");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // AI Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am EduGlyde, your school's central AI counselor. Ask me to formulate a study timetable, identify student fee defaulting patterns, generate analytical summaries, or predict GPA performance margins!"
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // AI Instant Actions states
  const [aiInsightResult, setAiInsightResult] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // Auto save data changes to storage
  useEffect(() => {
    setStoredData("students", students);
  }, [students]);

  useEffect(() => {
    setStoredData("teachers", teachers);
  }, [teachers]);

  useEffect(() => {
    setStoredData("staff", staff);
  }, [staff]);

  useEffect(() => {
    setStoredData("attendance", attendance);
  }, [attendance]);

  useEffect(() => {
    setStoredData("fee_receipts", feeReceipts);
  }, [feeReceipts]);

  useEffect(() => {
    setStoredData("exam_records", examRecords);
  }, [examRecords]);

  useEffect(() => {
    setStoredData("books", books);
  }, [books]);

  useEffect(() => {
    setStoredData("vehicles", vehicles);
  }, [vehicles]);

  useEffect(() => {
    setStoredData("communications", communications);
  }, [communications]);

  useEffect(() => {
    setStoredData("homework", homework);
  }, [homework]);

  useEffect(() => {
    setStoredData("inventory", inventory);
  }, [inventory]);

  useEffect(() => {
    setStoredData("ledger", ledger);
  }, [ledger]);

  useEffect(() => {
    setStoredData("audit_logs", auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    setStoredData("academic_sessions_list", academicSessions);
  }, [academicSessions]);

  useEffect(() => {
    setStoredData("landing_toppers", landingToppers);
  }, [landingToppers]);

  useEffect(() => {
    setStoredData("landing_faculty", landingFaculty);
  }, [landingFaculty]);

  useEffect(() => {
    setStoredData("landing_curriculums", landingCurriculums);
  }, [landingCurriculums]);

  useEffect(() => {
    setStoredData("landing_faqs", landingFAQs);
  }, [landingFAQs]);

  useEffect(() => {
    setStoredData("landing_texts", landingTexts);
  }, [landingTexts]);

  // Dark/Light theme class application
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("edu_theme_dark", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("edu_theme_dark", "false");
    }
  }, [isDarkMode]);

  // Append new secure Audit item in real-time
  const handleLogAudit = (action: string, module: string, details: string) => {
    const nextLog: AuditLog = {
      id: `LOG-0${auditLogs.length + 10}`,
      timestamp: new Date().toISOString(),
      userEmail: "advisor.office@eduglyde.com",
      role: "Super Admin",
      action,
      module,
      details
    };
    setAuditLogs(current => [nextLog, ...current]);
  };

  // Add handlers for unified state update
  const handleAddStudent = (s: Student) => setStudents(prev => [s, ...prev]);
  const handleUpdateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleAddTeacher = (t: Teacher) => setTeachers(prev => [t, ...prev]);
  const handleUpdateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleAddStaff = (member: Staff) => setStaff(prev => [member, ...prev]);
  const handleUpdateStaff = (id: string, updated: Partial<Staff>) => {
    setStaff(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleAddAttendance = (record: AttendanceRecord) => setAttendance(prev => [record, ...prev]);
  const handleAddHomework = (hw: HomeworkAssignment) => setHomework(prev => [hw, ...prev]);
  const handleAddFeeReceipt = (receipt: FeeReceipt) => setFeeReceipts(prev => [receipt, ...prev]);
  const handleAddLedgerEntry = (entry: FinanceLedgerEntry) => setLedger(prev => [entry, ...prev]);
  const handleAddInventoryItem = (item: InventoryItem) => setInventory(prev => [item, ...prev]);
  const handleAddExamRecord = (record: ExamRecord) => setExamRecords(prev => [record, ...prev]);
  const handleUpdateExamRecord = (id: string, updated: Partial<ExamRecord>) => {
    setExamRecords(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleAddCommunication = (com: CommunicationItem) => setCommunications(prev => [com, ...prev]);
  const handleAddBook = (book: BookRecord) => {
    setBooks(prev => [book, ...prev]);
  };
  const handleUpdateBook = (id: string, updated: Partial<BookRecord>) => {
    setBooks(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };
  const handleUpdateVehicle = (id: string, updated: Partial<TransportVehicle>) => {
    setVehicles(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    handleLogAudit("Wipe Audit Ledger", "Security Features", "Wiped administrative access audit trail database log.");
  };

  // AI endpoint: Send message callback
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = { role: "user" as const, content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, userMsg] })
      });
      const resData = await response.json();
      if (resData.success) {
        setChatMessages(prev => [...prev, { role: "assistant", content: resData.text }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: "AI service failed. Using local backup parameters." }]);
      }
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble dialing into the AI mainframe right now. Please confirm your internet connection."
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // AI endpoint: Get predictions insights
  const handleTriggerPrediction = async (task: string, payload: any) => {
    setIsInsightLoading(true);
    setAiInsightResult(null);

    try {
      const response = await fetch("/api/gemini/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, data: payload })
      });
      const resData = await response.json();
      if (resData.success) {
        setAiInsightResult(resData.text);
        handleLogAudit(`Trigger AI ${task}`, "Overview Dashboard", `Generated real-time AI modeling prediction parameters.`);
      } else {
        setAiInsightResult("Oops, unable to contact Google Gemini API pipelines. Fallback prediction was blocked.");
      }
    } catch {
      setAiInsightResult("Service temporarily offline. Ensure server port 3000 is listening.");
    } finally {
      setIsInsightLoading(false);
    }
  };

  // Aggregated card counters
  const totalStudentsCount = students.filter(s => s.status === "Active").length;
  const totalTeachersCount = teachers.filter(t => t.status === "Active").length;
  const totalStaffCount = staff.filter(s => s.status === "Active").length;
  const loggedGateToday = attendance.filter(a => a.date === "2026-06-11" && (a.status === "Present" || a.status === "Late")).length;
  const outstandingFeesTotal = students.reduce((sum, current) => sum + current.pendingFees, 0);

  // Compute overall class average performance
  const avgPerformanceCGPA = Math.round(
    students.reduce((sum, s) => sum + s.gradePerformance, 0) / (students.length || 1)
  );

  if (!isAdminLoggedIn) {
    return (
      <LandingPage
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        onUnlock={() => {
          setIsAdminLoggedIn(true);
          localStorage.setItem("edu_admin_logged_in", "true");
        }}
        onLogAudit={handleLogAudit}
        toppers={landingToppers}
        faculty={landingFaculty}
        curriculums={landingCurriculums}
        faqs={landingFAQs}
        texts={landingTexts}
      />
    );
  }

  return (
    <div className={`h-screen overflow-hidden ${currentTheme.fontSans} ${currentTheme.mainBg} text-slate-900 dark:text-slate-100 flex antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      
      {/* collapsible LEFT SIDEBAR */}
      <aside
        className={`${currentTheme.sidebarBg} ${currentTheme.sidebarText} border-r ${currentTheme.sidebarBorder} flex flex-col justify-between transition-all duration-300 z-30 sticky top-0 h-screen shadow-xl select-none ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* LOGO AREA - Premium dark background style from Design HTML */}
          <div className={`p-5 flex items-center justify-between ${currentTheme.sidebarHeaderBg} border-b ${currentTheme.sidebarBorder}/60 shrink-0`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                {currentTheme.bannerPattern}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-tight tracking-tight">EduCore Pro</span>
                  <p className="text-[10px] uppercase tracking-widest text-[#94a3b8]/60 font-semibold">{currentTheme.name}</p>
                </div>
              )}
            </div>

            {/* Sidebar trigger */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 hover:bg-slate-805 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Navigation Links list with dividers and custom high density styling */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {!isSidebarCollapsed && (
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-2">Main Menu</div>
            )}
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "students", label: "Students", icon: Users },
              { id: "teachers", label: "Teachers", icon: Award }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 font-semibold transition-all cursor-pointer relative group ${
                    isActive
                      ? currentTheme.sidebarActiveBadge
                      : `${currentTheme.sidebarText} ${currentTheme.sidebarHover}`
                  }`}
                >
                  <Icon size={17} className={isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"} />
                  {!isSidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  
                  {/* Tooltip for collapsed mode */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-16 px-2.5 py-1.5 bg-slate-950 text-white text-[10px] rounded-lg shadow font-bold tracking-wide pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-40">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}

            {!isSidebarCollapsed && (
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pt-4 pb-2">Administrative</div>
            )}
            {[
              { id: "finance", label: "Fees & Finance", icon: CreditCard },
              { id: "exams", label: "Examinations", icon: GraduationCap },
              { id: "id-cards", label: "Smart ID Cards", icon: Contact },
              { id: "landing-cms", label: "Landing Page Editor", icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 font-semibold transition-all cursor-pointer relative group ${
                    isActive
                      ? currentTheme.sidebarActiveBadge
                      : `${currentTheme.sidebarText} ${currentTheme.sidebarHover}`
                  }`}
                >
                  <Icon size={17} className={isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"} />
                  {!isSidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  
                  {/* Tooltip for collapsed mode */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-16 px-2.5 py-1.5 bg-slate-950 text-white text-[10px] rounded-lg shadow font-bold tracking-wide pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-40">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* LOGGED IN USER PROFILE SECTION - Styled identically to Design HTML */}
        <div className={`p-4 ${currentTheme.sidebarHeaderBg}/50 border-t ${currentTheme.sidebarBorder} shrink-0`}>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full gap-2 overflow-hidden">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-full ${currentTheme.badgeAccent} flex items-center justify-center font-bold flex-shrink-0`}>
                  M
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="font-semibold text-sm text-white">Admin Office</span>
                    <span className="text-[10px] text-slate-500">Super Admin Principal</span>
                  </div>
                )}
              </div>
              
              {!isSidebarCollapsed && (
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    localStorage.setItem("edu_admin_logged_in", "false");
                    handleLogAudit("User Log Out", "Authentication", "Admin manually signed out of terminal session");
                  }}
                  className="p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-all flex-shrink-0"
                  title="Secure Logout"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

            {isSidebarCollapsed && (
              <button
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  localStorage.setItem("edu_admin_logged_in", "false");
                  handleLogAudit("User Log Out", "Authentication", "Admin manually signed out of terminal session");
                }}
                className="p-2 text-rose-450 text-rose-450 hover:bg-rose-500/10 hover:text-rose-500 text-rose-400 rounded-xl cursor-pointer transition-all flex-shrink-0"
                title="Secure Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <main className="flex-1 flex flex-col justify-between min-w-0 overflow-y-auto">
        
        {/* HEADER TOOLBAR - Designed custom like High Density header */}
        <header className={`h-16 ${currentTheme.headerBg} border-b ${currentTheme.headerBorder} flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 backdrop-blur-md`}>
          <div className="flex flex-wrap items-center gap-4">
            <span className={`font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${currentTheme.badgeAccent}`}>
              <CheckCircle size={10} className="text-emerald-500" /> Connection: Verified {currentTheme.name}
            </span>

            {/* Academic Session Picker */}
            <div className="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                📅 Active Session:
              </span>
              <select
                id="academic-session-selector"
                value={activeAcademicSession}
                onChange={(e) => {
                  setActiveAcademicSession(e.target.value);
                  localStorage.setItem("edu_active_session", e.target.value);
                  handleLogAudit("Switch Academic Session", "Session Management", `Switched active academic working session to ${e.target.value}`);
                }}
                className={`py-1 px-2.5 focus:ring-1 focus:ring-indigo-500 font-extrabold text-[10.5px] rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border ${currentTheme.cardBorder} cursor-pointer shadow-sm`}
              >
                {academicSessions.map((sessionName) => (
                  <option key={sessionName} value={sessionName}>
                    {sessionName}
                  </option>
                ))}
              </select>

              {/* Add/Create Session quick action button */}
              <button
                id="quick-add-session-btn"
                onClick={() => setShowCreateSessionModal(true)}
                title="Create New Academic Session"
                className="cursor-pointer p-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/45 dark:hover:bg-indigo-905/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 font-bold hover:scale-105 transition-all"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic Multi-Theme Switcher Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Theme:</span>
              <select
                value={currentThemeId}
                onChange={(e) => {
                  setCurrentThemeId(e.target.value);
                  handleLogAudit("Change Global Theme", "Visual System", `Theme changed to "${e.target.value}"`);
                }}
                className={`p-1.5 focus:ring-1 focus:ring-indigo-500 font-semibold text-xs rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border ${currentTheme.cardBorder} cursor-pointer`}
              >
                {builtInThemes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark/Light trigger */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 border dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-900 cursor-pointer transition-colors"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Settings trigger */}
            <button
              onClick={() => {
                setActiveTab("landing-cms");
                handleLogAudit("Open Landing CMS", "Navigation", "Opened Landing Page Content Manager from Header Settings Icon");
              }}
              title="Open Landing Page CMS"
              className={`p-2 border dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                activeTab === "landing-cms" ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400" : "text-slate-450 hover:text-slate-900"
              }`}
            >
              <Settings size={15} />
            </button>

            {/* Quick date display */}
            <span className={`text-xs font-bold font-mono px-3 py-1 bg-slate-100 dark:bg-slate-950 rounded-xl border ${currentTheme.cardBorder}`}>
              2026-06-11
            </span>
          </div>
        </header>

        {/* DYNAMIC SCENE CONTAINER */}
        <div className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              
              {/* === OVERVIEW DASHBOARD === */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  
                  {/* TOP CONTROL NAVIGATION HUB NAVBAR */}
                  <div className={`p-4 bg-white/75 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border ${currentTheme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-2xl bg-indigo-600/10 text-indigo-505 text-indigo-500 font-bold text-lg">
                        🏫
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-xs tracking-wider uppercase">Dashboard Sub-View Console</h3>
                        <p className="text-[10px] text-gray-500 font-mono">Module Selection: {dashboardSubTab === "overview" ? "Interactive Overview" : "Holographic Biometric Scanner"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setDashboardSubTab("overview")}
                        className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          dashboardSubTab === "overview"
                            ? `${currentTheme.buttonPrimary} shadow-md`
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border"
                        }`}
                      >
                        📊 Overview Dashboard
                      </button>

                      <button
                        onClick={() => setDashboardSubTab("face-scanner")}
                        className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                          dashboardSubTab === "face-scanner"
                            ? `${currentTheme.buttonPrimary} shadow-md`
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border"
                        }`}
                      >
                        <Camera size={13} className="animate-pulse text-cyan-400" />
                        👁️ Face Scanner Attendance
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {dashboardSubTab === "face-scanner" ? (
                    <FaceScannerAttendance
                      students={students}
                      attendance={attendance}
                      setAttendance={setAttendance}
                      currentTheme={currentTheme}
                      onLogAudit={handleLogAudit}
                    />
                  ) : (
                    <>
                      {/* STATS COUNT GRID (Premium Dashboard cards with Custom Theme styling) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`${currentTheme.cardBg} ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} p-5 ${currentTheme.cardShadow} ${currentTheme.glowEffect} flex items-center justify-between border-l-4 border-l-indigo-600 hover:translate-y-[-2px] transition-transform duration-200`}>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Total Active Students</span>
                        <span className="text-3xl font-black mt-1 block text-slate-900 dark:text-white">{totalStudentsCount}</span>
                        <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ 100% Onboard Verified</span>
                      </div>
                      <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                        👥
                      </div>
                    </div>

                    <div className={`${currentTheme.cardBg} ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} p-5 ${currentTheme.cardShadow} ${currentTheme.glowEffect} flex items-center justify-between border-l-4 border-l-orange-500 hover:translate-y-[-2px] transition-transform duration-200`}>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Assigned Instructors</span>
                        <span className="text-3xl font-black mt-1 block text-slate-900 dark:text-white">{totalTeachersCount}</span>
                        <span className="text-[10px] text-orange-600 block mt-1 font-bold">4.9 Average rating</span>
                      </div>
                      <div className="p-4 rounded-full bg-orange-50 text-orange-600 text-xl font-bold">
                        📝
                      </div>
                    </div>

                    <div className={`${currentTheme.cardBg} ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} p-5 ${currentTheme.cardShadow} ${currentTheme.glowEffect} flex items-center justify-between border-l-4 border-l-teal-500 hover:translate-y-[-2px] transition-transform duration-200`}>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Operational Support Units</span>
                        <span className="text-3xl font-black mt-1 block text-slate-900 dark:text-white">{totalStaffCount}</span>
                        <span className="text-[10px] text-teal-600 block mt-1 font-mono">STF pool rosters complete</span>
                      </div>
                      <div className="p-4 rounded-full bg-teal-50 text-teal-600 text-xl font-bold">
                        💼
                      </div>
                    </div>

                    <div className={`${currentTheme.cardBg} ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} p-5 ${currentTheme.cardShadow} ${currentTheme.glowEffect} flex items-center justify-between border-l-4 border-l-rose-500 hover:translate-y-[-2px] transition-transform duration-200`}>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Consolidated Outstanding fee</span>
                        <span className="text-3xl font-black mt-1 block text-slate-900 dark:text-white text-rose-600">₹{outstandingFeesTotal}</span>
                        <span className="text-[10px] text-red-500 block mt-1 font-bold italic">High alert defaulters warnings active</span>
                      </div>
                      <div className="p-4 rounded-full bg-rose-50 text-rose-500 text-xl font-bold">
                        💳
                      </div>
                    </div>
                  </div>
                </>
                )}
              </div>
            )}

              {/* === STUDENTS MANAGEMENT SCREEN === */}
              {activeTab === "students" && (
                <StudentManagement
                  students={students}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                  currentTheme={currentTheme}
                />
              )}

              {/* === TEACHERS MANAGEMENT SCREEN === */}
              {activeTab === "teachers" && (
                <TeacherManagement
                  teachers={teachers}
                  onAddTeacher={handleAddTeacher}
                  onUpdateTeacher={handleUpdateTeacher}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* === STAFF MANAGEMENT SCREEN === */}
              {activeTab === "staff" && (
                <StaffManagement
                  staffList={staff}
                  onAddStaff={handleAddStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* === ATTENDANCE & ACADEMICS SCREEN === */}
              {activeTab === "academics" && (
                <AcademicAttendance
                  students={students}
                  teachers={teachers}
                  staff={staff}
                  classes={classes}
                  attendance={attendance}
                  lmsLectures={lmsLectures}
                  homework={homework}
                  onAddAttendance={handleAddAttendance}
                  onAddHomework={handleAddHomework}
                  onLogAudit={handleLogAudit}
                />
              )}

              {/* === FINANCE & LEGER PORTAL === */}
              {activeTab === "finance" && (
                <FeesFinance
                  students={students}
                  feeCategories={feeCategories}
                  feeReceipts={feeReceipts}
                  inventory={inventory}
                  ledger={ledger}
                  onAddFeeReceipt={handleAddFeeReceipt}
                  onAddLedgerEntry={handleAddLedgerEntry}
                  onAddInventoryItem={handleAddInventoryItem}
                  onUpdateStudent={handleUpdateStudent}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* === EXAMINATIONS AND PROMOTIONS SCREEN === */}
              {activeTab === "exams" && (
                <ExamPromotion
                  students={students}
                  examRecords={examRecords}
                  onAddExamRecord={handleAddExamRecord}
                  onUpdateExamRecord={handleUpdateExamRecord}
                  onUpdateStudent={handleUpdateStudent}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* === SERVICES, VEHICLES & FACILITIES === */}
              {activeTab === "facilities" && (
                <ServicesFacility
                  students={students}
                  books={books}
                  vehicles={vehicles}
                  hostels={hostels}
                  onAddBook={handleAddBook}
                  onUpdateBook={handleUpdateBook}
                  onUpdateVehicle={handleUpdateVehicle}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* === ANNOUNCEMENT CORNER AND REPORTING CARDS === */}
              {activeTab === "comms" && (
                <CommunicationReports
                  students={students}
                  feeReceipts={feeReceipts}
                  examRecords={examRecords}
                  communications={communications}
                  onAddCommunication={handleAddCommunication}
                  onLogAudit={handleLogAudit}
                />
              )}

              {/* === SECURITY MATRIX AND SYSTEM CONTROLS === */}
              {activeTab === "security" && (
                <SecuritySettings
                  auditLogs={auditLogs}
                  onClearAuditLogs={handleClearAuditLogs}
                  onLogAudit={handleLogAudit}
                  currentThemeId={currentThemeId}
                  onThemeChange={setCurrentThemeId}
                />
              )}

              {/* === LANDING PAGE CONTENT MANAGEMENT PANEL === */}
              {activeTab === "landing-cms" && (
                <LandingCMSPanel
                  toppers={landingToppers}
                  setToppers={setLandingToppers}
                  faculty={landingFaculty}
                  setFaculty={setLandingFaculty}
                  curriculums={landingCurriculums}
                  setCurriculums={setLandingCurriculums}
                  faqs={landingFAQs}
                  setFAQs={setLandingFAQs}
                  texts={landingTexts}
                  setTexts={setLandingTexts}
                  onLogAudit={handleLogAudit}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* === ADVANCED MULTI-DESIGN ID CARDS STUDIO === */}
              {activeTab === "id-cards" && (
                <IdCardGenerator
                  students={students}
                  teachers={teachers}
                  staff={staff}
                  currentTheme={currentTheme}
                  onLogAudit={handleLogAudit}
                />
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* METICULOUS DEEP FOOTER COLLAR */}
        <footer className="bg-white dark:bg-slate-900 border-t border-[#f1f5f9] dark:border-slate-850 p-4 text-center text-[10px] text-zinc-400 select-none uppercase tracking-widest font-mono">
          EduGlyde School Enterprise Suite • All local states synchronizations confirmed green • V4.10 CJS production
        </footer>
      </main>

      {/* --- CREATE SESSION DIALOG MODAL --- */}
      {showCreateSessionModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-2xl p-6 w-full max-w-sm relative overflow-hidden space-y-4">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />
            <button
              id="close-session-modal-btn"
              onClick={() => setShowCreateSessionModal(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                📅 Create Academic Session
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Setup a new educational academic year to isolate pupil fees and performance brackets.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Session Name / Academic Year
                </label>
                <input
                  id="new-session-name-input"
                  type="text"
                  placeholder="e.g. Session 2027-28"
                  value={newSessionNameInput}
                  onChange={(e) => setNewSessionNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                id="submit-session-btn"
                onClick={() => {
                  const nameTrimmed = newSessionNameInput.trim();
                  if (!nameTrimmed) return;
                  if (academicSessions.includes(nameTrimmed)) {
                    alert("This session already exists!");
                    return;
                  }
                  const updatedList = [...academicSessions, nameTrimmed];
                  setAcademicSessions(updatedList);
                  setActiveAcademicSession(nameTrimmed);
                  localStorage.setItem("edu_active_session", nameTrimmed);
                  setNewSessionNameInput("");
                  setShowCreateSessionModal(false);
                  handleLogAudit(
                    "Create Academic Session",
                    "Session Management",
                    `Provisioned and activated new academic session: ${nameTrimmed}`
                  );
                }}
                disabled={!newSessionNameInput.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800/80 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
              >
                Activate & Start Working
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
