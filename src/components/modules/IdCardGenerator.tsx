import React, { useState, useRef, useEffect } from "react";
import { 
  Printer, 
  Download, 
  Search, 
  User, 
  Check, 
  Layers, 
  FileText, 
  Grid, 
  CheckSquare, 
  Square, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  AlertCircle, 
  Lock, 
  Plus, 
  RotateCw, 
  Trash2, 
  Sparkles,
  Award,
  BookOpen,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student, Teacher, Staff } from "../../types";
import html2canvas from "html2canvas";

interface IdCardGeneratorProps {
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  currentTheme: any;
  onLogAudit?: (action: string, module: string, details: string) => void;
}

// 10 Distinct Design/Theme presets
interface DesignTheme {
  id: string;
  name: string;
  themeColor: string; // Tailwind indicator color
  topClass: string;   // Classes for top abstract graphics
  botClass: string;   // Classes for bottom abstract graphics
  textColors: {
    title: string;
    sub: string;
    label: string;
    value: string;
  };
  dividerClass: string;
  topLayerStyle?: React.CSSProperties;
  botLayerStyle?: React.CSSProperties;
  badgeClass: string;
}

const PREMIUM_THEMES: DesignTheme[] = [
  {
    id: "aura-gradient",
    name: "Aura Premium",
    themeColor: "from-indigo-600 via-purple-600 to-indigo-800",
    topClass: "from-indigo-900 via-purple-900 to-indigo-950",
    botClass: "from-indigo-950 to-purple-950",
    textColors: { title: "text-white font-extrabold", sub: "text-indigo-200 font-semibold", label: "text-slate-450", value: "text-slate-800" },
    dividerClass: "bg-indigo-100",
    badgeClass: "bg-indigo-600 text-white"
  },
  {
    id: "sleek-origami",
    name: "Sleek Origami",
    themeColor: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    topClass: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    botClass: "from-[#0f172a] to-slate-950",
    textColors: { title: "text-sky-305 text-white font-extrabold", sub: "text-sky-300 font-semibold", label: "text-slate-450", value: "text-slate-800" },
    dividerClass: "bg-sky-100",
    badgeClass: "bg-sky-600 text-white"
  },
  {
    id: "vintage-gold",
    name: "Vintage Gold",
    themeColor: "from-amber-600 via-yellow-600 to-amber-700",
    topClass: "from-stone-900 via-stone-950 to-stone-900",
    botClass: "from-stone-950 to-black",
    textColors: { title: "text-amber-400 font-extrabold", sub: "text-stone-300 font-semibold", label: "text-slate-450", value: "text-amber-900 font-extrabold" },
    dividerClass: "bg-amber-100",
    badgeClass: "bg-amber-500 text-slate-950 font-black",
  },
  {
    id: "quantum-grid",
    name: "Quantum Grid",
    themeColor: "from-teal-600 via-emerald-650 to-teal-800",
    topClass: "from-[#115e59] via-[#0f766e] to-[#134e4a]",
    botClass: "from-[#0f3e3b] to-[#0d2d2a]",
    textColors: { title: "text-emerald-300 font-extrabold", sub: "text-teal-200 font-semibold", label: "text-slate-450", value: "text-emerald-950" },
    dividerClass: "bg-emerald-100",
    badgeClass: "bg-emerald-600 text-white"
  },
  {
    id: "fluid-velvet",
    name: "Fluid Velvet",
    themeColor: "from-fuchsia-600 via-rose-500 to-fuchsia-800",
    topClass: "from-[#4c1d95] via-[#581c87] to-[#3b0764]",
    botClass: "from-[#3b0764] to-black",
    textColors: { title: "text-white font-extrabold", sub: "text-pink-200 font-semibold", label: "text-slate-450", value: "text-fuchsia-950" },
    dividerClass: "bg-fuchsia-100",
    badgeClass: "bg-fuchsia-600 text-white"
  },
  {
    id: "minimalist-construct",
    name: "Bauhaus Minimal",
    themeColor: "from-orange-500 via-red-600 to-slate-950",
    topClass: "from-[#1a1c23] via-[#242630] to-[#121318]",
    botClass: "from-[#121318] to-slate-950",
    textColors: { title: "text-white font-extrabold", sub: "text-orange-400 font-semibold", label: "text-slate-450", value: "text-red-700" },
    dividerClass: "bg-orange-100",
    badgeClass: "bg-orange-600 text-white"
  },
  {
    id: "sunset-mirage",
    name: "Sunset Mirage",
    themeColor: "from-orange-550 via-amber-500 to-yellow-500",
    topClass: "from-orange-600 via-amber-600 to-yellow-600",
    botClass: "from-orange-700 to-orange-950",
    textColors: { title: "text-white font-extrabold", sub: "text-amber-100 font-semibold", label: "text-slate-450", value: "text-amber-950" },
    dividerClass: "bg-amber-100",
    badgeClass: "bg-orange-600 text-white"
  },
  {
    id: "earthy-sage",
    name: "Earthy Sage",
    themeColor: "from-stone-600 via-emerald-800 to-stone-900",
    topClass: "from-[#2c3d30] via-[#243327] to-[#1c2c20]",
    botClass: "from-[#1c2c20] to-[#121914]",
    textColors: { title: "text-white font-extrabold", sub: "text-stone-300 font-semibold", label: "text-slate-450", value: "text-stone-900" },
    dividerClass: "bg-stone-200",
    badgeClass: "bg-emerald-700 text-stone-100"
  },
  {
    id: "space-matrix",
    name: "Space Matrix",
    themeColor: "from-violet-900 via-purple-900 to-slate-950",
    topClass: "from-[#1e1548] via-[#1b1248] to-[#0d0924]",
    botClass: "from-[#0d0924] to-black",
    textColors: { title: "text-purple-300 font-extrabold", sub: "text-slate-400 font-semibold", label: "text-slate-450", value: "text-violet-900 font-semibold" },
    dividerClass: "bg-violet-100",
    badgeClass: "bg-purple-600 text-white"
  },
  {
    id: "metropolis-carbon",
    name: "Carbon Classic",
    themeColor: "from-zinc-700 via-zinc-800 to-zinc-950",
    topClass: "from-zinc-800 via-zinc-900 to-zinc-950",
    botClass: "from-zinc-900 to-black",
    textColors: { title: "text-yellow-400 font-extrabold", sub: "text-zinc-400 font-semibold", label: "text-slate-450", value: "text-neutral-900" },
    dividerClass: "bg-zinc-200",
    badgeClass: "bg-yellow-450 bg-yellow-400 text-neutral-900 font-extrabold"
  }
];

// Presets images matching gender and age roughly if we can't find direct portrait
const DEFAULT_AVATARS = {
  Student_Male: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
  Student_Female: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&h=150&q=80",
  Teacher_Male: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  Teacher_Female: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
  Staff_Generic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
};

export default function IdCardGenerator({ students, teachers, staff, currentTheme, onLogAudit }: IdCardGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"student" | "teacher" | "staff">("student");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("aura-gradient");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Selection mode: single choice or batch checkboxes
  const [selectionType, setSelectionType] = useState<"one-by-one" | "multiple">("one-by-one");
  
  // Selected IDs list
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // In single select mode, track the active selected ID
  const [singleSelectedId, setSingleSelectedId] = useState<string>("");

  // Common school configs
  const [schoolName, setSchoolName] = useState<string>("BRIGHT FUTURE ACADEMY");
  const [schoolMotto, setSchoolMotto] = useState<string>("LEARN • INSPIRE • ACHIEVE");
  const [schoolWebsite, setSchoolWebsite] = useState<string>("www.brightfuture.edu");
  const [schoolEmail, setSchoolEmail] = useState<string>("info@brightfuture.edu");
  const [schoolPhone, setSchoolPhone] = useState<string>("+91 98765 43210");
  const [schoolAddress, setSchoolAddress] = useState<string>("Green Avenue Campus, Sector-4, New Delhi");
  const [validUntil, setValidUntil] = useState<string>("2028");

  // Filter criteria for listings
  const [classFilter, setClassFilter] = useState<string>("All");

  // Front vs Back review
  const [reviewSide, setReviewSide] = useState<"front" | "back">("front");

  // Track if printing overlay is active
  const [isA4PrintingMode, setIsA4PrintingMode] = useState<boolean>(false);
  const [isSavingGraphic, setIsSavingGraphic] = useState<boolean>(false);

  // Load correct background based on theme configuration
  const activeDesignTheme = PREMIUM_THEMES.find(t => t.id === selectedThemeId) || PREMIUM_THEMES[0];

  useEffect(() => {
    // Default select first available item upon loading
    if (activeTab === "student" && students.length > 0) {
      const defaultId = students[0].id;
      setSingleSelectedId(defaultId);
      setSelectedIds([defaultId]);
    } else if (activeTab === "teacher" && teachers.length > 0) {
      const defaultId = teachers[0].id;
      setSingleSelectedId(defaultId);
      setSelectedIds([defaultId]);
    } else if (activeTab === "staff" && staff.length > 0) {
      const defaultId = staff[0].id;
      setSingleSelectedId(defaultId);
      setSelectedIds([defaultId]);
    }
  }, [activeTab]);

  // Helper lists computed dynamically
  const getFilteredItems = () => {
    if (activeTab === "student") {
      return students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchClass = classFilter === "All" || s.className === classFilter;
        return matchSearch && matchClass;
      });
    } else if (activeTab === "teacher") {
      return teachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return staff.filter(st => st.name.toLowerCase().includes(searchQuery.toLowerCase()) || st.id.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  };

  const getProfilePhoto = (item: any, type: "student" | "teacher" | "staff") => {
    // If customized picture uploaded, we could allow it. By default map to realistic Unsplash portraits
    const seed = item.name.length;
    if (type === "student") {
      return seed % 2 === 0 ? DEFAULT_AVATARS.Student_Female : DEFAULT_AVATARS.Student_Male;
    } else if (type === "teacher") {
      return seed % 2 === 0 ? DEFAULT_AVATARS.Teacher_Female : DEFAULT_AVATARS.Teacher_Male;
    } else {
      return DEFAULT_AVATARS.Staff_Generic;
    }
  };

  // Switch selection in one-by-one mode
  const handleItemClick = (id: string) => {
    setSingleSelectedId(id);
    if (selectionType === "one-by-one") {
      setSelectedIds([id]);
    } else {
      // Toggle in multi mode
      if (selectedIds.includes(id)) {
        setSelectedIds(prev => prev.filter(x => x !== id));
      } else {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const handleSelectAll = () => {
    const list = getFilteredItems().map(x => x.id);
    setSelectedIds(list);
    if (list.length > 0 && selectionType === "one-by-one") {
      setSingleSelectedId(list[0]);
    }
    if (onLogAudit) {
      onLogAudit("Batch Selected ID Cards", "ID_CARDS", `Selected all matching filtered ${activeTab} cards.`);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setSingleSelectedId("");
  };

  // Generate unique barcode based on card entry
  const getDummyBarcodePattern = (code: string) => {
    const bars = [];
    const seed = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 0; i < 28; i++) {
      const widthClass = (seed + i) % 5 === 0 ? "w-1" : (seed * i) % 3 === 0 ? "w-[3px]" : "w-[1.5px]";
      const color = (seed - i) % 2 === 0 ? "bg-black" : "bg-transparent";
      bars.push(<div key={i} className={`${widthClass} h-10 ${color}`} />);
    }
    return bars;
  };

  // Find accurate card data based on ID values
  const getCardDetailsById = (id: string, type: "student" | "teacher" | "staff") => {
    if (type === "student") {
      const s = students.find(x => x.id === id);
      if (!s) return null;
      return {
        id: s.id,
        name: s.name,
        role: "STUDENT",
        photo: getProfilePhoto(s, "student"),
        email: s.email || `${s.id.toLowerCase()}@brightfuture.edu`,
        phone: s.phone || s.parentPhone || "N/A",
        meta1: { label: "Class", value: `${s.className} - ${s.section || "A"}` },
        meta2: { label: "Admission No", value: s.admissionNo || s.id },
        meta3: { label: "Blood Group", value: s.bloodGroup || "O+" },
        meta4: { label: "D.O.B", value: s.dob || "15 May 21" }
      };
    } else if (type === "teacher") {
      const t = teachers.find(x => x.id === id);
      if (!t) return null;
      return {
        id: t.id,
        name: t.name,
        role: "TEACHER",
        photo: getProfilePhoto(t, "teacher"),
        email: t.email,
        phone: t.phone,
        meta1: { label: "Designation", value: t.designation || "Lecturer" },
        meta2: { label: "Department", value: t.subjectAllocation?.[0] || "Academics" },
        meta3: { label: "Joining Date", value: "01 Jul 2023" },
        meta4: { label: "Employee ID", value: t.id }
      };
    } else {
      const st = staff.find(x => x.id === id);
      if (!st) return null;
      return {
        id: st.id,
        name: st.name,
        role: "STAFF",
        photo: getProfilePhoto(st, "staff"),
        email: st.email || `${st.id.toLowerCase()}@brightfuture.edu`,
        phone: st.phone || "N/A",
        meta1: { label: "Designation", value: st.role || "Support Staff" },
        meta2: { label: "Department", value: st.department || "Logistics" },
        meta3: { label: "Joining Date", value: "10 Jan 2024" },
        meta4: { label: "Employee ID", value: st.id }
      };
    }
  };

  const getActiveItemDetails = () => {
    if (!singleSelectedId) return null;
    return getCardDetailsById(singleSelectedId, activeTab);
  };

  const activeCard = getActiveItemDetails();

  // Handle browser direct print utility
  const handleA4PrintAction = () => {
    let printCount = selectedIds.length;
    if (printCount === 0 && singleSelectedId) {
      setSelectedIds([singleSelectedId]);
      printCount = 1;
    }
    if (onLogAudit) {
      onLogAudit("Triggered Professional A4 PDF Print Job", "ID_CARDS", `Printing ${printCount > 0 ? printCount : 1} ID cards.`);
    }
    
    // Ensure the window focuses before calling the print dialog inside an iframe
    window.focus();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Download high-resolution PNG representing the card side cleanly using html2canvas
  const handleDownloadCard = async (side: "front" | "back") => {
    if (!activeCard) return;
    setIsSavingGraphic(true);
    
    try {
      const elementId = side === "front" 
        ? `download-target-front-${activeCard.id}` 
        : `download-target-back-${activeCard.id}`;
      
      const element = document.getElementById(elementId);
      if (!element) {
        console.error("Card element not found:", elementId);
        setIsSavingGraphic(false);
        return;
      }

      // Convert OKLCH colors to sRGB format because html2canvas color-parser doesn't support oklch()
      const parseAndConvertOklch = (val: string): string => {
        if (!val || typeof val !== "string") return val;
        if (!val.includes("oklch")) return val;

        return val.replace(/oklch\(([^)]+)\)/g, (match, content) => {
          try {
            const parts = content.trim().replace(/,/g, " ").replace(/\//g, " ").replace(/\s+/g, " ").split(" ");
            if (parts.length < 3) return match;

            // Extract Lightness
            let lVal = parts[0];
            let l = lVal.endsWith("%") ? parseFloat(lVal) / 100 : parseFloat(lVal);

            // Extract Chroma
            let c = parseFloat(parts[1]);

            // Extract Hue with support for units
            let hVal = parts[2];
            let h = 0;
            if (hVal.endsWith("deg")) {
              h = parseFloat(hVal);
            } else if (hVal.endsWith("rad")) {
              h = (parseFloat(hVal) * 180) / Math.PI;
            } else if (hVal.endsWith("turn")) {
              h = parseFloat(hVal) * 360;
            } else {
              h = parseFloat(hVal);
            }

            // Extract Alpha/Opacity if any
            let a = 1;
            if (parts.length >= 4) {
              let aVal = parts[3];
              a = aVal.endsWith("%") ? parseFloat(aVal) / 100 : parseFloat(aVal);
            }

            if (isNaN(l) || isNaN(c) || isNaN(h)) return match;

            // Mathematical conversion of OKLCH -> OKLAB -> LMS -> Linear sRGB -> sRGB (gamma-corrected)
            const hRad = (h * Math.PI) / 180;
            const a_ = c * Math.cos(hRad);
            const b_ = c * Math.sin(hRad);

            const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
            const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
            const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

            const l3 = l_ * l_ * l_;
            const m3 = m_ * m_ * m_;
            const s3 = s_ * s_ * s_;

            const rL = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
            const gL = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
            const bL = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

            const gamma = (x: number) => (x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
            const r = Math.round(Math.max(0, Math.min(1, gamma(rL))) * 255);
            const g = Math.round(Math.max(0, Math.min(1, gamma(gL))) * 255);
            const b = Math.round(Math.max(0, Math.min(1, gamma(bL))) * 255);

            return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
          } catch (e) {
            console.warn("Parse OKLCH error:", e);
            return match;
          }
        });
      };
      
      // Configure html2canvas to render full vector sharpness and custom layout assets correctly
      const canvas = await html2canvas(element, {
        scale: 3, // Premium high density pixel scale
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        onclone: (clonedDoc) => {
          // Preemptively map computed oklch colors on every element to fallback sRGB style in cloned document
          const clonedElements = clonedDoc.querySelectorAll("*");
          clonedElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (!htmlEl.style) return;

            // Get computed style properties to convert
            const computedStyle = window.getComputedStyle(htmlEl);
            const cssProperties = [
              "backgroundColor",
              "color",
              "borderColor",
              "borderTopColor",
              "borderRightColor",
              "borderBottomColor",
              "borderLeftColor",
              "backgroundImage",
              "boxShadow",
              "fill",
              "stroke"
            ];

            cssProperties.forEach((prop) => {
              const originalVal = computedStyle[prop as any];
              if (originalVal && typeof originalVal === "string" && originalVal.includes("oklch")) {
                const sRgbColor = parseAndConvertOklch(originalVal);
                htmlEl.style[prop as any] = sRgbColor;
              }
            });

            // Clean parsed attribute styled elements
            if (htmlEl.getAttribute("style")?.includes("oklch")) {
              const inlineStyle = htmlEl.getAttribute("style") || "";
              htmlEl.setAttribute("style", parseAndConvertOklch(inlineStyle));
            }
          });
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${activeCard.name.replace(/\s+/g, "_")}_ID_Card_${side.toUpperCase()}.png`;
      link.click();
      
      if (onLogAudit) {
        onLogAudit("Downloaded ID Card Graphic", "ID_CARDS", `Exported high-res ${side.toUpperCase()} PNG for ${activeCard.name}`);
      }
    } catch (err) {
      console.error("Failed to render high-res ID card canvas:", err);
    } finally {
      setIsSavingGraphic(false);
    }
  };

  // Helper to render high-contrast elegant vector arts as abstract backgrounds for each theme
  const renderAbstractTopBackground = (themeId: string) => {
    switch (themeId) {
      case "aura-gradient":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="aura-tg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="95" cy="15" r="45" fill="url(#aura-tg)" />
              <path d="M0,0 Q35,55 100,20 L100,0 Z" fill="url(#aura-tg)" />
              <circle cx="10" cy="85" r="15" fill="#ffffff" opacity="0.08" />
            </svg>
          </div>
        );
      case "sleek-origami":
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <polygon points="0,0 45,0 15,100 0,100" fill="#ffffff" opacity="0.12" />
              <polygon points="100,0 55,0 85,100 100,100" fill="#ffffff" opacity="0.08" />
              <line x1="15" y1="0" x2="35" y2="100" stroke="#38bdf8" strokeWidth="0.4" />
              <line x1="85" y1="0" x2="65" y2="100" stroke="#6366f1" strokeWidth="0.4" />
            </svg>
          </div>
        );
      case "vintage-gold":
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <line x1="0" y1="92" x2="100" y2="92" stroke="#d97706" strokeWidth="1.2" />
              <line x1="0" y1="96" x2="100" y2="96" stroke="#fbbf24" strokeWidth="0.4" />
              <path d="M-10,35 L110,65 L110,75 L-10,45 Z" fill="#d97706" opacity="0.3" />
              <path d="M-10,15 L110,45 L110,50 L-10,20 Z" fill="#ffffff" opacity="0.12" />
            </svg>
          </div>
        );
      case "quantum-grid":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" stroke="#10b981">
              <g strokeWidth="0.25" strokeDasharray="1,2">
                <line x1="15" y1="0" x2="15" y2="100" />
                <line x1="35" y1="0" x2="35" y2="100" />
                <line x1="55" y1="0" x2="55" y2="100" />
                <line x1="75" y1="0" x2="75" y2="100" />
                <line x1="95" y1="0" x2="95" y2="100" />
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="55" x2="100" y2="55" />
                <line x1="0" y1="85" x2="100" y2="85" />
              </g>
              <circle cx="35" cy="55" r="1.2" fill="#10b981" />
              <circle cx="75" cy="20" r="1.2" fill="#10b981" />
              <circle cx="55" cy="85" r="1.2" fill="#10b981" />
              <path d="M35,55 L75,20 L55,85 Z" fill="none" strokeWidth="0.4" />
            </svg>
          </div>
        );
      case "fluid-velvet":
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <radialGradient id="velvet-tg" cx="15%" cy="30%" r="55%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a21caf" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100" height="100" fill="url(#velvet-tg)" />
              <path d="M0,85 C25,45 65,115 100,75 L100,0 L0,0 Z" fill="#ec4899" opacity="0.08" />
            </svg>
          </div>
        );
      case "minimalist-construct":
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <rect x="8" y="8" width="28" height="28" fill="#ea580c" opacity="0.4" />
              <circle cx="82" cy="38" r="22" fill="#dc2626" opacity="0.3" />
              <line x1="0" y1="88" x2="100" y2="88" stroke="#ea580c" strokeWidth="2.5" />
            </svg>
          </div>
        );
      case "sunset-mirage":
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <g stroke="#ffffff" strokeWidth="0.4" opacity="0.4">
                <line x1="0" y1="0" x2="100" y2="12" />
                <line x1="0" y1="0" x2="100" y2="32" />
                <line x1="0" y1="0" x2="100" y2="52" />
                <line x1="0" y1="0" x2="100" y2="72" />
                <line x1="0" y1="0" x2="100" y2="92" />
                <line x1="0" y1="0" x2="62" y2="100" />
                <line x1="0" y1="0" x2="32" y2="100" />
              </g>
            </svg>
          </div>
        );
      case "earthy-sage":
        return (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,82 C18,62 38,92 58,72 C72,57 82,87 100,52 L100,0 L0,0 Z" fill="#f5f5f4" opacity="0.25" />
              <path d="M0,48 C28,28 68,68 100,38 L100,0 L0,0 Z" fill="#ffffff" opacity="0.15" />
            </svg>
          </div>
        );
      case "space-matrix":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <g stroke="#a78bfa" strokeWidth="0.2">
                <line x1="20" y1="0" x2="20" y2="100" strokeDasharray="1,2" />
                <line x1="40" y1="0" x2="40" y2="100" strokeDasharray="1,2" />
                <line x1="60" y1="0" x2="60" y2="100" strokeDasharray="1,2" />
                <line x1="80" y1="0" x2="80" y2="100" strokeDasharray="1,2" />
              </g>
              <circle cx="40" cy="25" r="1.2" fill="#a78bfa" className="animate-pulse" />
              <circle cx="80" cy="65" r="0.8" fill="#c084fc" />
            </svg>
          </div>
        );
      case "metropolis-carbon":
        return (
          <div className="absolute inset-0 opacity-12 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <pattern id="carbon-tg-pat" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#09090b" />
                <rect width="2" height="2" fill="#18181b" />
              </pattern>
              <rect width="100" height="100" fill="url(#carbon-tg-pat)" />
              <line x1="0" y1="92" x2="100" y2="92" stroke="#eab308" strokeWidth="1.5" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAbstractBotBackground = (themeId: string) => {
    switch (themeId) {
      case "aura-gradient":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,52 Q42,95 100,62 L100,100 L0,100 Z" fill="#ffffff" opacity="0.3" />
            </svg>
          </div>
        );
      case "sleek-origami":
        return (
          <div className="absolute inset-0 opacity-12 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <polygon points="100,100 52,100 82,0 100,0" fill="#ffffff" opacity="0.12" />
            </svg>
          </div>
        );
      case "vintage-gold":
        return (
          <div className="absolute inset-0 opacity-12 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <line x1="0" y1="12" x2="100" y2="12" stroke="#d97706" strokeWidth="1.2" />
              <path d="M0,12 L100,28 L100,100 L0,100 Z" fill="#d97706" opacity="0.08" />
            </svg>
          </div>
        );
      case "quantum-grid":
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" stroke="#10b981">
              <g strokeWidth="0.2" strokeDasharray="1,2">
                <line x1="0" y1="32" x2="100" y2="32" />
                <line x1="0" y1="68" x2="100" y2="68" />
              </g>
            </svg>
          </div>
        );
      case "fluid-velvet":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <circle cx="85" cy="85" r="32" fill="#ec4899" opacity="0.25" />
            </svg>
          </div>
        );
      case "minimalist-construct":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <line x1="0" y1="18" x2="100" y2="18" stroke="#dc2626" strokeWidth="2.5" />
            </svg>
          </div>
        );
      case "sunset-mirage":
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,100 L100,35 L100,100 Z" fill="#ffffff" opacity="0.12" />
            </svg>
          </div>
        );
      case "earthy-sage":
        return (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,100 C42,72 62,92 100,62 L100,100 Z" fill="#ffffff" opacity="0.15" />
            </svg>
          </div>
        );
      case "space-matrix":
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <line x1="0" y1="52" x2="100" y2="52" stroke="#a78bfa" strokeWidth="0.4" strokeDasharray="2,2" />
            </svg>
          </div>
        );
      case "metropolis-carbon":
        return (
          <div className="absolute inset-0 opacity-12 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <line x1="0" y1="18" x2="100" y2="18" stroke="#eab308" strokeWidth="1.5" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Render individual card container with abstract top/bottom headers and white center body
  const renderPremiumIdCard = (card: any, theme: DesignTheme) => {
    if (!card) return null;

    return (
      <div 
        id={`print-card-${card.id}`}
        className="w-[330px] h-[520px] bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-slate-200 shrink-0 select-none font-sans"
        style={{ contentVisibility: "auto" }}
      >
        {/* --- ABSTRACT TOP HEADER --- */}
        <div className={`relative h-[115px] bg-gradient-to-r ${theme.topClass} px-5 py-3.5 flex items-center justify-between overflow-hidden shrink-0`}>
          {/* Custom SVG Abstract Overlay based on selected theme */}
          {renderAbstractTopBackground(theme.id)}

          {/* Clean Layout: Crest, School Name and Microchip */}
          <div className="relative z-10 flex items-center gap-3.5 w-full">
            {/* School Crest Badge styled beautifully */}
            <div className="w-[42px] h-[42px] bg-white rounded-xl shadow-lg p-1.5 flex items-center justify-center border border-slate-100 shrink-0">
              <Award className="text-slate-800 w-full h-full" strokeWidth={2.4} />
            </div>

            {/* School Name and Motto correctly placed on top side-by-side with logo */}
            <div className="text-left select-none overflow-hidden flex-1 min-w-0">
              <h3 className={`text-[12px] font-black uppercase tracking-wide leading-tight truncate ${theme.textColors.title}`}>
                {schoolName}
              </h3>
              <p className={`text-[7.5px] font-bold tracking-widest mt-0.5 opacity-85 select-none uppercase truncate ${theme.textColors.sub}`}>
                {schoolMotto}
              </p>
            </div>
          </div>
        </div>

        {/* --- PREMIUM WHITE BODY CANVAS --- */}
        <div className="flex-1 bg-white relative px-5 flex flex-col items-center justify-start select-none pt-2.5">
          {/* Subtle Watermark Grid Design in Whitspace */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-45 pointer-events-none" />

          {/* Golden security star watermark */}
          <div className="absolute top-[38%] text-slate-100 font-black text-6xl opacity-[0.08] font-sans tracking-widest uppercase pointer-events-none">
            BFACAD
          </div>

          {/* ROUNDED SQUARE Portrait Area with Custom Border */}
            <div className="relative z-10 -mt-[44px] bg-white p-1.5 rounded-[22px] shadow-lg border border-slate-100">
            <div className="relative w-[114px] h-[114px] rounded-[18px] overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-inner">
              <img 
                src={card.photo} 
                alt={card.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Name & Role Designation Tag */}
          <div className="text-center mt-3 z-10">
            <h4 className="text-[16px] font-black tracking-tight text-slate-850 uppercase leading-snug">
              {card.name}
            </h4>
            <span className={`inline-block mt-1 px-4 py-0.5 rounded-full text-[8.5px] font-black tracking-wider uppercase shadow-xs ${theme.badgeClass}`}>
              {card.role}
            </span>
          </div>

          {/* Card Info Metal Grid Rows */}
          <div className="w-full mt-4.5 space-y-1.5 z-10 px-0.5">
            <div className="grid grid-cols-12 gap-1 text-[11px] py-1 border-b border-dashed border-slate-100">
              <span className="col-span-5 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                {card.meta1.label}
              </span>
              <span className="col-span-1 text-slate-350 font-mono">:</span>
              <span className="col-span-6 text-slate-800 font-extrabold text-right truncate">
                {card.meta1.value}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-1 text-[11px] py-1 border-b border-dashed border-slate-100">
              <span className="col-span-5 text-slate-440 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                {card.meta2.label}
              </span>
              <span className="col-span-1 text-slate-350 font-mono">:</span>
              <span className="col-span-6 text-slate-800 font-extrabold text-right truncate">
                {card.meta2.value}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-1 text-[11px] py-1 border-b border-dashed border-slate-100">
              <span className="col-span-5 text-slate-440 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                {card.meta3.label}
              </span>
              <span className="col-span-1 text-slate-350 font-mono">:</span>
              <span className="col-span-6 text-slate-800 font-extrabold text-right truncate">
                {card.meta3.value}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-1 text-[11px] py-1">
              <span className="col-span-5 text-slate-440 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                {card.meta4.label}
              </span>
              <span className="col-span-1 text-slate-355 font-mono text-slate-350">:</span>
              <span className="col-span-6 text-slate-800 font-extrabold text-right truncate">
                {card.meta4.value}
              </span>
            </div>
          </div>
        </div>

        {/* --- ABSTRACT BOTTOM FOOTER --- */}
        <div className={`relative h-[65px] bg-gradient-to-r ${theme.botClass} px-5 py-2 flex items-center justify-between shrink-0 overflow-hidden`}>
          {/* Custom SVG Abstract overlay based on selected theme */}
          {renderAbstractBotBackground(theme.id)}

          {/* Fine Barcode Representation Graphic */}
          <div className="bg-white/95 px-2 py-1 rounded w-[110px] h-9.5 flex flex-col justify-between shadow-xs z-10 relative">
            <div className="flex justify-between items-center gap-0.5 overflow-hidden">
              {getDummyBarcodePattern(card.id)}
            </div>
            <span className="text-[7.5px] font-black tracking-widest font-mono text-center text-slate-850 mt-0.5">
              {card.id}
            </span>
          </div>

          <div className="text-right z-10">
            <span className="text-[7.5px] text-white/70 uppercase tracking-widest font-black block">Valid Until</span>
            <span className="text-[12.5px] text-white font-black">{validUntil}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBackPremiumIdCard = (card: any, theme: DesignTheme) => {
    if (!card) return null;

    return (
      <div 
        id={`print-card-back-${card.id}`}
        className="w-[330px] h-[520px] bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-slate-200 shrink-0 select-none font-sans"
      >
        
        {/* Abstract TOP banner for Back side (Sleeker and premium) */}
        <div className={`relative h-[65px] bg-gradient-to-r ${theme.topClass} px-5 flex items-center shrink-0 overflow-hidden`}>
          {renderAbstractTopBackground(theme.id)}
          <h4 className="text-white text-[12px] font-black tracking-widest uppercase z-10 relative">
            ID CARD REGULATIONS
          </h4>
        </div>

        {/* Back side details body */}
        <div className="flex-1 bg-white relative p-6 flex flex-col justify-between text-slate-600 text-[10px] space-y-4">
          <div className="space-y-3.5 pt-2">
            <div className="flex gap-2.5 items-start">
              <span className="w-4 h-4 rounded-full bg-slate-105 bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">1</span>
              <p className="leading-normal font-medium">This card is non-transferable and remains the proprietary asset of the school admin registry.</p>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-4 h-4 rounded-full bg-slate-105 bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">2</span>
              <p className="leading-normal font-medium">The holder must display this credential prominently at all times while within educational boundaries.</p>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-4 h-4 rounded-full bg-slate-105 bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">3</span>
              <p className="leading-normal font-medium">If lost or found, please return direct to the central logistics registry department immediately.</p>
            </div>
          </div>

          {/* School contacts section */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Central Helpdesk</span>
            
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MapPin size={11} className="text-indigo-500 shrink-0" />
              <span className="truncate">{schoolAddress}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Phone size={11} className="text-indigo-500 shrink-0" />
              <span>{schoolPhone}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Mail size={11} className="text-indigo-500 shrink-0" />
              <span className="truncate">{schoolEmail}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Globe size={11} className="text-indigo-500 shrink-0" />
              <span>{schoolWebsite}</span>
            </div>
          </div>

          {/* Signatory Area */}
          <div className="flex justify-between items-end border-t border-slate-100 pt-3">
            <div className="text-slate-400 text-[8px] font-bold">
              Barcode Verified ID
            </div>
            <div className="text-right">
              <div className="text-[13px] font-serif italic text-indigo-900 font-semibold">
                Dr. A. K. Verma
              </div>
              <div className="text-[8px] font-bold text-slate-450 uppercase mt-0.5 tracking-wider">
                Principal Signatory
              </div>
            </div>
          </div>
        </div>

        {/* Abstract BOTTOM banner for Back side */}
        <div className={`relative h-[40px] bg-gradient-to-r ${theme.botClass} shrink-0 overflow-hidden`}>
          {renderAbstractBotBackground(theme.id)}
        </div>
      </div>
    );
  };

  // Printable A4 (3x3 grid) Page Assembler
  const renderA4PrintContainer = () => {
    // Collect selected cards details
    let idsToPrint = [...selectedIds];
    if (idsToPrint.length === 0 && singleSelectedId) {
      idsToPrint = [singleSelectedId];
    }
    const cardsToPrint = idsToPrint.slice(0, 9).map(id => getCardDetailsById(id, activeTab)).filter(Boolean);

    return (
      <div className="a4-print-sheet p-[8mm] bg-white text-slate-900 hidden print:block w-[210mm] min-h-[297mm] mx-auto">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .a4-print-sheet, .a4-print-sheet * {
              visibility: visible;
            }
            aside, header, footer, nav, [role="navigation"], .no-print-area {
              display: none !important;
            }
            html, body, #root, #root > div, main {
              overflow: visible !important;
              height: auto !important;
              max-height: none !important;
              min-height: 0 !important;
              position: static !important;
              display: block !important;
              background: white !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .a4-print-sheet {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 4mm !important;
              background: white !important;
              display: block !important;
            }
            body { 
              background: white !important; 
              color: black !important; 
              -webkit-print-color-adjust: exact !important; 
            }
          }
          @page {
            size: A4;
            margin: 0;
          }
        `}} />

        <div className="text-[9px] font-bold text-slate-400 font-mono mb-4 text-center print:hidden border-b pb-2 flex justify-between items-center no-print-area">
          <span>A4 SIZE PREPRINT PROTOCOL &amp; LAYOUT PREVIEW (3x3 BATCH GRID)</span>
          <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full font-black">9 IDs TARGETED</span>
        </div>

        {/* CSS GRID perfectly formatted for A4 page size prints */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 justify-items-center items-center">
          {cardsToPrint.map((card, idx) => (
            <div key={idx} className="scale-[0.88] origin-center my-0.5">
              {renderPremiumIdCard(card, activeDesignTheme)}
            </div>
          ))}
          
          {/* Fill remaining slots with nice informational cards if less than 9 are chosen */}
          {Array.from({ length: Math.max(0, 9 - cardsToPrint.length) }).map((_, emptyIdx) => (
            <div 
              key={`empty-${emptyIdx}`}
              className="w-[330px] h-[520px] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6 text-center scale-[0.88]"
            >
              <CreditCard className="text-slate-350 w-12 h-12 mb-3" />
              <h5 className="text-xs font-bold text-slate-500">Unused Print Grid Slot</h5>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">Select additional {activeTab}s from the left catalog checklist to fill this target position.</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden font-sans shadow-3xl text-slate-100 relative">
      
      {/* 👑 PREMIUM HEADER STRIP */}
      <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-6 shrink-0 no-print-area print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10 w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-black tracking-widest uppercase mb-3.5">
              <Sparkles size={11.5} />
              <span>Advanced 9-Card A4 Printing System</span>
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-2">
              Premium Multi-Design ID Studio
            </h1>
            <p className="text-xs text-slate-450 mt-1 max-w-xl font-medium leading-relaxed">
              Auto-generate customized Student, Professor, or Admin cards using 10 aesthetic themes. Download separately or batch-print on high-density A4 stock sheets instantly.
            </p>
          </div>

          {/* Type selectors: Student, Teacher, Staff */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
            {(["student", "teacher", "staff"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase rounded-xl transition-all duration-300 ${
                  activeTab === type
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]"
                    : "text-slate-550 hover:text-slate-350"
                }`}
              >
                {type === "student" && <BookOpen size={12} />}
                {type === "teacher" && <Award size={12} />}
                {type === "staff" && <Briefcase size={12} />}
                <span>{type}s</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COMPONENT BODY SPLIT WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-y-auto no-print-area print:hidden">
        
        {/* === LEFT CONFIG PANEL (xl:col-span-5) === */}
        <div className="xl:col-span-5 p-6 border-r border-slate-800 bg-slate-950/40 overflow-y-auto space-y-6">
          
          {/* SELECTION MECHANISM TOGGLER */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
              Selection Way
            </span>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
              <button
                onClick={() => {
                  setSelectionType("one-by-one");
                  if (singleSelectedId) {
                    setSelectedIds([singleSelectedId]);
                  } else if (getFilteredItems().length > 0) {
                    const firstId = getFilteredItems()[0].id;
                    setSingleSelectedId(firstId);
                    setSelectedIds([firstId]);
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  selectionType === "one-by-one"
                    ? "bg-slate-850 text-indigo-400 shadow-md font-black"
                    : "text-slate-450 hover:text-slate-300"
                }`}
              >
                One-By-One Select
              </button>

              <button
                onClick={() => setSelectionType("multiple")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  selectionType === "multiple"
                    ? "bg-slate-850 text-indigo-400 shadow-md font-black"
                    : "text-slate-450 hover:text-slate-300"
                }`}
              >
                Multiple Batch Select
              </button>
            </div>
          </div>

          {/* ACTIVE DIRECTORY CHOOSE CONTAINER */}
          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
                {activeTab.toUpperCase()} CATALOG DIRECTORY
              </span>
              
              {selectionType === "multiple" && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSelectAll}
                    className="text-[9px] text-indigo-400 hover:text-indigo-300 font-extrabold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-700">|</span>
                  <button 
                    onClick={handleClearSelection}
                    className="text-[9px] text-rose-400 hover:text-rose-300 font-extrabold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-550" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} names directly...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850/70 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Class Filter if Students Tab */}
              {activeTab === "student" && (
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-850 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-400 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Grades</option>
                  {Array.from(new Set(students.map(s => s.className))).sort().map(cl => (
                    <option key={cl} value={cl}>Grade {cl}</option>
                  ))}
                </select>
              )}
            </div>

            {/* List with selection Checkbox */}
            <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar w-full">
              {getFilteredItems().length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-medium">
                  No matching registered directory entries found.
                </div>
              ) : (
                getFilteredItems().map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const isSingle = singleSelectedId === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                        isSingle && selectionType === "one-by-one"
                          ? "bg-indigo-600/15 border-indigo-500 text-indigo-200"
                          : isChecked && selectionType === "multiple"
                            ? "bg-indigo-500/10 border-indigo-650/50 text-indigo-300"
                            : "bg-slate-950/65 hover:bg-slate-900 text-slate-400 border border-slate-850"
                      } border`}
                    >
                      <div className="truncate pr-2 flex items-center gap-2.5">
                        {selectionType === "multiple" ? (
                          isChecked ? (
                            <CheckSquare size={13.5} className="text-indigo-400 shrink-0" />
                          ) : (
                            <Square size={13.5} className="text-slate-650 shrink-0" />
                          )
                        ) : (
                          <User size={12} className="opacity-60 text-indigo-400 shrink-0" />
                        )}
                        <span className="font-bold truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-slate-500 font-mono">
                          {item.id}
                        </span>
                        {activeTab === "student" && (
                          <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black">
                            {(item as Student).className}{(item as Student).section ? `-${(item as Student).section}` : ""}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 10 PREMIUM TEMPLATE CARDS GRID TABS */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
              10 Premium Design Templates
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
              {PREMIUM_THEMES.map((theme) => {
                const isActive = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedThemeId(theme.id);
                      if (onLogAudit) {
                        onLogAudit("Changed ID Design Template", "ID_CARDS", `Elected theme preset: ${theme.name}`);
                      }
                    }}
                    className={`p-2 bg-slate-950 hover:bg-slate-900/90 rounded-xl transition-all border text-center flex flex-col justify-between items-center gap-1.5 cursor-pointer ${
                      isActive ? "border-indigo-500 scale-[1.04] bg-indigo-950/20" : "border-slate-850 hover:border-slate-705"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${theme.themeColor} shadow-md flex items-center justify-center text-white text-[10px]`}>
                      {theme.name.charAt(0)}
                    </div>
                    <span className="text-[8.5px] font-black truncate max-w-full text-slate-400">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACADEMIC INSTITUTION CONFIG SETTINGS CARD */}
          <div className="bg-slate-900/35 p-4 rounded-2xl border border-slate-800/60 space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
              Institution branding configurations
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1">
                  Motto Tagline
                </label>
                <input
                  type="text"
                  value={schoolMotto}
                  onChange={(e) => setSchoolMotto(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1">
                  Helpdesk Phone
                </label>
                <input
                  type="text"
                  value={schoolPhone}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1">
                  Valid Till Year
                </label>
                <input
                  type="text"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1">
                  Campus Address
                </label>
                <input
                  type="text"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* === RIGHT REALTIME INTERACTIVE DESIGN BOARD (xl:col-span-7) === */}
        <div className="xl:col-span-7 p-6 md:p-8 bg-slate-900/60 overflow-y-auto flex flex-col items-center justify-start space-y-6 w-full text-center">
          
          {/* Action Header bar for quick print grid and details info */}
          <div className="w-full max-w-2xl bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Active Prints State</span>
              <p className="text-xs text-slate-300 font-bold mt-0.5">
                {selectedIds.length === 0 
                  ? (singleSelectedId ? `Ready to print currently viewed ID card.` : "No cards selected. Tick checkboxes on left registry list.") 
                  : `${selectedIds.length} cards highlighted for print/download queue`}
              </p>
            </div>

            {/* Print trigger options */}
            <div className="flex gap-2.5 items-center w-full md:w-auto">
              {(selectedIds.length > 0 || singleSelectedId) && (
                <button
                  onClick={handleA4PrintAction}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-indigo-500/10 cursor-pointer text-white"
                >
                  <Printer size={13.5} />
                  <span>Print A4 Grid (3x3)</span>
                </button>
              )}
            </div>
          </div>

          <div className="w-full max-w-2xl flex flex-col justify-center items-center">
            
            {/* Front & Back Toggler preview buttons & Download options */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-xl border border-slate-850">
                <button
                  onClick={() => setReviewSide("front")}
                  className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-all cursor-pointer ${
                    reviewSide === "front" ? "bg-indigo-600 text-white font-extrabold shadow-md" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Front Design
                </button>
                <button
                  onClick={() => setReviewSide("back")}
                  className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-all cursor-pointer ${
                    reviewSide === "back" ? "bg-indigo-600 text-white font-extrabold shadow-md" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Back Details
                </button>
              </div>

              {activeCard && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadCard("front")}
                    disabled={isSavingGraphic}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:opacity-50 text-white text-[11px] font-black uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    title="Download Front Graphic as PNG"
                  >
                    <Download size={13} />
                    <span>{isSavingGraphic ? "Saving..." : "Download Front"}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadCard("back")}
                    disabled={isSavingGraphic}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:opacity-50 text-white text-[11px] font-black uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    title="Download Back Graphic as PNG"
                  >
                    <Download size={13} />
                    <span>{isSavingGraphic ? "Saving..." : "Download Back"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Beautiful real physical scale representation with nice tilt effect */}
            <div className="flex flex-col items-center justify-center gap-8 py-4">
              {activeCard ? (
                <div className="relative group perspective">
                  {/* Subtle 3D Depth Card Wrapper Layout */}
                  <motion.div 
                    initial={{ rotateY: reviewSide === "front" ? 0 : 180 }}
                    animate={{ rotateY: reviewSide === "front" ? 0 : 180 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-[330px] h-[520px]"
                  >
                    {/* Front side card wrapper content */}
                    <div 
                      className="absolute inset-0 backface-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {renderPremiumIdCard(activeCard, activeDesignTheme)}
                    </div>

                    {/* Back side card wrapper content */}
                    <div 
                      className="absolute inset-0 backface-hidden"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      {renderBackPremiumIdCard(activeCard, activeDesignTheme)}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="w-[330px] h-[520px] rounded-3xl border border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <CreditCard size={48} className="text-slate-750 mb-4 animate-bounce" />
                  <p className="font-bold text-slate-400">Preview Area Static</p>
                  <p className="text-xs text-slate-550 max-w-xs mt-1.5 leading-relaxed">Please select a student, teacher, or staff member from the left side directory catalog list to view their premium identity card.</p>
                </div>
              )}

              {activeCard && (
                <div className="text-slate-450 text-[10px] font-mono leading-relaxed bg-slate-950/20 px-4 py-2 border border-slate-850 rounded-xl">
                  * Live interactive scaling and golden trim abstract borders rendered with precision vector graphics. Click A4 button to batch print up to 9 cards instantly.
                </div>
              )}
            </div>

          </div>

          {/* PRINT CR80 PRO GRID OVERVIEW DIRECT ADVISORY PREVIEW */}
          {(selectedIds.length > 0 || singleSelectedId) && (() => {
            const effectiveIds = selectedIds.length > 0 ? selectedIds : (singleSelectedId ? [singleSelectedId] : []);
            return (
              <div className="w-full max-w-2xl bg-slate-950/30 border border-slate-850 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Grid size={15} />
                  <span className="text-xs font-black uppercase tracking-widest font-sans">A4 Sheet Grid Layout (3x3 Preview)</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-850 justify-items-center">
                  {effectiveIds.slice(0, 9).map(id => {
                    const itemInfo = getCardDetailsById(id, activeTab);
                    return (
                      <div 
                        key={id}
                        className="w-[90px] h-[142px] sm:w-[130px] sm:h-[205px] md:w-[160px] md:h-[252px] rounded-2xl overflow-hidden relative bg-slate-900/40 border border-slate-800 shrink-0"
                      >
                        {/* Real premium ID card scaled to fit the grid item beautifully */}
                        <div className="absolute top-0 left-0 origin-top-left scale-[0.27] sm:scale-[0.39] md:scale-[0.48] w-[330px] h-[520px] pointer-events-none">
                          {renderPremiumIdCard(itemInfo, activeDesignTheme)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Visual slot models for unassigned */}
                  {Array.from({ length: Math.max(0, 9 - effectiveIds.slice(0, 9).length) }).map((_, placeholderIdx) => (
                    <div 
                      key={placeholderIdx} 
                      className="w-[90px] h-[142px] sm:w-[130px] sm:h-[205px] md:w-[160px] md:h-[252px] rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center p-2 shrink-0 select-none text-slate-700"
                    >
                      <Plus className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.5] mb-1 opacity-40 text-slate-600" />
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider opacity-40">Empty Slot</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-semibold text-slate-400">Total Print Queued: <b className="text-slate-200">{effectiveIds.length} cards</b></span>
                  </div>
                  <button
                    onClick={handleA4PrintAction}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-lg text-[10px] font-black uppercase text-white shadow cursor-pointer font-sans"
                  >
                    Generate Print Sheet Now
                  </button>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

      {/* RENDER INVISIBLE PERFECT VECTOR A4 PRINT SHEET (ONLY ACCESSED VIA CMD+P OR SYSTEM PRINT BATCH) */}
      {renderA4PrintContainer()}

      {/* Hidden reference elements for bulletproof high-res html2canvas graphic extraction */}
      {activeCard && (
        <div className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none" aria-hidden="true">
          <div id={`download-target-front-${activeCard.id}`} className="w-[330px] h-[520px]">
            {renderPremiumIdCard(activeCard, activeDesignTheme)}
          </div>
          <div id={`download-target-back-${activeCard.id}`} className="w-[330px] h-[520px]">
            {renderBackPremiumIdCard(activeCard, activeDesignTheme)}
          </div>
        </div>
      )}

    </div>
  );
}
