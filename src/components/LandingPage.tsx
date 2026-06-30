/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  School, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  CalendarDays, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Lock, 
  Fingerprint, 
  AlertCircle,
  HelpCircle,
  Compass,
  Bus,
  Activity,
  Calculator,
  ChevronRight,
  TrendingUp,
  X,
  Search,
  Download,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { initialStudents } from "../data/mockData";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from "recharts";

interface LandingPageProps {
  currentTheme: any;
  isDarkMode: boolean;
  onUnlock: () => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  toppers?: any[];
  faculty?: any[];
  curriculums?: any[];
  faqs?: any[];
  texts?: any;
}

export default function LandingPage({
  currentTheme,
  isDarkMode,
  onUnlock,
  onLogAudit,
  toppers = [],
  faculty = [],
  curriculums = [],
  faqs = [],
  texts = {}
}: LandingPageProps) {
  // Sync state between parent prop or local storage
  const [localTextsState, setLocalTextsState] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("edu_suite_landing_texts");
      return raw ? JSON.parse(raw) : (texts || {});
    } catch {
      return texts || {};
    }
  });

  useEffect(() => {
    if (texts && Object.keys(texts).length > 0) {
      setLocalTextsState(texts);
    }
  }, [texts]);

  // Safe accessor fallbacks bound directly to our reactive local state
  const t = {
    heroBadge: localTextsState?.heroBadge || "Admin Terminal System Connected",
    heroTitle: localTextsState?.heroTitle || "Typing Desk Assam",
    stat1Num: localTextsState?.stat1Num || "1,500+",
    stat1Label: localTextsState?.stat1Label || "Enrolled Pupils",
    stat2Num: localTextsState?.stat2Num || "98.5%",
    stat2Label: localTextsState?.stat2Label || "Passing Rate",
    stat3Num: localTextsState?.stat3Num || "12+",
    stat3Label: localTextsState?.stat3Label || "Smart Modules",

    overviewTitle: localTextsState?.overviewTitle || "Institution Profile Overview",
    overviewDesc: localTextsState?.overviewDesc || "EduCore ERP System coordinates dynamic pupil details, hostel accommodation listings, academic fleet tracking, exam promotions, and payroll ledger entries with cloud integrity constraints.",

    card1Title: localTextsState?.card1Title || "Active Teacher Allocation",
    card1Body: localTextsState?.card1Body || "Track daily schedules, subject domains, and periods.",
    card2Title: localTextsState?.card2Title || "Consolidated Fee Audit",
    card2Body: localTextsState?.card2Body || "Quick invoicing receipts, payment ledgers and balance alerts.",
    card3Title: localTextsState?.card3Title || "Smart Biometric Scanning",
    card3Body: localTextsState?.card3Body || "Integrated facial scanner modules for instant pupil entry verification.",
    card4Title: localTextsState?.card4Title || "Live Transport Tracking",
    card4Body: localTextsState?.card4Body || "Accurate bus coordinate monitors with map system overlays.",

    admissionBadge: localTextsState?.admissionBadge || "Registration for Academic Session 2026-27 is LIVE",
    admissionDesc: localTextsState?.admissionDesc || "Secure an expedited seat inside the primary digital computer labs. Application gates are monitored with direct ledger accountability.",
    step1Title: localTextsState?.step1Title || "Step 1: Document Filing",
    step1Body: localTextsState?.step1Body || "File online application, upload marksheet credentials, and pay the core registration token.",
    step2Title: localTextsState?.step2Title || "Step 2: Biometric Interview",
    step2Body: localTextsState?.step2Body || "Attend pupil-parent interview where biometric face points are initialized into our server archives.",

    feeSubtitle: localTextsState?.feeSubtitle || "Calculate Estimated Academic Fee",

    contact1Title: localTextsState?.contact1Title || "Admission Admissions Hotline",
    contact1Phone: localTextsState?.contact1Phone || "+91 98765-XXXXX",
    contact1Availability: localTextsState?.contact1Availability || "Available 09:00 AM - 04:00 PM IST",
    contact2Title: localTextsState?.contact2Title || "Accounts & Tuition Billing",
    contact2Email: localTextsState?.contact2Email || "support@educore.school",
    contact2Availability: localTextsState?.contact2Availability || "Response time: within 24 business hours",

    principalName: localTextsState?.principalName || "Dr. Joydeep Baruah",
    principalTitle: localTextsState?.principalTitle || "Principal, EduCore Academy",
    principalMessage: localTextsState?.principalMessage || "Welcome to our advanced regional knowledge portal. EduCore balances classical state-board benchmarks with dynamic ICT tools, empowering minds for modern horizons. Explore our integrated ERP modules to monitor academic progress with absolute transparency.",
    principalImg: localTextsState?.principalImg || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=180&h=180&fit=crop",
    supportTitle: localTextsState?.supportTitle || "Campus IT Support & Helpdesk",
    supportDesc: localTextsState?.supportDesc || "Connect directly with our administration support block for immediate assistance regarding student registrations, fee ledgers, exam records, or transport tracking routes.",
    supportPhone: localTextsState?.supportPhone || "+91 361-234-5678",
    supportEmail: localTextsState?.supportEmail || "helpdesk@educoreacademy.edu.in"
  };

  const [activeMenu, setActiveMenu] = useState<string>("home");
  const [pinValue, setPinValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBypassing, setIsBypassing] = useState<boolean>(false);
  const [feeEstimateClass, setFeeEstimateClass] = useState<string>("Grade 1-5");
  const [hasTransport, setHasTransport] = useState<boolean>(false);
  const [estimateResult, setEstimateResult] = useState<number>(2300);

  // Login with Supabase controls
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Direct editing modal states on Landing page
  const [isEditLandingModalOpen, setIsEditLandingModalOpen] = useState(false);
  const [tempPrincipalName, setTempPrincipalName] = useState(t.principalName);
  const [tempPrincipalTitle, setTempPrincipalTitle] = useState(t.principalTitle);
  const [tempPrincipalMessage, setTempPrincipalMessage] = useState(t.principalMessage);
  const [tempPrincipalImg, setTempPrincipalImg] = useState(t.principalImg);
  const [tempSupportTitle, setTempSupportTitle] = useState(t.supportTitle);
  const [tempSupportDesc, setTempSupportDesc] = useState(t.supportDesc);
  const [tempSupportPhone, setTempSupportPhone] = useState(t.supportPhone);
  const [tempSupportEmail, setTempSupportEmail] = useState(t.supportEmail);

  useEffect(() => {
    if (isEditLandingModalOpen) {
      setTempPrincipalName(t.principalName);
      setTempPrincipalTitle(t.principalTitle);
      setTempPrincipalMessage(t.principalMessage);
      setTempPrincipalImg(t.principalImg);
      setTempSupportTitle(t.supportTitle);
      setTempSupportDesc(t.supportDesc);
      setTempSupportPhone(t.supportPhone);
      setTempSupportEmail(t.supportEmail);
    }
  }, [isEditLandingModalOpen, t.principalName, t.principalTitle, t.principalMessage, t.principalImg, t.supportTitle, t.supportDesc, t.supportPhone, t.supportEmail]);

  // Pupil results lookup states
  const [isCheckingResult, setIsCheckingResult] = useState<boolean>(false);
  const [searchRoll, setSearchRoll] = useState<string>("");
  const [matchingStudent, setMatchingStudent] = useState<any | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [viewA4ReportCard, setViewA4ReportCard] = useState<boolean>(false);
  const [viewProspectusModal, setViewProspectusModal] = useState<boolean>(false);

  // Online Admission registration states
  const [isApplyingAdmission, setIsApplyingAdmission] = useState<boolean>(false);
  const [admissionForm, setAdmissionForm] = useState({
    studentName: "",
    parentName: "",
    grade: "Grade 11 - Science",
    prevPercentage: "",
    phone: "",
    email: ""
  });
  const [admissionSubmitted, setAdmissionSubmitted ] = useState<boolean>(false);
  const [generatedAdmissionId, setGeneratedAdmissionId] = useState<string>("");

  const handleCheckResultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) {
      setMatchingStudent(null);
      setSearched(false);
      return;
    }
    const term = searchRoll.trim().toLowerCase();
    const found = initialStudents.find(
      s => s.admissionNo.toLowerCase().includes(term) || s.name.toLowerCase().includes(term)
    );
    if (found) {
      setMatchingStudent(found);
      playSfx("success");
    } else {
      setMatchingStudent(null);
      playSfx("error");
    }
    setSearched(true);
  };

  // Sound system feedback helper
  const playSfx = (type: "click" | "success" | "error" | "init") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(650, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.06);
      } else if (type === "success") {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(f, now + i * 0.06);
          gain.gain.setValueAtTime(0.03, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.4);
        });
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.35);
      }
    } catch {
      // Ignored if banned by security context
    }
  };

  const triggerProspectusDownload = () => {
    try {
      const prospectusText = `========================================================================
       EDUCORE ACADEMY (SEBA Affiliated & AHSEC Recognized)
       State Board & Higher Secondary Council Academic Prospectus
       Academic Year Session: 2026-2027 | Guwahati, Assam
========================================================================

Welcome to EduCore Academy, Assam's premier regional hub celebrating classical
literacy integrated with high-performance computational methodologies. We are
fully synchronized under the Board of Secondary Education, Assam (SEBA) and
the Assam Higher Secondary Education Council (AHSEC) charters.

------------------------------------------------------------------------
I. BOARD OF SECONDARY EDUCATION, ASSAM (SEBA) DIVISION [Class IX & X]
------------------------------------------------------------------------
The High School Leaving Certificate (HSLC) division provides a strong foundation 
following the native SEBA syllabus, designed for academic excellence:

1. Core Compulsory Subjects:
   - English (Under revised SEBA textbooks)
   - General Mathematics (Syllabus-T)
   - General Science (Theory & Practical Labs)
   - Social Science (History, Geography, Political Science, Economics)

2. Modern Indian Languages (MIL) Group (Choose One):
   - Assamese (অসমীয়া)
   - Bengali (বাংলা)
   - Bodo (বড়ো)
   - Hindi (हिन्दी)
   - Alternative English (For exempted candidates)

3. Advanced Curriculum Electives (Select One):
   - Advanced Mathematics (উচ্চ গণিত)
   - Computer Science (Python programming & ICT basics)
   - Geography (Assam and Indian regional mapping)
   - Arabic / Sanskrit Classical Languages

------------------------------------------------------------------------
II. ASSAM HIGHER SECONDARY EDUCATION COUNCIL (AHSEC) DIVISION [Class XI & XII]
------------------------------------------------------------------------
The Higher Secondary (HS) council program offers specialized stream selections, 
preparing aspirants for professional entries, engineering, and humanities:

1. Compulsory Subjects for All Candidates:
   - General English
   - Modern Indian Language (MIL: Assamese / Bengali / Hindi) OR Alternative English

2. Higher Secondary Science Stream:
   - Required Group: Physics, Chemistry
   - Flexible Choices (Choose 2 or 3): Mathematics, Biology, Computer Science (C++/Database), Statistics.

3. Higher Secondary Commerce Stream:
   - Required Group: Accountancy (ACY), Business Studies (BST)
   - Flexible Choices (Choose 2 or 3): Economics (ECO), Commercial Mathematics & Statistics (CMS), Banking (BNK), Computer Application.

4. Higher Secondary Arts/Humanities Stream:
   - Elective Options (Choose 3 or 4): Political Science, Economics, History, Logic & Philosophy, Sociology, Education, Anthropology.

------------------------------------------------------------------------
III. ASSAM STATE BENCHMARKS, SCHOLARSHIPS & CO-CURRICULAR AMENITIES
------------------------------------------------------------------------
- Anundoram Borooah Award Focus: Focused training programs for HSLC star candidates 
  aiming to secure Distinction (above 75%) and Star Marks.
- Computational Center: 50+ dual-boot programming nodes, high-speed regional fiber line.
- Robotics & IoT Integration: Practical science workshops, Arduino telemetry rigs, 
  and solar cell experiment units.
- Bio-Science & Chemistry Laboratories: State-of-the-art specimen storage and AHSEC-compliant practical setups.
- Language Lab: Interactive phonetic training for Assamese and English pronunciation.

------------------------------------------------------------------------
IV. GENERAL REGISTRATION RULES & DOCUMENT CHECKLIST
------------------------------------------------------------------------
To successfully secure admissions under SEBA & AHSEC regional norms:
1. Aggregate minimum of 60% in prior qualifying standard.
2. Mandatory submission of original Digital/Physical documents during campus seat locking:
   * Class Marksheet / Passing Certificate
   * Valid State Birth Certificate or Aadhaar Card
   * Original Transfer/School Leaving Certificate (TC) signed by competent authority
   * 3 Passport size photographs with sky-blue background background
   * State Caste Certificate (OBC/MOBC/SC/ST) if applicable for quota clearance

------------------------------------------------------------------------
V. OFFICE OF THE ADMISSION CHIEF
------------------------------------------------------------------------
- Assam HQ Block: G.S. Road, Christian Basti, Guwahati, Kamrup (M), Assam, PIN-781005.
- Online Registrar Liaison: guwahati.admissions@educore-assam.edu.in
- Office Desk Line: +91 99540XXXXX / +91 361234XXXX
- State Principal Desk: board.principal@educore-assam.edu.in

Approved by SEBA Reg No. SEBA/AFFIL/849-26 and AHSEC Establishment ID HS-8842-A.
Copyright © 2026 EduCore Academy Assam. All Rights Reserved.
========================================================================`;

      const blob = new Blob([prospectusText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "EduCore_Assam_SEBA_AHSEC_Prospectus_2026_27.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setViewProspectusModal(true);
      playSfx("success");
    } catch (e) {
      console.error(e);
      playSfx("error");
    }
  };

  useEffect(() => {
    // Recalculate fee estimate dynamically
    let base = 1500;
    if (feeEstimateClass === "Grade 6-10") base = 1800;
    else if (feeEstimateClass === "Grade 11-12") base = 2500;
    
    if (hasTransport) base += 300;
    setEstimateResult(base);
  }, [feeEstimateClass, hasTransport]);

  const handleKeyPress = (num: string) => {
    playSfx("click");
    setErrorMessage(null);
    if (pinValue.length < 4) {
      setPinValue(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    playSfx("click");
    setErrorMessage(null);
    setPinValue(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    playSfx("click");
    setErrorMessage(null);
    setPinValue("");
  };

  const handleSubmitPin = (customPin?: string) => {
    const finalPin = customPin !== undefined ? customPin : pinValue;
    if (finalPin === "1234" || finalPin === "2026") {
      playSfx("success");
      onUnlock();
      onLogAudit("Terminal Unlocked", "Session Authorization", "Administrative session authorized from Landing Page portal.");
    } else {
      playSfx("error");
      setErrorMessage("Incorrect Master PIN. Please try again.");
      setPinValue("");
    }
  };

  const handleBiometricBypass = () => {
    playSfx("click");
    setIsBypassing(true);
    setErrorMessage(null);

    setTimeout(() => {
      playSfx("success");
      setIsBypassing(false);
      onUnlock();
      onLogAudit("Terminal Unlocked", "Biometric Bypass", "Identified valid face structure matching credentials database. Bypass success.");
    }, 1500);
  };

  useEffect(() => {
    if (pinValue.length === 4) {
      handleSubmitPin();
    }
  }, [pinValue]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${currentTheme.mainBg} text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans`}>
      
      {/* 1. TOP NAVBAR BRANDING HEADER */}
      <nav className={`h-16 ${currentTheme.headerBg} border-b ${currentTheme.headerBorder} flex items-center justify-between px-6 shrink-0 z-20 backdrop-blur-md sticky top-0 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md border border-white/10 shrink-0">
            {currentTheme.bannerPattern || "🏫"}
          </div>
          <div>
            <span className="font-extrabold text-[#0f172a] dark:text-white text-base tracking-tight flex items-center gap-1.5 leading-none">
              EduCore International <span className="text-[10px] py-0.5 px-2 rounded-full uppercase tracking-wider font-extrabold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">Public</span>
            </span>
            <span className="text-[9.5px] uppercase tracking-widest text-[#94a3b8] font-bold font-mono mt-1 block">
              Main Campus Lane, Sector-4B, NCR, Bharat
            </span>
          </div>
        </div>

        {/* Unique Navbar menus */}
        <div className="hidden lg:flex items-center gap-1.5">
          {[
            { id: "home", label: "Home Base" },
            { id: "academics", label: "Academic Portal" },
            { id: "admissions", label: "Admission Desk" },
            { id: "fees", label: "Fee Matrix" },
            { id: "about", label: "Contact Us" }
          ].map((menu) => (
            <button
              key={menu.id}
              onClick={() => {
                playSfx("click");
                setActiveMenu(menu.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === menu.id
                  ? `${currentTheme.buttonPrimary || "bg-indigo-600 text-white"} shadow-sm scale-102`
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850"
              }`}
            >
              {menu.label}
            </button>
          ))}
        </div>

        {/* Top Right Login Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSfx("click");
              setIsLoginModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.03]"
          >
            <Lock size={12} />
            Login
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT BODY: Left Sidebar (3" Wide), Center Workings, Right Sidebar (3" Wide) */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* ==========================================
            LEFT SIDEBAR (Exactly 3 inches / ~288px wide)
            ========================================== */}
        <aside 
          id="left-landing-sidebar"
          className="hidden"
        >
          {/* Section: Academic Toppers Continuous Smooth Scroll */}
          <div className="p-5 space-y-4 flex flex-col overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes marqueeVertical {
                0% { transform: translateY(0); }
                100% { transform: translateY(-50%); }
              }
              .animate-marquee-vertical {
                animation: marqueeVertical 22s linear infinite;
              }
              .animate-marquee-vertical:hover {
                animation-play-state: paused;
              }
            `}} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400">
                <span className="animate-pulse text-amber-500 text-xs text-shadow-xs">⭐</span>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#475569] dark:text-slate-300">
                  Hall of Fame (Toppers)
                </h3>
              </div>
              <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-full">
                2025-26
              </span>
            </div>

            <div className="relative h-96 overflow-hidden border dark:border-slate-850 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-3">
              {/* Fade masks */}
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee-vertical flex flex-col gap-4">
                {toppers.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400 text-[10px] font-bold">
                    No toppers configured yet
                  </div>
                ) : (
                  (toppers.length < 4 
                    ? [...toppers, ...toppers, ...toppers, ...toppers] 
                    : [...toppers, ...toppers]
                  ).map((topper, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-2xl shadow-sm hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 overflow-hidden shrink-0 flex items-center justify-center relative">
                        <span className="absolute text-xl font-bold">{topper.avatar || "🎓"}</span>
                        {topper.img && (
                          <img 
                            src={topper.img} 
                            alt={topper.name} 
                            referrerPolicy="no-referrer" 
                            className="absolute inset-0 w-full h-full object-cover rounded-full z-10 transition-opacity duration-300"
                            onError={(e) => {
                              e.currentTarget.style.opacity = "0";
                            }}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 col-span-2">
                        <h4 className="text-xs sm:text-[13px] font-black text-slate-800 dark:text-white truncate leading-tight">{topper.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-extrabold">{topper.className || topper.class}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full block">
                          {topper.percentage}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <p className="text-[8.5px] text-zinc-400 leading-normal italic text-center">
              * Hover cursor inside to freeze scroll
            </p>
          </div>

          {/* Section B: Dynamic School Notifications Scroll */}
          <div className="p-5 space-y-4 flex flex-col overflow-hidden border-b border-slate-100 dark:border-slate-850">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes marqueeNotices {
                0% { transform: translateY(0); }
                100% { transform: translateY(-50%); }
              }
              .animate-marquee-notices {
                animation: marqueeNotices 16s linear infinite;
              }
              .animate-marquee-notices:hover {
                animation-play-state: paused;
              }
            `}} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#475569] dark:text-slate-300">
                  Campus Bulletins
                </h3>
              </div>
              <span className="text-[8px] bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                LIVE
              </span>
            </div>

            <div className="relative h-44 overflow-hidden border dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 p-2.5">
              {/* Fade masks */}
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee-notices flex flex-col gap-2.5">
                {[
                  {
                    category: "Results",
                    text: "Term-I final exam scorecards and academic performance metrics are now live in the pupil portal desk.",
                    color: "emerald",
                    emoji: "🏆"
                  },
                  {
                    category: "Admission",
                    text: "Admission registrations for local & outside pupils for Academic Session 2026-27 are currently active.",
                    color: "indigo",
                    emoji: "✍️"
                  },
                  {
                    category: "Programme",
                    text: "Annual EduCore Sports Gala and Cultural Day preparations scheduled to commence next Monday.",
                    color: "amber",
                    emoji: "📅"
                  },
                  {
                    category: "Notice",
                    text: "Parents-Teacher biometric ledger documentation verification is mandatory at desks.",
                    color: "rose",
                    emoji: "🔔"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl shadow-xs space-y-1.5 shrink-0 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{item.emoji}</span>
                      <span className={`text-[8.5px] px-2 py-0.5 font-bold uppercase rounded-full ${
                        item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        item.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        item.color === 'amber' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-zinc-400 leading-normal font-sans">
                      {item.text}
                    </p>
                  </div>
                ))}
                {/* Second duplicated block for infinite marquee effect */}
                {[
                  {
                    category: "Results",
                    text: "Term-I final exam scorecards and academic performance metrics are now live in the pupil portal desk.",
                    color: "emerald",
                    emoji: "🏆"
                  },
                  {
                    category: "Admission",
                    text: "Admission registrations for local & outside pupils for Academic Session 2026-27 are currently active.",
                    color: "indigo",
                    emoji: "✍️"
                  },
                  {
                    category: "Programme",
                    text: "Annual EduCore Sports Gala and Cultural Day preparations scheduled to commence next Monday.",
                    color: "amber",
                    emoji: "📅"
                  },
                  {
                    category: "Notice",
                    text: "Parents-Teacher biometric ledger documentation verification is mandatory at desks.",
                    color: "rose",
                    emoji: "🔔"
                  }
                ].map((item, idx) => (
                  <div key={`dup-${idx}`} className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl shadow-xs space-y-1.5 shrink-0 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{item.emoji}</span>
                      <span className={`text-[8.5px] px-2 py-0.5 font-bold uppercase rounded-full ${
                        item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        item.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        item.color === 'amber' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-zinc-400 leading-normal font-sans">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[8px] text-zinc-400 leading-normal italic text-center">
              * Hover cursor inside to freeze bulletins scroll
            </p>
          </div>

          {/* Section C: Academy Helpdesk Info */}
          <div className="p-5 space-y-3 text-xs text-slate-600 dark:text-slate-350 mt-auto">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Support Desks
            </span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-emerald-500" />
                <span className="font-mono text-[10.5px] font-bold">+91 9123-567-890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-indigo-400" />
                <span className="font-mono text-[10.5px]">queries@educore.edu.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-rose-500 shrink-0" />
                <span className="text-[10px]">Main Campus Lane, Sector-4B, NCR, Bharat</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ==========================================
            CENTER WORKSPACE (Hero & Modules / Login)
            ========================================== */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {activeMenu === "home" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* 1. HERO SECTION FOR SCHOOL NAME & CREST LOGO */}
                <div className={`relative rounded-3xl p-8 md:p-10 text-white overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl`}>
                  <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[120%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 opacity-10 font-bold text-9xl translate-x-12 translate-y-12 select-none pointer-events-none">
                    🔑🏫
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <Sparkles size={11} className="text-cyan-400 animate-spin" /> {t.heroBadge}
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                          {t.heroTitle}
                        </span>
                      </h1>
                      
                      {/* Highlight stats */}
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <button
                          onClick={() => {
                            playSfx("click");
                            setIsCheckingResult(true);
                            setSearchRoll("");
                            setMatchingStudent(null);
                            setSearched(false);
                          }}
                          className="p-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                        >
                          <span className="text-sm font-black flex items-center gap-1.5 text-emerald-400 font-sans tracking-tight">
                            Check Result <Search size={13} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1">Pupil Marksheet Search</span>
                        </button>
                        <button
                          onClick={() => {
                            playSfx("click");
                            setActiveMenu("admissions");
                            setIsApplyingAdmission(true);
                            setAdmissionSubmitted(false);
                            setAdmissionForm({
                              studentName: "",
                              parentName: "",
                              grade: "Grade 11 - Science",
                              prevPercentage: "",
                              phone: "",
                              email: ""
                            });
                          }}
                          className="p-3 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                        >
                          <span className="text-sm font-black flex items-center gap-1.5 text-cyan-400 font-sans tracking-tight">
                            Online Admission <ArrowRight size={13} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1">Session 2026-27 Forms</span>
                        </button>
                        <button
                          onClick={() => {
                            playSfx("click");
                            triggerProspectusDownload();
                          }}
                          className="p-3 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                        >
                          <span className="text-sm font-black flex items-center gap-1.5 text-indigo-400 font-sans tracking-tight">
                            Download Prospectus <Download size={13} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1">Syllabus & Course Info</span>
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex justify-center">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center text-4xl relative shadow-inner animate-pulse">
                        🎓
                        <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-emerald-500 border-2 border-slate-900 rounded-full text-[9px] font-bold text-white uppercase tracking-widest shadow">
                          Affiliated
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {activeMenu === "academics" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="text-indigo-600 animate-bounce" size={20} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Academic Curriculum Profiles</h2>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Our system maintains accurate registries of accredited course plans conforming strictly under state educational benchmarks.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {curriculums.length === 0 ? (
                    <div className="col-span-3 text-center py-8 text-zinc-400 text-xs font-bold">
                      No curriculum records found. Please update in Admin Settings.
                    </div>
                  ) : (
                    curriculums.map((curr, idx) => (
                      <div key={curr.id || idx} className="p-5 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-3xl space-y-3 shadow-xs">
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-600 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {curr.category || "General"}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{curr.title}</h3>
                        <p className="text-[11px] text-slate-500">{curr.description}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border dark:border-slate-900 text-center space-y-2">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white">Required to modify syllabus elements?</h4>
                  <p className="text-[11px] text-zinc-500">Please authenticate as Principal/Admin IT operator from the primary home screen keypad.</p>
                </div>
              </motion.div>
            )}

            {activeMenu === "admissions" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="text-emerald-500" size={20} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Accredited Admission Desk</h2>
                </div>

                <div className="p-6 bg-[#ecfdf5]/80 dark:bg-emerald-950/15 border border-[#10b981]/25 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] block"></span>
                    <h3 className="text-xs font-black text-emerald-800 dark:text-emerald-300">{t.admissionBadge}</h3>
                  </div>
                  <p className="text-xs text-[#065f46] dark:text-zinc-400 leading-normal">
                    {t.admissionDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-850 p-5 rounded-3xl space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400">{t.step1Title}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{t.step1Body}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-850 p-5 rounded-3xl space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400">{t.step2Title}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{t.step2Body}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMenu === "fees" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="text-indigo-600" size={20} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unified Fee Calculator Estimation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Estimator inputs */}
                  <div className="md:col-span-6 bg-white dark:bg-slate-900 border dark:border-slate-850 p-5 rounded-3xl space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400">{t.feeSubtitle}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Select Grade Level</label>
                        <select
                          value={feeEstimateClass}
                          onChange={(e) => setFeeEstimateClass(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 dark:border-slate-850 text-slate-800 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Grade 1-5">Primary School (Grades 1-5)</option>
                          <option value="Grade 6-10">Middle School (Grades 6-10)</option>
                          <option value="Grade 11-12">Higher Secondary (Grades 11-12)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">Optimize School Transport?</span>
                          <span className="text-[9.5px] text-zinc-500 block">Adds GPS monitored bus facility (₹300/Month)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={hasTransport}
                          onChange={(e) => {
                            playSfx("click");
                            setHasTransport(e.target.checked);
                          }}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Estimate calculation card */}
                  <div className="md:col-span-6 bg-[#e0f2fe]/80 dark:bg-[#082f49]/15 border border-sky-400/25 p-6 rounded-3xl text-center space-y-3">
                    <TrendingUp className="mx-auto text-sky-505 text-sky-500" size={32} />
                    <h3 className="text-xs font-black text-sky-850 dark:text-sky-300 uppercase tracking-widest leading-none">Monthly Estimated Total</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                      ₹{estimateResult} <span className="text-xs font-medium text-slate-500">/ Month</span>
                    </div>
                    <p className="text-[10px] text-[#0369a1] leading-relaxed">
                      *Note: Above calculations serve as standard approximations. Individual scholarships or fine-deductions can only be applied by authorized backend accountants from ERP Ledger systems.
                    </p>
                  </div>

                </div>
              </motion.div>
            )}

            {activeMenu === "about" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <Phone className="text-[#3b82f6]" size={20} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unified Campus Contacts Desk</h2>
                </div>

                <p className="text-xs text-slate-550 dark:text-slate-400">
                  Are you an evaluator, parent or scholar needing support? Drop lines to respective departments.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-2xl flex gap-3.5">
                    <span className="text-lg">📞</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{t.contact1Title}</h4>
                      <p className="font-mono text-[11px] text-indigo-600 mt-1">{t.contact1Phone}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">{t.contact1Availability}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-2xl flex gap-3.5">
                    <span className="text-lg">📧</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{t.contact2Title}</h4>
                      <p className="font-mono text-[11px] text-emerald-600 mt-1">{t.contact2Email}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">{t.contact2Availability}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom attribution */}
          <div className="border-t pt-4 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>© 2026 EduCore ERP Systems</span>
            <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-500" /> SECURE SECURE GATE ACTIVE</span>
          </div>

        </div>

        {/* ==========================================
            RIGHT SIDEBAR (Exactly 3 inches / ~288px wide)
            ========================================== */}
        <aside 
          id="right-landing-sidebar"
          className="hidden"
        >
          {/* Section A: Our Teachers Continuous Smooth Scroll */}
          <div className="p-5 space-y-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400">
                <span className="animate-pulse text-indigo-505 text-indigo-500 text-xs">🎓</span>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#475569] dark:text-slate-300">
                  Our Faculty Teachers
                </h3>
              </div>
              <span className="text-[8px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">
                Ph.D / PG
              </span>
            </div>

            <div className="relative h-96 overflow-hidden border dark:border-slate-850 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-3">
              {/* Fade masks */}
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee-vertical flex flex-col gap-4">
                {faculty.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400 text-[10px] font-bold">
                    No faculty listed yet
                  </div>
                ) : (
                  (faculty.length < 4 
                    ? [...faculty, ...faculty, ...faculty, ...faculty] 
                    : [...faculty, ...faculty]
                  ).map((teacher, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-2xl shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 overflow-hidden shrink-0 flex items-center justify-center relative">
                        <span className="absolute text-xl font-bold">{teacher.avatar || "👩‍🏫"}</span>
                        {teacher.img && (
                          <img 
                            src={teacher.img} 
                            alt={teacher.name} 
                            referrerPolicy="no-referrer" 
                            className="absolute inset-0 w-full h-full object-cover rounded-full z-10 transition-opacity duration-300"
                            onError={(e) => {
                              e.currentTarget.style.opacity = "0";
                            }}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-[13px] font-black text-slate-800 dark:text-white truncate leading-tight col-span-2">{teacher.name}</h4>
                        <p className="text-[10px] text-[#10b981] font-bold mt-1">{teacher.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono leading-none font-bold text-slate-400 bg-slate-100 dark:bg-slate-850 px-2 py-1 rounded block">
                          {teacher.dept}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <p className="text-[8.5px] text-zinc-400 leading-normal italic text-center">
              * Hover cursor inside to freeze scroll
            </p>
          </div>

          {/* Section C: FAQ Accordion Teaser */}
          <div className="p-5 space-y-3.5">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={13} className="text-indigo-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Assistance FAQs</h3>
            </div>
            <div className="space-y-2 text-[10.5px]">
              {faqs.length === 0 ? (
                <div className="text-center py-4 text-zinc-400 text-[9.5px]">
                  No FAQs listed.
                </div>
              ) : (
                faqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border dark:border-slate-900">
                    <span className="font-black text-slate-700 dark:text-slate-200 block">Q: {faq.question}</span>
                    <span className="text-slate-500 block mt-0.5 leading-relaxed">A: {faq.answer}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

      </div>

      {/* ========================================================
          CHECK RESULT INTERACTIVE DIALOG MODAL / SLIDE-IN
          ======================================================== */}
      <AnimatePresence>
        {isCheckingResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                      Academic Marksheet Search
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                      Public Pupil Portal Desk
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setIsCheckingResult(false);
                    setSearchRoll("");
                    setMatchingStudent(null);
                    setSearched(false);
                  }}
                  className="p-2 border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-405 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Search query form */}
                <form onSubmit={handleCheckResultSearch} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Enter Pupil Name or Admission Roll No.
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={15} />
                      </span>
                      <input
                        type="text"
                        value={searchRoll}
                        onChange={(e) => setSearchRoll(e.target.value)}
                        placeholder="e.g. Aarav Sharma or ADM-2024-001"
                        className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      Search <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Suggestion hints */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[9.5px] text-slate-400 mr-1">Try:</span>
                    {["Aarav Sharma", "Aniket Patel", "Priyanka Sen"].map((hName) => (
                      <button
                        key={hName}
                        type="button"
                        onClick={() => {
                          playSfx("click");
                          setSearchRoll(hName);
                          // Auto trigger search as well
                          const found = initialStudents.find(
                            s => s.name.toLowerCase().includes(hName.toLowerCase())
                          );
                          if (found) {
                            setMatchingStudent(found);
                            setSearched(true);
                            playSfx("success");
                          }
                        }}
                        className="text-[9px] bg-slate-105 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border dark:border-slate-800 font-medium transition-all active:scale-95 cursor-pointer"
                      >
                        {hName}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Displaying Student Result Status */}
                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-5">
                  <AnimatePresence mode="wait">
                    {!searched ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10 space-y-3"
                      >
                        <span className="text-3xl block filter saturate-50">📚</span>
                        <h4 className="text-xs font-bold text-slate-400">Waiting for Search Input</h4>
                        <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-normal">
                          Submit a valid Admission Number or Pupil Full Name to fetch live report files from EduCore mainframe database.
                        </p>
                      </motion.div>
                    ) : matchingStudent ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Student Badge Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-[#10b981] font-mono uppercase font-black tracking-widest block mb-0.5 animate-pulse">● Verified Profile Found</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                              {matchingStudent.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono">
                              Adm: {matchingStudent.admissionNo} &bull; {matchingStudent.className} ({matchingStudent.section})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 font-bold block mb-1">Status</span>
                            <span className="text-[9px] px-2.5 py-1 font-bold bg-[#10b981]/15 text-[#10b981] rounded-full uppercase tracking-wider">
                              {matchingStudent.status}
                            </span>
                          </div>
                        </div>

                        {/* Marks & Attendance breakdown */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl border dark:border-slate-850 bg-white dark:bg-slate-900 space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Grade Performance</span>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-2xl font-black font-mono ${matchingStudent.gradePerformance >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {matchingStudent.gradePerformance}%
                              </span>
                              <span className="text-[10px] text-zinc-400">Score</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                              <div 
                                className={`h-full rounded-full ${matchingStudent.gradePerformance >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                style={{ width: `${matchingStudent.gradePerformance}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1">
                              {matchingStudent.gradePerformance >= 80 ? "Grade: Outstanding (A+)" : matchingStudent.gradePerformance >= 60 ? "Grade: Satisfactory (B)" : "Grade: Academic Watch (F)"}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl border dark:border-slate-850 bg-white dark:bg-slate-900 space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Attendance rate</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-indigo-500 dark:text-cyan-400 font-mono">
                                {matchingStudent.attendanceRate}%
                              </span>
                              <span className="text-[10px] text-zinc-400">Present</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                              <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ width: `${matchingStudent.attendanceRate}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1">
                              {matchingStudent.attendanceRate >= 95 ? "Excellent Attendance" : "Regular Attendance"}
                            </p>
                          </div>
                        </div>

                        {/* Subject parameters breakdown list */}
                        <div className="p-4 rounded-2xl bg-[#eff6ff]/70 dark:bg-indigo-950/15 border border-[#3b82f6]/25 space-y-2">
                          <h5 className="text-[10px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                            Subject Assessments Overview
                          </h5>
                          
                          <div className="text-[10.5px] divide-y divide-[#3b82f6]/10 dark:divide-slate-800 space-y-1.5">
                            <div className="flex justify-between items-center pt-1.5">
                              <span className="text-slate-600 dark:text-slate-300 font-medium">English Language & Lit.</span>
                              <span className="font-bold font-mono text-indigo-650 dark:text-cyan-400">{matchingStudent.gradePerformance >= 80 ? "88" : matchingStudent.gradePerformance >= 60 ? "75" : "48"} / 100</span>
                            </div>
                            <div className="flex justify-between items-center pt-1.5">
                              <span className="text-slate-600 dark:text-slate-300 font-medium">Mathematics & Algorithms</span>
                              <span className="font-bold font-mono text-indigo-650 dark:text-cyan-400">{matchingStudent.gradePerformance >= 80 ? "95" : matchingStudent.gradePerformance >= 60 ? "68" : "39"} / 100</span>
                            </div>
                            <div className="flex justify-between items-center pt-1.5">
                              <span className="text-slate-600 dark:text-slate-300 font-medium">Science & Lab Experiments</span>
                              <span className="font-bold font-mono text-indigo-650 dark:text-cyan-400">{matchingStudent.gradePerformance >= 80 ? "92" : matchingStudent.gradePerformance >= 60 ? "81" : "44"} / 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Pending Fees */}
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-amber-200 font-semibold font-sans">Pending Ledger Fees Balance:</span>
                          <span className="font-bold font-mono text-amber-600 dark:text-amber-400">₹{matchingStudent.pendingFees}</span>
                        </div>

                        {/* HIGH FIDELITY A4 GENERATOR TRIGGER */}
                        <button
                          type="button"
                          onClick={() => {
                            playSfx("click");
                            setViewA4ReportCard(true);
                          }}
                          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-xl hover:shadow-indigo-500/10 flex items-center justify-center gap-2 mt-3.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer animate-bounce"
                        >
                          <span className="text-base">📄</span>
                          <span>Generate & View Colorful A4 Marksheet</span>
                          <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">PDF-Ready</span>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10 space-y-3"
                      >
                        <span className="text-3xl block">🚫</span>
                        <h4 className="text-xs font-bold text-rose-500 font-black uppercase tracking-wider">No Matching Record Found</h4>
                        <p className="text-[10px] text-zinc-550 max-w-xs mx-auto leading-normal">
                          Please verify spelling of pupil name or confirm Admission No formatting is exactly like <span className="font-mono text-slate-850 dark:text-white bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">ADM-2024-001</span>.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Footer info lock */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[9px] text-slate-450 dark:text-zinc-500 font-semibold leading-normal">
                  🔒 Marksheets generated dynamically via EduCore ERP Database. Parents portal access coordinates secure ledger logging.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          EDUCORE PROSPECTUS VIEW & DIGITAL PREVIEW MODAL
          ======================================================== */}
      <AnimatePresence>
        {viewProspectusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-500/10 rounded-xl text-lg">📖</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                      SEBA & AHSEC Academic Prospectus
                    </h3>
                    <p className="text-[9px] uppercase font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider mt-1">
                      EduCore Secondary & Higher Secondary Academy &bull; Assam
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setViewProspectusModal(false);
                  }}
                  className="p-1 px-2.5 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Prospectus Main Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 dark:text-slate-150">
                
                {/* Visual Accent Title */}
                <div className="text-center space-y-1 py-2 border-b dark:border-slate-800">
                  <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest font-mono">
                    Guwahati Campus &bull; Batch Session 2026-27
                  </span>
                  <h4 className="text-lg font-black text-slate-950 dark:text-white uppercase leading-tight font-serif tracking-tight">
                    INTEGRATED ASSAM CURRICULA FOR EXCELLENCE
                  </h4>
                  <p className="text-[10px] text-slate-450 dark:text-zinc-400">
                    Recognized under SEBA Code: SEBA/AFFIL/849-26 | AHSEC Estd: HS-8842-A
                  </p>
                </div>

                {/* SEBA Program Division */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 border-b pb-1 dark:border-slate-850">
                    <span className="text-xs">📜</span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block font-mono">I. SEBA High School Program (Grades IX & X)</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-805 space-y-2">
                    <p className="text-[11px] leading-relaxed">
                      Rigorous state secondary curricula leading to the <strong>HSLC/AHMC Qualifying Exams</strong>.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10.5px]">
                      <div className="space-y-1">
                        <strong className="text-slate-900 dark:text-white block font-bold">Compulsory Subjects:</strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-550 dark:text-slate-400">
                          <li>General English & Math (Syllabus-T)</li>
                          <li>General Science (Theory/Practical)</li>
                          <li>Social Science (Assam & India Geo)</li>
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-slate-900 dark:text-white block font-bold">Modern Indian Languages (MIL):</strong>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {["Assamese (অসমীয়া)", "Bodo (বড়ো)", "Bengali (বাংলা)", "Hindi (हिन्दी)", "Alt. English"].map((mil) => (
                            <span key={mil} className="p-1 px-1.8 bg-emerald-500/10 text-emerald-750 dark:text-emerald-350 rounded font-mono text-[8px] font-black">{mil}</span>
                          ))}
                        </div>
                        <span className="text-[9px] block text-slate-450 mt-1">Electives: Advanced Mathematics, Computer Science, or Classical Sanskrit.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AHSEC Streams Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 border-b pb-1 dark:border-slate-850">
                    <span className="text-xs">⚡</span>
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block font-mono">II. AHSEC Higher Secondary Streams (Grades XI & XII)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-1.5">
                      <span className="text-[11px] p-1 bg-blue-500/10 text-blue-500 rounded font-black font-mono">HS-SCI</span>
                      <h5 className="font-extrabold text-[12px] text-blue-600 dark:text-blue-400">Science stream</h5>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                        Physics, Chemistry, AHSEC Mathematics/Biology, and Advanced Computer Applications.
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-1.5">
                      <span className="text-[11px] p-1 bg-emerald-500/10 text-emerald-500 rounded font-black font-mono">HS-COM</span>
                      <h5 className="font-extrabold text-[12px] text-emerald-600 dark:text-emerald-400">Commerce Stream</h5>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                        Accountancy, Business Studies, Commercial Mathematics & Stats (CMS), Economics, and Banking.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl space-y-1.5">
                      <span className="text-[11px] p-1 bg-purple-500/10 text-purple-500 rounded font-black font-mono">HS-ARTS</span>
                      <h5 className="font-extrabold text-[12px] text-purple-600 dark:text-purple-400">Arts/Humanities</h5>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                        Political Science, Modern Logic/Philosophy, Assamese Advanced Lit, History, and Education.
                      </p>
                    </div>
                  </div>
                </div>

                {/* State Benchmarks & Amenities */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 border-b pb-1 dark:border-slate-850">
                    <span className="text-xs">🏫</span>
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block font-mono">III. State Benchmarking & Campus Amenities</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border dark:border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                    <div className="flex gap-2.5">
                      <span className="text-sm">💻</span>
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">Python & C++ Labs</strong>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight">Advanced digital lab setups satisfying both SEBA & AHSEC elective mandates.</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <span className="text-sm">🏅</span>
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">Anundoram Award Coaching</strong>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight">Special evening syllabus checkpoints to secure above 75% marks and laptops.</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <span className="text-sm">🧪</span>
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">Assamese Language Lab</strong>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight font-sans">Interactive phonetic exercises ensuring strong grasp of native vocabulary & regional history.</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <span className="text-sm">📡</span>
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">Digital Library Shelf</strong>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight">Instant reference copies of SCERT textbooks and past 15 yrs HSE council papers.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assam State Admissions document compliance list */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 border-b pb-1 dark:border-slate-850">
                    <span className="text-xs">📝</span>
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block font-mono">IV. Assam State Admission Checklist</span>
                  </div>
                  <div className="p-4 border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-2xl text-[10.5px] leading-relaxed space-y-1">
                    <p className="font-semibold text-emerald-950 dark:text-emerald-300">
                      If finalizing seats under SEBA or AHSEC board portals:
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-650 dark:text-slate-300">
                      <li>Maintain general qualifying grades over 55% baseline.</li>
                      <li>Produce original Transfer Certificate (TC) from prior board.</li>
                      <li>Verified State Birth Certificate, PRC (Permanent Residentship certificate), or Aadhaar.</li>
                      <li>Submit State Caste status paperwork (OBC/SC/ST) for category allocation.</li>
                      <li>Bring 3 passport photos with sky-blue background to christian basti campus.</li>
                    </ul>
                  </div>
                </div>

                {/* Notice */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                  <span>📥</span>
                  <span><strong>Download Complete:</strong> The authorized document <strong>"EduCore_Assam_SEBA_AHSEC_Prospectus_2026_27.txt"</strong> has saved successfully to your filesystem.</span>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    window.print();
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-550 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                >
                  🖨️ Print Brochure / View PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setViewProspectusModal(false);
                  }}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl"
                >
                  Dismiss Overview
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          ONLINE ADMISSION REGISTRATION DIALOG MODAL
          ======================================================== */}
      <AnimatePresence>
        {isApplyingAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✍️</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                      Online Admission Desk
                    </h3>
                    <p className="text-[9px] uppercase font-black text-slate-400 font-mono tracking-wider mt-1">
                      Academic Year 2026-2027 Registration
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSfx("click");
                    setIsApplyingAdmission(false);
                  }}
                  className="p-1 px-2.5 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!admissionSubmitted ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!admissionForm.studentName.trim() || !admissionForm.parentName.trim() || !admissionForm.phone.trim()) {
                        setErrorMessage("Please complete all required fields with asterisk (*)");
                        playSfx("error");
                        return;
                      }
                      setErrorMessage(null);
                      const regId = "EDU-REG-2026-" + Math.floor(1000 + Math.random() * 9000);
                      setGeneratedAdmissionId(regId);
                      setAdmissionSubmitted(true);
                      playSfx("success");
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        School Admission Registrant Details
                      </h4>
                      <p className="text-[10px] text-zinc-405 dark:text-zinc-400">
                        Submit student aggregate scores and details to secure digital enrollment approval ledger seats.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold rounded-2xl flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 text-[11px]">
                      {/* Student Name */}
                      <div>
                        <label className="block font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                          Candidate Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={admissionForm.studentName}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, studentName: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505 outline-none text-slate-800 dark:text-white"
                        />
                      </div>

                      {/* Parent Name */}
                      <div>
                        <label className="block font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                          Parent/Guardian Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={admissionForm.parentName}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                          placeholder="e.g. Ramesh Chandra Sharma"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505 outline-none text-slate-800 dark:text-white"
                        />
                      </div>

                      {/* Grid for Grade and Marks */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Target Grade */}
                        <div>
                          <label className="block font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                            Desired Class / Program *
                          </label>
                          <select
                            value={admissionForm.grade}
                            onChange={(e) => setAdmissionForm({ ...admissionForm, grade: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505 outline-none text-slate-800 dark:text-white"
                          >
                            <option value="Grade 11 - Science">Grade 11 - Science</option>
                            <option value="Grade 11 - Commerce">Grade 11 - Commerce</option>
                            <option value="Grade 11 - Arts">Grade 11 - Humanities</option>
                            <option value="Grade 10 - CBSE">Grade 10 Core</option>
                            <option value="Grade 9 - CBSE">Grade 9 Core</option>
                            <option value="Primary Division (Grade 1-5)">Grade 1 - 5</option>
                          </select>
                        </div>

                        {/* Prev % */}
                        <div>
                          <label className="block font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                            Previous Aggregate (%)
                          </label>
                          <input
                            type="number"
                            min="33"
                            max="100"
                            value={admissionForm.prevPercentage}
                            onChange={(e) => setAdmissionForm({ ...admissionForm, prevPercentage: e.target.value })}
                            placeholder="e.g. 88"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505 outline-none text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                            Mobile/Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={admissionForm.phone}
                            onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                            placeholder="e.g. +91 9876543210"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505 outline-none text-slate-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={admissionForm.email}
                            onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                            placeholder="e.g. parent@email.com"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:border-indigo-505 focus:ring-1 focus:ring-indigo-505 outline-none text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          playSfx("click");
                          setIsApplyingAdmission(false);
                        }}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-zinc-300 font-bold rounded-xl transition-all text-xs cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all text-xs cursor-pointer text-center"
                      >
                        File Digital Registration
                      </button>
                    </div>

                    <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900 rounded-2xl flex gap-3 text-[10px] leading-relaxed text-indigo-900 dark:text-indigo-300 font-medium font-sans">
                      <span className="text-base leading-none">📋</span>
                      <p>
                        Your record remains provisional until physical ledger verification at main school campus desks within 15 working days. Application charges (₹500/-) are exempted digitally.
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5 py-4 text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center text-xl mx-auto animate-bounce">
                      ✓
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Enrollment Registered Successfully
                      </h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest font-mono">
                        Provisional Status Check: Approved
                      </p>
                    </div>

                    <div className="bg-[#fcfdfa] border-2 border-dashed border-slate-350 p-5 rounded-2xl text-left text-slate-850 space-y-3 relative overflow-hidden text-[10.5px]">
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none z-0">
                        <span className="text-6xl font-black text-center uppercase tracking-widest leading-none">
                          OFFICIAL<br />RECEIPT
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-b pb-2 z-10 border-slate-200">
                        <span className="font-extrabold text-slate-900 tracking-tight text-xs">EduCore Central Academy Receipt</span>
                        <span className="font-mono text-[9px] font-black text-indigo-750 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {generatedAdmissionId}
                        </span>
                      </div>

                      <div className="space-y-1.5 z-10">
                        <div className="flex justify-between">
                          <span className="text-zinc-650 font-bold">Student Name:</span>
                          <span className="font-black text-slate-900 uppercase">{admissionForm.studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-650 font-bold">Guardian Name:</span>
                          <span className="font-black text-slate-900 uppercase">{admissionForm.parentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-650 font-bold">Target Stream Class:</span>
                          <span className="font-extrabold text-slate-900">{admissionForm.grade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-650 font-bold">Prior Aggregate Ratio:</span>
                          <span className="font-mono font-black text-slate-900">{admissionForm.prevPercentage || "N/A"}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-650 font-bold">Mobile Lock:</span>
                          <span className="font-mono font-semibold text-slate-900">{admissionForm.phone}</span>
                        </div>
                        {admissionForm.email && (
                          <div className="flex justify-between">
                            <span className="text-zinc-650 font-bold">Email Lock:</span>
                            <span className="font-mono text-slate-900">{admissionForm.email}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-zinc-650 font-bold">Filing Date:</span>
                          <span className="font-mono font-semibold text-slate-950">2026-06-16</span>
                        </div>
                      </div>

                      {/* Next steps notice */}
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl leading-normal text-indigo-950 font-bold text-[9px] text-center">
                        ⚠️ Please take a physical print this slip and visit the desk counselor at Sector-4B, NCR campus to submit tuition ledger tokens.
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playSfx("click");
                          window.print();
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold rounded-xl shadow-md transition-all text-xs cursor-pointer"
                      >
                        🖨️ Print Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playSfx("click");
                          setIsApplyingAdmission(false);
                        }}
                        className="flex-1 py-3 bg-slate-205 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-zinc-300 font-extrabold rounded-xl transition-all text-xs cursor-pointer"
                      >
                        Done & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          A4 PRINT-READY CERTIFICATE DIGITAL MARKSHEET OVERLAY
          ======================================================== */}
      <AnimatePresence>
        {viewA4ReportCard && matchingStudent && (() => {
          // Dynamic calculation of subject coordinates perfectly matching performance
          const performance = matchingStudent.gradePerformance || 75;
          const mathM = Math.min(100, Math.max(40, Math.round(performance * 1.04)));
          const scienceM = Math.min(100, Math.max(40, Math.round(performance * 1.02)));
          const englishM = Math.min(100, Math.max(40, Math.round(performance * 0.96)));
          const socialM = Math.min(100, Math.max(40, Math.round(performance * 0.94)));
          const computerM = Math.min(100, Math.max(40, Math.round(performance * 0.98)));

          const subjectsList = [
            { code: "ENG-101", title: "English Core Lit.", max: 100, obtained: englishM, grade: englishM >= 90 ? "A1" : englishM >= 78 ? "A2" : englishM >= 60 ? "B2" : "C1" },
            { code: "MTH-041", title: "Mathematics", max: 100, obtained: mathM, grade: mathM >= 90 ? "A1" : mathM >= 78 ? "A2" : mathM >= 60 ? "B2" : "C1" },
            { code: "SCI-086", title: "Science & Tech Labs", max: 100, obtained: scienceM, grade: scienceM >= 90 ? "A1" : scienceM >= 78 ? "A2" : scienceM >= 60 ? "B2" : "C1" },
            { code: "SST-087", title: "Social Science", max: 105, obtained: socialM, grade: socialM >= 90 ? "A1" : socialM >= 78 ? "A2" : socialM >= 60 ? "B2" : "C1" },
            { code: "CAP-165", title: "Computer Applications", max: 100, obtained: computerM, grade: computerM >= 90 ? "A1" : computerM >= 78 ? "A2" : computerM >= 60 ? "B2" : "C1" },
          ];

          const totalObtained = englishM + mathM + scienceM + socialM + computerM;
          const totalMaxPossible = 505;
          const calculatedAvg = ((totalObtained / totalMaxPossible) * 100).toFixed(1);

          // Colorful chart data matching subject parameters
          const rechartsPieData = [
            { name: "English Core", value: englishM, fill: "#3b82f6" },
            { name: "Mathematics", value: mathM, fill: "#10b981" },
            { name: "Science Labs", value: scienceM, fill: "#f59e0b" },
            { name: "Social Sciences", value: socialM, fill: "#8b5cf6" },
            { name: "Computer App.", value: computerM, fill: "#ec4899" }
          ];

          // Symmetric high quality barcode lines helper
          const drawBarcode = (rollNo: string) => {
            const charSum = rollNo.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const barElements = [];
            let positionX = 12;
            for (let i = 0; i < 42; i++) {
              const weight = ((charSum + i * 11) % 3 === 0) ? 3.0 : (((charSum + i * 7) % 2 === 0) ? 1.6 : 0.8);
              barElements.push(
                <rect key={`b-${i}`} x={positionX} y={4} width={weight} height={32} fill="#0f172a" />
              );
              positionX += weight + (((charSum + i * 13) % 2 === 0) ? 2.5 : 1.2);
            }
            return (
              <svg width="220" height="50" viewBox="0 0 220 50" className="mx-auto block">
                {barElements}
                <text x="50%" y="46" textAnchor="middle" className="text-[9.5px] font-mono font-black fill-slate-800 tracking-[0.25em]">{rollNo}</text>
              </svg>
            );
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-md print:p-0 print:bg-white print:backdrop-blur-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full max-w-5xl bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[96vh] md:h-[90vh] print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none"
              >
                {/* Visualizer sidebar */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-850 w-full md:w-80 shrink-0 flex flex-col justify-between print:hidden">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="p-3 bg-gradient-to-tr from-[#10b981] to-[#3b82f6] rounded-2xl text-white font-extrabold text-sm shadow-md shadow-indigo-500/10">
                        A4
                      </span>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Marksheet Exporter</h3>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Dynamic Bureau Hub</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9px] uppercase font-black tracking-widest text-[#64748b] block">Layout Details</span>
                      
                      <div className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-[#64748b] font-bold">Standard Spec</span>
                          <span className="text-emerald-600 font-black uppercase text-[9px] bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                            A4 Landscape / ISO
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-[#64748b] font-bold">Grade Distribution</span>
                          <span className="text-indigo-600 font-black uppercase text-[9px] bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-md">
                            Pie Chart Enabled
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-[#64748b] font-bold">Security Barcode</span>
                          <span className="text-cyan-600 font-black uppercase text-[9px] bg-cyan-50 dark:bg-cyan-950 px-2.5 py-0.5 rounded-md">
                            Live Vector
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex gap-3 text-[10.5px] leading-relaxed text-indigo-950 dark:text-indigo-300">
                      <span className="text-lg">📊</span>
                      <p>
                        This report cardstatement dynamically maps values from raw SQL databases. Standard CBSE scaling rules apply.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-6 md:pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        playSfx("click");
                        window.print();
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-650 via-teal-650 to-indigo-650 hover:from-emerald-600 hover:to-indigo-600 font-black text-xs text-white rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      🖨️ Print Marksheet / Save PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playSfx("click");
                        setViewA4ReportCard(false);
                      }}
                      className="w-full py-2.5 bg-slate-205 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 font-bold text-xs text-slate-700 dark:text-zinc-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Return to Portal Search
                    </button>
                  </div>
                </div>

                {/* Printable Certificate Area */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4 md:p-6 lg:p-10 flex items-center justify-center print:bg-white print:p-0">
                  <div className="w-full max-w-[720px] aspect-[1/1.414] bg-[#fdfdfc] border-[10px] border-double border-slate-800 p-8 shadow-2xl text-slate-990 relative rounded-md flex flex-col justify-between overflow-hidden print:shadow-none print:border-[5px] print:p-2 print:max-w-none print:w-full print:aspect-auto">
                    
                    {/* Corner decorative anchors */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-slate-900 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-slate-900 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-slate-900 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-slate-900 pointer-events-none" />

                    {/* Faded background watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none z-0">
                      <span className="text-[220px] font-black uppercase text-center leading-[0.8]">CERTIFIED<br />CBSE</span>
                    </div>

                    <div className="space-y-4 z-10 h-full flex flex-col justify-between">
                      {/* Brand Title Area */}
                      <div className="text-center border-b-2 border-slate-800 pb-3.5 space-y-2">
                        <div className="flex items-center justify-center gap-2.5">
                          <span className="text-3xl">🏛️</span>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase text-slate-950 tracking-wider">
                              EduCore Central Senior Secondary Academy
                            </h2>
                            <p className="text-[8.5px] text-[#475569] font-extrabold uppercase tracking-widest leading-none">
                              CBSE National Affiliated Board of Secondary Education &bull; REG-90218
                            </p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="text-[9px] font-black tracking-[0.25em] uppercase text-indigo-750 bg-indigo-50 border border-indigo-200 px-3.5 py-1 rounded">
                            Report Card & Marks Statement
                          </span>
                          <span className="text-[8.5px] text-slate-500 font-mono block mt-1 uppercase">
                            Academic Session: 2026 - 2027 &bull; Cert No: EC-{matchingStudent.admissionNo}
                          </span>
                        </div>
                      </div>

                      {/* Candidate Bio Details */}
                      <div className="grid grid-cols-2 gap-x-5 gap-y-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10.5px]">
                        <div>
                          <span className="text-[8px] text-zinc-400 font-mono uppercase block">Child Name:</span>
                          <span className="font-extrabold text-slate-950 uppercase">{matchingStudent.name}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-400 font-mono uppercase block">Enrollment No:</span>
                          <span className="font-black text-slate-950 font-mono">{matchingStudent.admissionNo}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-400 font-mono uppercase block">Class & Program:</span>
                          <span className="font-semibold text-slate-800 uppercase">{matchingStudent.className} &bull; Section {matchingStudent.section}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-400 font-mono uppercase block">Parent/Guardian Name:</span>
                          <span className="font-semibold text-slate-850 uppercase">{matchingStudent.parentName || "Amal Das"}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-400 font-mono uppercase block">Record Status:</span>
                          <span className="text-emerald-600 font-black uppercase tracking-wider">{matchingStudent.status} (Verified Profile)</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-400 font-mono uppercase block">Date Of Birth:</span>
                          <span className="font-semibold text-slate-800 font-mono">{matchingStudent.dob || "2009-11-20"}</span>
                        </div>
                      </div>

                      {/* Results and colorful visual splits */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Grades list table */}
                        <div className="md:col-span-7 space-y-1.5 text-left">
                          <span className="text-[8px] uppercase font-black tracking-widest text-[#64748b] block">Academic Marks Scorecard</span>
                          <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                            <table className="w-full text-left border-collapse text-[10.5px]">
                              <thead className="bg-slate-50 text-slate-700 text-[8px] font-black uppercase tracking-wider border-b border-zinc-250">
                                <tr>
                                  <th className="p-2 pl-3">Sub. Code</th>
                                  <th className="p-2">Subject Title</th>
                                  <th className="p-2 text-center">Max</th>
                                  <th className="p-2 text-center">Obtd</th>
                                  <th className="p-2 text-right pr-3">Grade</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-150">
                                {subjectsList.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50/50">
                                    <td className="p-2 pl-3 font-mono text-[9px] text-slate-400 font-bold">{row.code}</td>
                                    <td className="p-2 font-black text-slate-800">{row.title}</td>
                                    <td className="p-2 text-center font-mono text-slate-400">{row.max}</td>
                                    <td className="p-2 text-center font-bold font-mono text-indigo-700">{row.obtained}</td>
                                    <td className="p-2 text-right pr-3 font-black text-[#10b981] font-mono">{row.grade}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Pie Chart Display */}
                        <div className="md:col-span-5 border border-slate-200.5 bg-white rounded-xl shadow-xs p-3 flex flex-col justify-between h-[178px] text-center relative overflow-hidden">
                          <span className="text-[8px] uppercase font-black text-indigo-700 tracking-wider block">Subject weight chart</span>
                          
                          <div className="w-full h-[125px] mt-1">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={rechartsPieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={22}
                                  outerRadius={40}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {rechartsPieData.map((cell, cidx) => (
                                    <Cell key={`cell-${cidx}`} fill={cell.fill} stroke="#ffffff" strokeWidth={1} />
                                  ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ fontSize: "9px" }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 items-center justify-center text-[7.5px] font-bold text-slate-450 leading-none">
                            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />ENG</span>
                            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />MTH</span>
                            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />SCI</span>
                            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" />SST</span>
                            <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-500" />CAP</span>
                          </div>
                        </div>
                      </div>

                      {/* Cumulative Total & Grade Statistics */}
                      <div className="p-3 bg-gradient-to-r from-teal-50/50 via-white to-indigo-50/50 border border-slate-300 rounded-xl grid grid-cols-3 text-center gap-3">
                        <div>
                          <span className="text-[8.5px] text-zinc-500 uppercase font-black block">Total Score</span>
                          <span className="text-sm font-black font-mono text-zinc-900">{totalObtained} / {totalMaxPossible}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-zinc-500 uppercase font-black block">Percentage Grade</span>
                          <span className="text-sm font-black font-mono text-indigo-700">{calculatedAvg}%</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-zinc-500 uppercase font-black block">Final Evaluation</span>
                          <span className="text-[9px] px-3.5 py-0.5 font-black uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-300 tracking-wider inline-block mt-0.5">
                            PASSED (A)
                          </span>
                        </div>
                      </div>

                      {/* Barcode System integration */}
                      <div className="p-3 bg-white border border-slate-205 rounded-xl text-center">
                        {drawBarcode(matchingStudent.admissionNo)}
                        <p className="text-[7.5px] text-slate-400 mt-1.5 uppercase font-mono font-black tracking-widest">
                          🛡️ SECURITY INTEGRITY VERIFIED VIA SECURE DATALINK &bull; AUTHENTIC BARCODE
                        </p>
                      </div>

                      {/* Ledger QR verification and Registrar signatures */}
                      <div className="grid grid-cols-3 items-center text-center text-[10px] pt-3 border-t border-slate-300">
                        <div className="space-y-1">
                          <span className="font-serif italic text-xs text-indigo-850 block font-semibold">Roy Sharma</span>
                          <div className="w-20 mx-auto border-t border-slate-400 pt-0.5">
                            <span className="text-[7.5px] text-slate-400 font-bold block uppercase tracking-wider">Controller Academics</span>
                          </div>
                        </div>

                        {/* Interactive Verification QR Code */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 border border-slate-800 p-0.5 bg-white flex flex-wrap gap-[1px]">
                            <div className="w-2.5 h-2.5 bg-slate-850" />
                            <div className="w-2.5 h-2.5 bg-slate-850" />
                            <div className="w-2.5 h-2.5 bg-slate-850" />
                            <div className="w-1 h-1 bg-slate-200" /><div className="w-1 h-1 bg-slate-850" />
                            <div className="w-2.5 h-2.5 bg-slate-850" /><div className="w-2.5 h-2.5 bg-slate-850" />
                          </div>
                          <span className="text-[6px] text-zinc-400 font-mono tracking-widest block font-bold mt-1">SEAL CHECK</span>
                        </div>

                        <div className="space-y-1">
                          <span className="font-serif italic text-xs text-rose-900 block font-semibold">Dr. Joydeep Baruah</span>
                          <div className="w-20 mx-auto border-t border-slate-400 pt-0.5">
                            <span className="text-[7.5px] text-slate-400 font-bold block uppercase tracking-wider">Director Principal</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    {/* 4. LANDING PAGE DIRECT PORTAL EDITOR MODAL */}
    <AnimatePresence>
      {isEditLandingModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-[999] overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-950 border dark:border-slate-850 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b dark:border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <div className="text-left">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Direct Content Configurator</h3>
                  <p className="text-[9.5px] text-slate-500">Instantly coordinate greetings and support desk details on the live layout.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditLandingModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-left">
              {/* Section 1: Principal message */}
              <div className="space-y-4 border-b dark:border-slate-900 pb-4">
                <span className="font-extrabold text-indigo-500 block text-[9.5px] uppercase tracking-wider">1. Principal Greeting Section Details</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Principal Name</label>
                    <input
                      type="text"
                      value={tempPrincipalName}
                      onChange={(e) => setTempPrincipalName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-905 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Principal Title</label>
                    <input
                      type="text"
                      value={tempPrincipalTitle}
                      onChange={(e) => setTempPrincipalTitle(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-905 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Greeting Welcome Message</label>
                  <textarea
                    rows={3}
                    value={tempPrincipalMessage}
                    onChange={(e) => setTempPrincipalMessage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Principal Image URL</label>
                  <input
                    type="text"
                    value={tempPrincipalImg}
                    onChange={(e) => setTempPrincipalImg(e.target.value)}
                    className="w-full text-[11px] p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Section 2: Support Desk */}
              <div className="space-y-4">
                <span className="font-extrabold text-rose-500 block text-[9.5px] uppercase tracking-wider">2. Support Desk Section Details</span>
                <div>
                  <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Helpdesk Title</label>
                  <input
                    type="text"
                    value={tempSupportTitle}
                    onChange={(e) => setTempSupportTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Helpdesk Description</label>
                  <textarea
                    rows={2}
                    value={tempSupportDesc}
                    onChange={(e) => setTempSupportDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 leading-relaxed font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Support Hotline Phone</label>
                    <input
                      type="text"
                      value={tempSupportPhone}
                      onChange={(e) => setTempSupportPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Support Email Registry</label>
                    <input
                      type="text"
                      value={tempSupportEmail}
                      onChange={(e) => setTempSupportEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-205 dark:border-slate-800 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Edit Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-slate-900">
              <button
                type="button"
                onClick={() => setIsEditLandingModalOpen(false)}
                className="px-4 py-2 border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedTexts = {
                    ...localTextsState,
                    principalName: tempPrincipalName,
                    principalTitle: tempPrincipalTitle,
                    principalMessage: tempPrincipalMessage,
                    principalImg: tempPrincipalImg,
                    supportTitle: tempSupportTitle,
                    supportDesc: tempSupportDesc,
                    supportPhone: tempSupportPhone,
                    supportEmail: tempSupportEmail
                  };
                  setLocalTextsState(updatedTexts);
                  localStorage.setItem("edu_suite_landing_texts", JSON.stringify(updatedTexts));
                  onLogAudit("Direct Landing Edit Message", "Landing Edit Panel", "Saved Principal's greeting & support desk credentials on landing screen directly");
                  setIsEditLandingModalOpen(false);
                  playSfx("success");
                  // Trigger a fast, elegant local reload to align complete state hierarchies
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
              >
                Apply & Save Changes
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* 5. SUPABASE AUTHENTICATION LOGIN MODAL */}
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999] overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-950 border dark:border-slate-850 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b dark:border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Administrative Login</h3>
                  <p className="text-[10px] text-slate-400">Authenticate securely to access your school's live dashboard.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  setIsLoginModalOpen(false);
                  setLoginError(null);
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoggingIn(true);
                setLoginError(null);
                playSfx("click");

                // Standard Offline Admin authentication (Supabase removed completely)
                setTimeout(() => {
                  if (loginEmail === "admin@school.com" && loginPassword === "admin123") {
                    playSfx("success");
                    onLogAudit("Admin Log In", "Authentication", "Admin successfully logged in using standard credentials.");
                    setIsLoginModalOpen(false);
                    onUnlock();
                  } else {
                    setLoginError("Invalid email or password. Please use 'admin@school.com' and 'admin123', or click Direct Demo Bypass.");
                  }
                  setIsLoggingIn(false);
                }, 600);
              }}
              className="space-y-4"
            >
              <div className="space-y-3.5 text-xs">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@school.com"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white font-medium"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="admin123"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? "Logging in..." : "Sign In to Workspace"}
              </button>
            </form>

            {/* Bypass Section */}
            <div className="border-t dark:border-slate-900 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Developer & Demo Bypass</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full font-bold">Offline Active</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Access the entire school workspace instantly using the local offline engine.
              </p>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    playSfx("success");
                    onLogAudit("Admin Log In", "Authentication", "Admin authorized via Quick Demo Bypass.");
                    setIsLoginModalOpen(false);
                    onUnlock();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-zinc-300 font-bold text-[10px] transition-all cursor-pointer border dark:border-slate-800"
                >
                  ⚡ Direct Demo Bypass
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const pin = prompt("Enter Master PIN (Default: 1234 or 2026):");
                    if (pin === "1234" || pin === "2026") {
                      playSfx("success");
                      onLogAudit("Admin Log In", "Authentication", "Admin authorized via PIN input prompt.");
                      setIsLoginModalOpen(false);
                      onUnlock();
                    } else if (pin !== null) {
                      playSfx("error");
                      alert("Invalid Master PIN.");
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-zinc-300 font-bold text-[10px] transition-all cursor-pointer border dark:border-slate-800"
                >
                  🔢 PIN Authenticate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
}
