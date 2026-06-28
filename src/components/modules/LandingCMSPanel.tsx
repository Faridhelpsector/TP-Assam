/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye,
  X,
  PlusCircle,
  FileEdit
} from "lucide-react";
import { LandingTopper, LandingFaculty, LandingCurriculum, LandingFAQ, LandingTexts } from "../../types";

interface LandingCMSPanelProps {
  toppers: LandingTopper[];
  setToppers: React.Dispatch<React.SetStateAction<LandingTopper[]>>;
  faculty: LandingFaculty[];
  setFaculty: React.Dispatch<React.SetStateAction<LandingFaculty[]>>;
  curriculums: LandingCurriculum[];
  setCurriculums: React.Dispatch<React.SetStateAction<LandingCurriculum[]>>;
  faqs: LandingFAQ[];
  setFAQs: React.Dispatch<React.SetStateAction<LandingFAQ[]>>;
  texts: LandingTexts;
  setTexts: React.Dispatch<React.SetStateAction<LandingTexts>>;
  onLogAudit: (action: string, module: string, details: string) => void;
  isDarkMode: boolean;
}

type CMSCategory = "toppers" | "faculty" | "curriculum" | "faqs" | "texts";

const PRESET_AVATARS = [
  { label: "Male Pupil 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop" },
  { label: "Female Pupil 1", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&h=180&fit=crop" },
  { label: "Female Pupil 2", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&h=180&fit=crop" },
  { label: "Female Scholar", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&h=180&fit=crop" },
  { label: "Male Scholar 1", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop" },
  { label: "Female Teacher 1", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&h=180&fit=crop" },
  { label: "Male Teacher 1", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=180&h=180&fit=crop" },
  { label: "Male Teacher 2", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&h=180&fit=crop" }
];

export default function LandingCMSPanel({
  toppers,
  setToppers,
  faculty,
  setFaculty,
  curriculums,
  setCurriculums,
  faqs,
  setFAQs,
  texts,
  setTexts,
  onLogAudit,
  isDarkMode
}: LandingCMSPanelProps) {
  const [activeCategory, setActiveCategory] = useState<CMSCategory>("toppers");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for adding/editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Shared state fields
  const [topperForm, setTopperForm] = useState<Partial<LandingTopper>>({
    name: "",
    className: "",
    percentage: "",
    avatar: "🎓",
    img: ""
  });

  const [facultyForm, setFacultyForm] = useState<Partial<LandingFaculty>>({
    name: "",
    title: "",
    dept: "",
    avatar: "🏫",
    img: ""
  });

  const [curriculumForm, setCurriculumForm] = useState<Partial<LandingCurriculum>>({
    category: "",
    title: "",
    description: ""
  });

  const [faqForm, setFaqForm] = useState<Partial<LandingFAQ>>({
    question: "",
    answer: ""
  });

  const [localTexts, setLocalTexts] = useState<LandingTexts>(texts);

  React.useEffect(() => {
    if (texts) {
      setLocalTexts(texts);
    }
  }, [texts]);

  const handleUpdateLocalText = (key: keyof LandingTexts, value: string) => {
    setLocalTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePageTexts = (e: React.FormEvent) => {
    e.preventDefault();
    setTexts(localTexts);
    onLogAudit("Update Dynamic Texts", "Landing CMS", "Categorically updated static headers, badges and titles copy of landing pages");
    triggerSuccess("Dynamic landing page copy texts saved successfully!");
  };

  const handleResetTexts = () => {
    if (window.confirm("Are you sure you want to revert all page titles and descriptions to defaults?")) {
      const defaults: LandingTexts = {
        heroBadge: "Admin Terminal System Connected",
        heroTitle: "Typing Desk Assam",
        stat1Num: "1,500+",
        stat1Label: "Enrolled Pupils",
        stat2Num: "98.5%",
        stat2Label: "Passing Rate",
        stat3Num: "12+",
        stat3Label: "Smart Modules",

        overviewTitle: "Institution Profile Overview",
        overviewDesc: "EduCore ERP System coordinates dynamic pupil details, hostel accommodation listings, academic fleet tracking, exam promotions, and payroll ledger entries with cloud integrity constraints.",

        card1Title: "Active Teacher Allocation",
        card1Body: "Track daily schedules, subject domains, and periods.",
        card2Title: "Consolidated Fee Audit",
        card2Body: "Quick invoicing receipts, payment ledgers and balance alerts.",
        card3Title: "Smart Biometric Scanning",
        card3Body: "Integrated facial scanner modules for instant pupil entry verification.",
        card4Title: "Live Transport Tracking",
        card4Body: "Accurate bus coordinate monitors with map system overlays.",

        admissionBadge: "Registration for Academic Session 2026-27 is LIVE",
        admissionDesc: "Secure an expedited seat inside the primary digital computer labs. Application gates are monitored with direct ledger accountability.",
        step1Title: "Step 1: Document Filing",
        step1Body: "File online application, upload marksheet credentials, and pay the core registration token.",
        step2Title: "Step 2: Biometric Interview",
        step2Body: "Attend pupil-parent interview where biometric face points are initialized into our server archives.",

        feeSubtitle: "Calculate Estimated Academic Fee",

        contact1Title: "Admission Admissions Hotline",
        contact1Phone: "+91 9123-567-891",
        contact1Availability: "Available 09:00 AM - 04:00 PM IST",
        contact2Title: "Accounts & Tuition Billing",
        contact2Email: "billing.ledger@educore.edu.in",
        contact2Availability: "Response time: within 24 business hours",

        principalName: "Dr. Joydeep Baruah",
        principalTitle: "Principal, EduCore Academy",
        principalMessage: "Welcome to our advanced regional knowledge portal. EduCore balances classical state-board benchmarks with dynamic ICT tools, empowering minds for modern horizons. Explore our integrated ERP modules to monitor academic progress with absolute transparency.",
        principalImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=180&h=180&fit=crop",
        supportTitle: "Campus IT Support & Helpdesk",
        supportDesc: "Connect directly with our administration support block for immediate assistance regarding student registrations, fee ledgers, exam records, or transport tracking routes.",
        supportPhone: "+91 361-234-5678",
        supportEmail: "helpdesk@educoreacademy.edu.in"
      };
      setLocalTexts(defaults);
      setTexts(defaults);
      onLogAudit("Revert Dynamic Texts Defaults", "Landing CMS", "Reverted all customized landing page copy to ERP default presets");
      triggerSuccess("Reverted static text configuration elements to system defaults.");
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const openAddForm = () => {
    setEditingId(null);
    setTopperForm({ name: "", className: "", percentage: "", avatar: "🎓", img: PRESET_AVATARS[0].url });
    setFacultyForm({ name: "", title: "", dept: "", avatar: "👨‍🏫", img: PRESET_AVATARS[PRESET_AVATARS.length - 1].url });
    setCurriculumForm({ category: "", title: "", description: "" });
    setFaqForm({ question: "", answer: "" });
    setIsFormOpen(true);
  };

  const handleEditTopper = (item: LandingTopper) => {
    setEditingId(item.id);
    setTopperForm({
      name: item.name,
      className: item.className || (item as any).class,
      percentage: item.percentage,
      avatar: item.avatar,
      img: item.img
    });
    setIsFormOpen(true);
  };

  const handleEditFaculty = (item: LandingFaculty) => {
    setEditingId(item.id);
    setFacultyForm({
      name: item.name,
      title: item.title,
      dept: item.dept,
      avatar: item.avatar,
      img: item.img
    });
    setIsFormOpen(true);
  };

  const handleEditCurriculum = (item: LandingCurriculum) => {
    setEditingId(item.id);
    setCurriculumForm({
      category: item.category,
      title: item.title,
      description: item.description
    });
    setIsFormOpen(true);
  };

  const handleEditFAQ = (item: LandingFAQ) => {
    setEditingId(item.id);
    setFaqForm({
      question: item.question,
      answer: item.answer
    });
    setIsFormOpen(true);
  };

  // Safe deletion triggers
  const handleDeleteItem = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this landing page item?")) return;

    if (activeCategory === "toppers") {
      const deleted = toppers.find(t => t.id === id);
      setToppers(prev => prev.filter(t => t.id !== id));
      onLogAudit("Delete Topper", "Landing CMS", `Deleted topper ${deleted?.name || id} from Landing Page`);
      triggerSuccess("Topper removed successfully.");
    } else if (activeCategory === "faculty") {
      const deleted = faculty.find(f => f.id === id);
      setFaculty(prev => prev.filter(f => f.id !== id));
      onLogAudit("Delete Faculty", "Landing CMS", `Deleted faculty ${deleted?.name || id} from Landing Page`);
      triggerSuccess("Faculty coordinator removed successfully.");
    } else if (activeCategory === "curriculum") {
      const deleted = curriculums.find(c => c.id === id);
      setCurriculums(prev => prev.filter(c => c.id !== id));
      onLogAudit("Delete Curriculum", "Landing CMS", `Deleted curriculum profile '${deleted?.title || id}'`);
      triggerSuccess("Curriculum course removed successfully.");
    } else if (activeCategory === "faqs") {
      const deleted = faqs.find(f => f.id === id);
      setFAQs(prev => prev.filter(f => f.id !== id));
      onLogAudit("Delete FAQ", "Landing CMS", `Deleted FAQ question '${deleted?.question || id}'`);
      triggerSuccess("FAQ question record removed successfully.");
    }
  };

  // Form submission handler
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeCategory === "toppers") {
      if (!topperForm.name || !topperForm.className || !topperForm.percentage) {
        alert("Please key in Name, Grade/Class and Percentage margins.");
        return;
      }
      if (editingId) {
        setToppers(prev => prev.map(t => t.id === editingId ? {
          id: editingId,
          name: topperForm.name!,
          className: topperForm.className!,
          percentage: topperForm.percentage!,
          avatar: topperForm.avatar || "🎓",
          img: topperForm.img || ""
        } : t));
        onLogAudit("Update Topper", "Landing CMS", `Updated topper info of ${topperForm.name}`);
        triggerSuccess("Topper records updated successfully!");
      } else {
        const newId = `top-${Date.now()}`;
        setToppers(prev => [...prev, {
          id: newId,
          name: topperForm.name!,
          className: topperForm.className!,
          percentage: topperForm.percentage!,
          avatar: topperForm.avatar || "🎓",
          img: topperForm.img || PRESET_AVATARS[0].url
        }]);
        onLogAudit("Add Topper", "Landing CMS", `Added new study topper ${topperForm.name} to Landing Hall of Fame`);
        triggerSuccess("New topper added successfully!");
      }
    } 
    
    else if (activeCategory === "faculty") {
      if (!facultyForm.name || !facultyForm.title || !facultyForm.dept) {
        alert("Please provide Faculty Name, Designation, and Department Qualifications.");
        return;
      }
      if (editingId) {
        setFaculty(prev => prev.map(f => f.id === editingId ? {
          id: editingId,
          name: facultyForm.name!,
          title: facultyForm.title!,
          dept: facultyForm.dept!,
          avatar: facultyForm.avatar || "👨‍🏫",
          img: facultyForm.img || ""
        } : f));
        onLogAudit("Update Faculty", "Landing CMS", `Updated teacher faculty details of Dr/Prof ${facultyForm.name}`);
        triggerSuccess("Faculty information details updated!");
      } else {
        const newId = `fac-${Date.now()}`;
        setFaculty(prev => [...prev, {
          id: newId,
          name: facultyForm.name!,
          title: facultyForm.title!,
          dept: facultyForm.dept!,
          avatar: facultyForm.avatar || "👨‍🏫",
          img: facultyForm.img || PRESET_AVATARS[PRESET_AVATARS.length - 1].url
        }]);
        onLogAudit("Add Faculty", "Landing CMS", `Added new faculty coordinator ${facultyForm.name} to landing page`);
        triggerSuccess("New faculty coordinator uploaded successfully!");
      }
    } 
    
    else if (activeCategory === "curriculum") {
      if (!curriculumForm.category || !curriculumForm.title || !curriculumForm.description) {
        alert("Please complete the Category, Course Title, and Syllabus Details description.");
        return;
      }
      if (editingId) {
        setCurriculums(prev => prev.map(c => c.id === editingId ? {
          id: editingId,
          category: curriculumForm.category!,
          title: curriculumForm.title!,
          description: curriculumForm.description!
        } : c));
        onLogAudit("Update Curriculum", "Landing CMS", `Updated curriculum specifications for '${curriculumForm.title}'`);
        triggerSuccess("Syllabus program updated!");
      } else {
        const newId = `curr-${Date.now()}`;
        setCurriculums(prev => [...prev, {
          id: newId,
          category: curriculumForm.category!,
          title: curriculumForm.title!,
          description: curriculumForm.description!
        }]);
        onLogAudit("Add Curriculum", "Landing CMS", `Created new curriculum page listing for '${curriculumForm.title}'`);
        triggerSuccess("New curriculum record published!");
      }
    } 
    
    else if (activeCategory === "faqs") {
      if (!faqForm.question || !faqForm.answer) {
        alert("Please key in both question prompt and answer response guidelines.");
        return;
      }
      if (editingId) {
        setFAQs(prev => prev.map(f => f.id === editingId ? {
          id: editingId,
          question: faqForm.question!,
          answer: faqForm.answer!
        } : f));
        onLogAudit("Update FAQ", "Landing CMS", `Modified FAQ details and guidelines for question '${faqForm.question}'`);
        triggerSuccess("FAQ record updated successfully!");
      } else {
        const newId = `faq-${Date.now()}`;
        setFAQs(prev => [...prev, {
          id: newId,
          question: faqForm.question!,
          answer: faqForm.answer!
        }]);
        onLogAudit("Add FAQ", "Landing CMS", `Admitted new guidance FAQ to Landing Screen: ${faqForm.question}`);
        triggerSuccess("FAQ guidance query registered!");
      }
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with branding context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              ⚡ LIVE Dynamic CMS Portal
            </span>
          </div>
          <h2 className="text-2xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">
            Landing Page Manager
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Categorically add, upload, edit and delete contents visible dynamically in the public school landing base screen.
          </p>
        </div>

        {activeCategory !== "texts" && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Add New Entry
          </button>
        )}
      </div>

      {/* Alert notifier */}
      {successMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-bold leading-normal animate-fade-in animate-pulse">
          <CheckCircle size={15} className="shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Categories Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border dark:border-slate-900">
        {[
          { id: "toppers", label: "Hall of Fame (Toppers)", icon: Award, count: toppers.length },
          { id: "faculty", label: "Faculty Coordinators", icon: Users, count: faculty.length },
          { id: "curriculum", label: "Academic Profiles", icon: BookOpen, count: curriculums.length },
          { id: "faqs", label: "Quick FAQs", icon: HelpCircle, count: faqs.length },
          { id: "texts", label: "Page Copy & Section Texts", icon: FileEdit, count: 18 }
        ].map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as CMSCategory);
                setIsFormOpen(false);
                setEditingId(null);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-xs font-extrabold transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-850"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Icon size={14} className={isActive ? "text-indigo-600 dark:text-cyan-400" : "text-slate-400"} />
              <span>{cat.label}</span>
              <span className="bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-[9px] font-mono text-slate-500 block ml-1">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Form Editor Drawer / Box */}
      {isFormOpen && (
        <div className="bg-indigo-50/50 dark:bg-slate-950 p-6 rounded-3xl border border-indigo-200/50 dark:border-slate-850/80 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-3 border-indigo-150/40 dark:border-slate-900">
            <h3 className="text-sm font-black text-indigo-950 dark:text-white flex items-center gap-1.5">
              <FileEdit size={14} className="text-indigo-600" />
              {editingId ? "Edit Existing Entry parameters" : "Create New Dynamic Entry"}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 cursor-pointer bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            
            {/* INLINE CATEGORY A: TOPPERS */}
            {activeCategory === "toppers" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Topper Name</label>
                  <input
                    type="text"
                    value={topperForm.name}
                    onChange={(e) => setTopperForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Grade / Class Name</label>
                  <input
                    type="text"
                    value={topperForm.className}
                    onChange={(e) => setTopperForm(prev => ({ ...prev, className: e.target.value }))}
                    placeholder="e.g. Class XII-A"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Percentage / CGPA</label>
                  <input
                    type="text"
                    value={topperForm.percentage}
                    onChange={(e) => setTopperForm(prev => ({ ...prev, percentage: e.target.value }))}
                    placeholder="e.g. 98.8%"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Emoji avatar</label>
                  <input
                    type="text"
                    value={topperForm.avatar}
                    onChange={(e) => setTopperForm(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="e.g. 👨‍🎓"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-880 text-slate-800 dark:text-white font-bold font-mono text-center"
                  />
                </div>
                <div className="md:col-span-12">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Avatar Photo URL (Presets or Custom)</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={topperForm.img}
                      onChange={(e) => setTopperForm(prev => ({ ...prev, img: e.target.value }))}
                      placeholder="Https link to portrait picture..."
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] text-slate-450 mr-1 block">Quick presets:</span>
                      {PRESET_AVATARS.slice(0, 5).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTopperForm(prev => ({ ...prev, img: preset.url }))}
                          className={`text-[9.5px] font-extrabold px-2 py-1 rounded-lg border cursor-pointer transition-all ${
                            topperForm.img === preset.url
                              ? "bg-indigo-650 text-white border-indigo-600 bg-indigo-600"
                              : "bg-white dark:bg-slate-900 text-slate-505 border-slate-200 dark:border-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INLINE CATEGORY B: FACULTY */}
            {activeCategory === "faculty" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Dr. Aditi Mukherjee"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Designation Label</label>
                  <input
                    type="text"
                    value={facultyForm.title}
                    onChange={(e) => setFacultyForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Science Head / senior lecturer"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Department / Degrees</label>
                  <input
                    type="text"
                    value={facultyForm.dept}
                    onChange={(e) => setFacultyForm(prev => ({ ...prev, dept: e.target.value }))}
                    placeholder="e.g. Ph.D. Physics"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Emoji</label>
                  <input
                    type="text"
                    value={facultyForm.avatar}
                    onChange={(e) => setFacultyForm(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="e.g. 👩‍🏫"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-880 text-slate-800 dark:text-white font-bold font-mono text-center"
                  />
                </div>
                <div className="md:col-span-12">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Avatar URL (Stock Image presets)</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={facultyForm.img}
                      onChange={(e) => setFacultyForm(prev => ({ ...prev, img: e.target.value }))}
                      placeholder="Https link to picture..."
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] text-slate-450 mr-1 block">Quick presets:</span>
                      {PRESET_AVATARS.slice(4).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFacultyForm(prev => ({ ...prev, img: preset.url }))}
                          className={`text-[9.5px] font-extrabold px-2 py-1 rounded-lg border cursor-pointer transition-all ${
                            facultyForm.img === preset.url
                              ? "bg-indigo-650 text-white border-indigo-600 bg-indigo-600"
                              : "bg-white dark:bg-slate-900 text-slate-505 border-slate-200 dark:border-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INLINE CATEGORY C: CURRICULUM */}
            {activeCategory === "curriculum" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Syllabus Segment Group</label>
                  <input
                    type="text"
                    value={curriculumForm.category}
                    onChange={(e) => setCurriculumForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Science Core or Technology"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-8">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Syllabus Title</label>
                  <input
                    type="text"
                    value={curriculumForm.title}
                    onChange={(e) => setCurriculumForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Physics, Chem & Advanced Calculus"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-12">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Description summary details</label>
                  <textarea
                    rows={2}
                    value={curriculumForm.description}
                    onChange={(e) => setCurriculumForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief outline of syllabus chapters, labs, requirements..."
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* INLINE CATEGORY D: FAQS */}
            {activeCategory === "faqs" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-12">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="e.g. What is the Master administrative login code?"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div className="md:col-span-12">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Guidelines Answer Response</label>
                  <textarea
                    rows={2}
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Detailed response guidelines for parents/evaluators..."
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2 border-t border-indigo-150/40 dark:border-slate-900">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow"
              >
                {editingId ? "Save Modifications" : "Publish Live Entry"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 4. Categorical lists viewport display */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-3xl p-5 space-y-4">
        
        {activeCategory === "toppers" && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Hall of Fame lists</h4>
            {toppers.length === 0 ? (
              <div className="text-center py-10 text-slate-450 text-xs">No toppers configured yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toppers.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-900 border overflow-hidden flex items-center justify-center relative select-none">
                        <span className="absolute text-lg font-bold">{item.avatar || "🎓"}</span>
                        {item.img && (
                          <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover rounded-full z-10" />
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{item.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {item.className || (item as any).class} • <span className="text-amber-500 font-bold">{item.percentage}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEditTopper(item)}
                        className="p-1 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-500 rounded-lg cursor-pointer text-[10px] font-black uppercase flex items-center gap-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 cursor-pointer bg-red-10 w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50/55 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
                        title="Delete Topper"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeCategory === "faculty" && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Our Faculty listed teachers</h4>
            {faculty.length === 0 ? (
              <div className="text-center py-10 text-slate-450 text-xs">No faculty listed.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {faculty.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 flex items-center justify-between gap-4 col-span-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-900 border overflow-hidden flex items-center justify-center relative select-none">
                        <span className="absolute text-lg font-bold">{item.avatar || "👩‍🏫"}</span>
                        {item.img && (
                          <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover rounded-full z-10" />
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{item.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {item.title} • <span className="text-emerald-500 font-bold">{item.dept}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEditFaculty(item)}
                        className="p-1 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-500 rounded-lg cursor-pointer text-[10px] font-black uppercase flex items-center gap-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 cursor-pointer bg-red-10 w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50/55 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
                        title="Delete Faculty Coordinate"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeCategory === "curriculum" && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Academic Curriculum profiles</h4>
            {curriculums.length === 0 ? (
              <div className="text-center py-10 text-slate-450 text-xs">No curriculum profiles.</div>
            ) : (
              <div className="space-y-2">
                {curriculums.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="p-0.5 px-2 bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 font-black rounded text-[9px] uppercase font-mono">
                          {item.category}
                        </span>
                        <h5 className="text-xs font-black text-slate-905 text-slate-900 dark:text-white">{item.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center">
                      <button
                        onClick={() => handleEditCurriculum(item)}
                        className="p-1 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-500 rounded-lg cursor-pointer text-[10px] font-black uppercase flex items-center gap-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 cursor-pointer bg-red-10 w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50/55 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
                        title="Delete Course Syllabus"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeCategory === "faqs" && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Guidance Assistance FAQs list</h4>
            {faqs.length === 0 ? (
              <div className="text-center py-10 text-slate-450 text-xs font-bold text-zinc-400">No FAQ queries recorded.</div>
            ) : (
              <div className="space-y-2">
                {faqs.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="text-xs font-black text-slate-900 dark:text-white">Q: {item.question}</div>
                      <div className="text-[11px] text-slate-500 leading-normal">A: {item.answer}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center">
                      <button
                        onClick={() => handleEditFAQ(item)}
                        className="p-1 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-500 rounded-lg cursor-pointer text-[10px] font-black uppercase flex items-center gap-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 cursor-pointer bg-red-10 w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50/55 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
                        title="Delete FAQ record"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeCategory === "texts" && (
          <form onSubmit={handleSavePageTexts} className="space-y-8">
            
            {/* Introductory instructions */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-950 border border-indigo-200/50 dark:border-slate-850 flex gap-3 text-xs leading-relaxed text-indigo-950 dark:text-slate-300">
              <span className="text-xl">✍️</span>
              <div>
                <span className="font-extrabold block text-indigo-900 dark:text-cyan-400">Categorical Landing Page Copy Copywriter</span>
                Specify the custom text elements, section headers, badges and contact hotlines displayed in the public workspace screen. Click the save button below to update immediately.
              </div>
            </div>

            {/* Sub-Category A: Hero Area & Metrics */}
            <div className="space-y-4 border-b pb-5 border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Category A: Hero Banner & Active Statistics</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Hero Small Badge Label</label>
                  <input
                    type="text"
                    value={localTexts?.heroBadge}
                    onChange={(e) => handleUpdateLocalText("heroBadge", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Hero Main Banner Name</label>
                  <input
                    type="text"
                    value={localTexts?.heroTitle}
                    onChange={(e) => handleUpdateLocalText("heroTitle", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* 3 stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 space-y-2">
                  <span className="text-[10px] uppercase font-black text-slate-400">Stat 1 (Pupils)</span>
                  <input
                    type="text"
                    value={localTexts?.stat1Num}
                    onChange={(e) => handleUpdateLocalText("stat1Num", e.target.value)}
                    placeholder="Value e.g. 1,500+"
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-black text-emerald-600 font-mono"
                  />
                  <input
                    type="text"
                    value={localTexts?.stat1Label}
                    onChange={(e) => handleUpdateLocalText("stat1Label", e.target.value)}
                    placeholder="Label e.g. Enrolled Pupils"
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-820 text-slate-705 text-slate-500 font-bold"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 space-y-2">
                  <span className="text-[10px] uppercase font-black text-slate-400">Stat 2 (Passing)</span>
                  <input
                    type="text"
                    value={localTexts?.stat2Num}
                    onChange={(e) => handleUpdateLocalText("stat2Num", e.target.value)}
                    placeholder="Value e.g. 98.5%"
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-black text-cyan-600 font-mono"
                  />
                  <input
                    type="text"
                    value={localTexts?.stat2Label}
                    onChange={(e) => handleUpdateLocalText("stat2Label", e.target.value)}
                    placeholder="Label e.g. Passing Rate"
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-820 text-slate-705 text-slate-500 font-bold"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 space-y-2">
                  <span className="text-[10px] uppercase font-black text-slate-400">Stat 3 (Modules)</span>
                  <input
                    type="text"
                    value={localTexts?.stat3Num}
                    onChange={(e) => handleUpdateLocalText("stat3Num", e.target.value)}
                    placeholder="Value e.g. 12+"
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-black text-indigo-600 font-mono"
                  />
                  <input
                    type="text"
                    value={localTexts?.stat3Label}
                    onChange={(e) => handleUpdateLocalText("stat3Label", e.target.value)}
                    placeholder="Label e.g. Smart Modules"
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-820 text-slate-705 text-slate-500 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Category B: Overview Profile & Cards */}
            <div className="space-y-4 border-b pb-5 border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Category B: Institution Overview & Promo Elements</h4>
              
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Institution Overview Section Header</label>
                  <input
                    type="text"
                    value={localTexts?.overviewTitle}
                    onChange={(e) => handleUpdateLocalText("overviewTitle", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Institution Profile description paragraph</label>
                  <textarea
                    rows={3}
                    value={localTexts?.overviewDesc}
                    onChange={(e) => handleUpdateLocalText("overviewDesc", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white leading-relaxed"
                  />
                </div>
              </div>

              {/* 4 Cards title and body edit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-2">
                  <span className="text-[10px] uppercase font-black text-amber-500">Allocation Module Card Information</span>
                  <input
                    type="text"
                    value={localTexts?.card1Title}
                    onChange={(e) => handleUpdateLocalText("card1Title", e.target.value)}
                    placeholder="Card title..."
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold"
                  />
                  <input
                    type="text"
                    value={localTexts?.card1Body}
                    onChange={(e) => handleUpdateLocalText("card1Body", e.target.value)}
                    placeholder="Card body text..."
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-480"
                  />
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-2">
                  <span className="text-[10px] uppercase font-black text-teal-500">Fee Audit Module Card Information</span>
                  <input
                    type="text"
                    value={localTexts?.card2Title}
                    onChange={(e) => handleUpdateLocalText("card2Title", e.target.value)}
                    placeholder="Card title..."
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold"
                  />
                  <input
                    type="text"
                    value={localTexts?.card2Body}
                    onChange={(e) => handleUpdateLocalText("card2Body", e.target.value)}
                    placeholder="Card body text..."
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-480"
                  />
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-2">
                  <span className="text-[10px] uppercase font-black text-indigo-500">Biometric Scan Module Card Information</span>
                  <input
                    type="text"
                    value={localTexts?.card3Title}
                    onChange={(e) => handleUpdateLocalText("card3Title", e.target.value)}
                    placeholder="Card title..."
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold"
                  />
                  <input
                    type="text"
                    value={localTexts?.card3Body}
                    onChange={(e) => handleUpdateLocalText("card3Body", e.target.value)}
                    placeholder="Card body text..."
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-480"
                  />
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-2">
                  <span className="text-[10px] uppercase font-black text-rose-500">Fleet Tracking Module Card Information</span>
                  <input
                    type="text"
                    value={localTexts?.card4Title}
                    onChange={(e) => handleUpdateLocalText("card4Title", e.target.value)}
                    placeholder="Card title..."
                    className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold"
                  />
                  <input
                    type="text"
                    value={localTexts?.card4Body}
                    onChange={(e) => handleUpdateLocalText("card4Body", e.target.value)}
                    placeholder="Card body text..."
                    className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-480"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Category C: Admissions Process Steps */}
            <div className="space-y-4 border-b pb-5 border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Category C: Admission Desk Registration Steps</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Admission live alert badge text</label>
                    <input
                      type="text"
                      value={localTexts?.admissionBadge}
                      onChange={(e) => handleUpdateLocalText("admissionBadge", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Admissions overview details</label>
                    <input
                      type="text"
                      value={localTexts?.admissionDesc}
                      onChange={(e) => handleUpdateLocalText("admissionDesc", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 space-y-2">
                    <span className="text-[10px] uppercase font-black text-slate-400 font-mono">Admission Step 1 Info</span>
                    <input
                      type="text"
                      value={localTexts?.step1Title}
                      onChange={(e) => handleUpdateLocalText("step1Title", e.target.value)}
                      placeholder="Step Title"
                      className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={localTexts?.step1Body}
                      onChange={(e) => handleUpdateLocalText("step1Body", e.target.value)}
                      placeholder="Step Description Details..."
                      className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-550"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 space-y-2">
                    <span className="text-[10px] uppercase font-black text-slate-400 font-mono">Admission Step 2 Info</span>
                    <input
                      type="text"
                      value={localTexts?.step2Title}
                      onChange={(e) => handleUpdateLocalText("step2Title", e.target.value)}
                      placeholder="Step Title"
                      className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={localTexts?.step2Body}
                      onChange={(e) => handleUpdateLocalText("step2Body", e.target.value)}
                      placeholder="Step Description Details..."
                      className="w-full text-[10.5px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-550"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category D: Calculator & hotline contacts */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Category D: Fee Estimations subtitle & Support hotline directories</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fee Estimator Calculation Card Subtitle</label>
                  <input
                    type="text"
                    value={localTexts?.feeSubtitle}
                    onChange={(e) => handleUpdateLocalText("feeSubtitle", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-2">
                    <span className="text-[10px] uppercase font-black text-indigo-500">Campus Contact Hotline 1</span>
                    <input
                      type="text"
                      value={localTexts?.contact1Title}
                      onChange={(e) => handleUpdateLocalText("contact1Title", e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold"
                    />
                    <input
                      type="text"
                      value={localTexts?.contact1Phone}
                      onChange={(e) => handleUpdateLocalText("contact1Phone", e.target.value)}
                      className="w-full text-[11px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-mono text-indigo-600 font-bold"
                    />
                    <input
                      type="text"
                      value={localTexts?.contact1Availability}
                      onChange={(e) => handleUpdateLocalText("contact1Availability", e.target.value)}
                      className="w-full text-[10px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-450"
                    />
                  </div>

                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-2">
                    <span className="text-[10px] uppercase font-black text-emerald-500">Campus Contact Hotline 2</span>
                    <input
                      type="text"
                      value={localTexts?.contact2Title}
                      onChange={(e) => handleUpdateLocalText("contact2Title", e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold"
                    />
                    <input
                      type="text"
                      value={localTexts?.contact2Email}
                      onChange={(e) => handleUpdateLocalText("contact2Email", e.target.value)}
                      className="w-full text-[11px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-mono text-emerald-600 font-bold"
                    />
                    <input
                      type="text"
                      value={localTexts?.contact2Availability}
                      onChange={(e) => handleUpdateLocalText("contact2Availability", e.target.value)}
                      className="w-full text-[10px] p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-450"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category E: Principal Message & Support Desk */}
            <div className="space-y-4 border-t pt-5 border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Category E: Principal's Greeting & Helpdesk Section</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Principal Message Edit Block */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-3">
                  <span className="text-[10px] uppercase font-black text-indigo-500 block">Principal's Office Card Configuration</span>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Principal Name</label>
                    <input
                      type="text"
                      value={localTexts?.principalName || ""}
                      onChange={(e) => handleUpdateLocalText("principalName", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Principal Title</label>
                    <input
                      type="text"
                      value={localTexts?.principalTitle || ""}
                      onChange={(e) => handleUpdateLocalText("principalTitle", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Principal Welcome Message</label>
                    <textarea
                      rows={3}
                      value={localTexts?.principalMessage || ""}
                      onChange={(e) => handleUpdateLocalText("principalMessage", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Principal Photo URL</label>
                    <input
                      type="text"
                      value={localTexts?.principalImg || ""}
                      onChange={(e) => handleUpdateLocalText("principalImg", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Support Desk Edit Block */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-2xl border dark:border-slate-850 space-y-3">
                  <span className="text-[10px] uppercase font-black text-rose-500 block">Support Desk Configuration</span>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Desk Title</label>
                    <input
                      type="text"
                      value={localTexts?.supportTitle || ""}
                      onChange={(e) => handleUpdateLocalText("supportTitle", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Desk Description</label>
                    <textarea
                      rows={3}
                      value={localTexts?.supportDesc || ""}
                      onChange={(e) => handleUpdateLocalText("supportDesc", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Phone</label>
                    <input
                      type="text"
                      value={localTexts?.supportPhone || ""}
                      onChange={(e) => handleUpdateLocalText("supportPhone", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Email</label>
                    <input
                      type="text"
                      value={localTexts?.supportEmail || ""}
                      onChange={(e) => handleUpdateLocalText("supportEmail", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Texts Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetTexts}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-350 dark:border-slate-850 hover:bg-slate-150 dark:hover:bg-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-300 transition-all cursor-pointer"
              >
                Reset Default Presets
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-605 bg-indigo-600 hover:bg-indigo-700 font-extrabold text-white text-xs rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
              >
                Save Category Modifications
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
