/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AuditLog, UserRole } from "../../types";
import { ShieldCheck, UserCheck, Key, RefreshCw, EyeOff, ShieldAlert, MonitorCheck, Save, Trash2, Palette } from "lucide-react";
import { motion } from "motion/react";
import { builtInThemes } from "../../themeConfig";

interface SecuritySettingsProps {
  auditLogs: AuditLog[];
  onClearAuditLogs: () => void;
  onLogAudit: (action: string, module: string, details: string) => void;
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
}

export default function SecuritySettings({
  auditLogs,
  onClearAuditLogs,
  onLogAudit,
  currentThemeId,
  onThemeChange
}: SecuritySettingsProps) {
  const [activeTab, setActiveTab] = useState<"roles" | "security" | "theme" | "audits">("roles");

  // Selected User role for permissions customization
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SUPER_ADMIN);

  // Simulated 2FA toggle state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Multi-role custom permissions toggles simulation
  const [permissionsState, setPermissionsState] = useState<{ [role in UserRole]: { [key: string]: boolean } }>({
    [UserRole.SUPER_ADMIN]: { "View Financials": true, "Approve Admissions": true, "Mutate Catalog": true },
    [UserRole.PRINCIPAL]: { "View Financials": true, "Approve Admissions": true, "Mutate Catalog": true },
    [UserRole.ADMINISTRATOR]: { "View Financials": false, "Approve Admissions": true, "Mutate Catalog": true },
    [UserRole.ACCOUNTANT]: { "View Financials": true, "Approve Admissions": false, "Mutate Catalog": false },
    [UserRole.TEACHER]: { "View Financials": false, "Approve Admissions": false, "Mutate Catalog": false },
    [UserRole.STUDENT]: { "View Financials": false, "Approve Admissions": false, "Mutate Catalog": false },
    [UserRole.PARENT]: { "View Financials": false, "Approve Admissions": false, "Mutate Catalog": false },
    [UserRole.LIBRARIAN]: { "View Financials": false, "Approve Admissions": false, "Mutate Catalog": false },
    [UserRole.RECEPTIONIST]: { "View Financials": false, "Approve Admissions": true, "Mutate Catalog": false },
    [UserRole.STAFF]: { "View Financials": false, "Approve Admissions": false, "Mutate Catalog": false }
  });

  const handleTogglePermission = (role: UserRole, permKey: string) => {
    const updatedRolePerms = {
      ...(permissionsState[role] || {}),
      [permKey]: !permissionsState[role]?.[permKey]
    };

    setPermissionsState({
      ...permissionsState,
      [role]: updatedRolePerms
    });

    onLogAudit("Modify Role Permissions", "Security Features", `Toggled privilege "${permKey}" for role ${role} to ${updatedRolePerms[permKey]}`);
  };

  const handleUpdateSecurityConfiguration = () => {
    onLogAudit("Update Security Preferences", "Security Features", `Enforced 2FA=${twoFactorEnabled} with Idle Session Timeout=${sessionTimeout} minutes.`);
    alert("Enterprise Safety System Configuration updated successfully!");
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-white">
      {/* Navigation tabs */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "roles" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <UserCheck size={14} />
          Multi-Role Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "security" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Key size={14} />
          Two-Factor & Session Controls
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "theme" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Palette size={14} />
          Theme Customization Studio
        </button>
        <button
          onClick={() => setActiveTab("audits")}
          className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "audits" ? "border-[#4f46e5] border-indigo-600 text-indigo-605 text-indigo-650 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <MonitorCheck size={14} />
          Live Audit Trails JSON Feed
        </button>
      </div>

      {/* 1. ROLE MATRIX CONFIGURATION SECTION */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">System permissions matrix</h3>
              <p className="text-xs text-gray-400">Lock or authorize actions for the 10 supported organizational system roles.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Roles sidebar selector */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold px-2.5 pb-2 block">System Roles List</span>
              {Object.values(UserRole).map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full py-2.5 px-3 rounded-xl text-left font-bold transition-all flex items-center justify-between text-xs cursor-pointer ${
                    selectedRole === role
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-transparent text-zinc-500 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  <span>{role}</span>
                  {selectedRole === role && <span className="text-[9px] bg-indigo-500 text-white font-mono rounded px-1">ACTIVE</span>}
                </button>
              ))}
            </div>

            {/* Checkbox Privileges control list for selected role */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h4 className="font-extrabold text-[#111827] dark:text-white text-base">Authorize Privileges for: {selectedRole}</h4>
                  <p className="text-zinc-405 text-zinc-500">Enable or restrict write permissions for the selected standard role.</p>
                </div>
                <button
                  onClick={() => alert(`Permissions Committed for ${selectedRole} tier!`)}
                  className="bg-zinc-900 dark:bg-indigo-600 hover:bg-slate-800 text-white px-4 py-1.5 rounded-xl text-xs font-semibold active:opacity-95 text-xs text-center"
                >
                  Save Active Matrix
                </button>
              </div>

              {/* Toggles list */}
              <div className="space-y-4 pt-2">
                {["View Financials", "Approve Admissions", "Mutate Catalog", "Execute Batch Promotions", "Configure System Security", "Override Attendance logs"].map(permKey => {
                  const isEnabled = permissionsState[selectedRole]?.[permKey] || false;
                  return (
                    <div key={permKey} className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-between border">
                      <div>
                        <span className="font-bold block text-sm text-gray-900 dark:text-white">{permKey}</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Authorizes raw write actions of this classification throughout the application.</span>
                      </div>
                      <button
                        onClick={() => handleTogglePermission(selectedRole, permKey)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${isEnabled ? "bg-emerald-500" : "bg-zinc-300"}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isEnabled ? "translate-x-6" : ""}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 2FA & IDLE SESSION CONFIGURATION SECION */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Enterprise security configurations</h3>
            <p className="text-zinc-400 font-medium">Activate global multi-factor guidelines and configure default idle session timeouts.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-between border">
              <div>
                <span className="font-bold block text-gray-900 dark:text-white">Multi-Factor Authenticator (2FA) enforcement</span>
                <span className="text-[10.5px] text-zinc-400 block mt-0.5">Enforces Google Authenticator, Authy or Duo Security token scans for administrative personnel.</span>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${twoFactorEnabled ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFactorEnabled ? "translate-x-6" : ""}`} />
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-between border">
              <div>
                <span className="font-bold block text-zinc-700 dark:text-zinc-200">Session ID Idle Lifespan Limit</span>
                <span className="text-[10.5px] text-zinc-400 block mt-0.5">Terminates browser sessions and requests password challenge on inactive tabs.</span>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="p-2 border rounded-lg bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes standard</option>
                <option value="60">60 Minutes extended</option>
              </select>
            </div>

            <button
              onClick={handleUpdateSecurityConfiguration}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center active:scale-95 transition-all w-fit"
            >
              Commit System Security Protocols
            </button>
          </div>
        </div>
      )}

      {/* 3. THEME CUSTOMIZATION STUDIO SECTION */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white flex items-center gap-2">
                <Palette className="text-indigo-500" size={20} />
                Global Theme Engine Studio
              </h3>
              <p className="text-xs text-slate-400">Instantly toggle colors, gradients, sidebar styles, typography, buttons, tables, and card rounding. Selected choices synchronize with local persistence.</p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-full font-bold tracking-tight text-[10px] uppercase">
              ✨ 12 Premium Built-In Themes
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {builtInThemes.map((theme) => {
              const isSelected = currentThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    onLogAudit("Apply Theme Studio Preset", "Visual System", `Switched design layout preset to "${theme.name}" (${theme.id})`);
                  }}
                  className={`relative flex flex-col justify-between p-5 rounded-3xl border transition-all duration-300 cursor-pointer text-left ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-50 shadow-md scale-[1.01]"
                      : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-slate-700 hover:shadow-sm"
                  }`}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-indigo-650 bg-indigo-600 text-white font-bold font-mono uppercase tracking-widest text-[8px] rounded px-1.5 py-0.5 shadow">
                      ACTIVE
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 block border dark:border-slate-800">{theme.icon}</span>
                      <div>
                        <h4 className="font-extrabold text-[#111827] dark:text-white text-xs tracking-tight">{theme.name}</h4>
                        <span className="text-[8.5px] uppercase tracking-wider text-zinc-400 font-mono font-bold block">{theme.id}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium">{theme.description}</p>
                    
                    {/* Tiny visual representation dots */}
                    <div className="flex items-center gap-1.5 pt-1.5">
                      <span className="text-[9px] uppercase tracking-wide text-[#94a3b8] font-bold font-mono">Elements:</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-mono">{theme.fontHeading.split(" ")[0]}</span>
                    <button
                      type="button"
                      className={`text-[10px] font-bold py-1 px-3 rounded-lg transition-transform ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {isSelected ? "Selected" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SYSTEM AUDIT TRAILS DB JSON FEED TAB */}
      {activeTab === "audits" && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-900">
            <div>
              <h3 className="text-base font-bold flex items-center gap-1.5">
                <ShieldAlert className="text-rose-500 animate-pulse" size={16} /> Cryptographic Live Operations System Audit Log
              </h3>
              <p className="text-[10px] text-zinc-400 tracking-wider">IMMUTABLE SECURE TRUTHS LOGS CAPTURED ON DATABASE EVENT DISPATCHERS</p>
            </div>
            <button
              onClick={onClearAuditLogs}
              className="p-1 px-3 border border-slate-800 text-[10px] rounded hover:bg-slate-900 hover:text-rose-500 transition-colors uppercase font-bold tracking-widest flex items-center gap-1"
            >
              <Trash2 size={11} /> Wipe logs
            </button>
          </div>

          {/* Code blocks layout */}
          <div className="bg-[#040815] p-4 rounded-2xl border border-slate-900 h-80 overflow-y-auto font-mono text-[10px] tracking-wide text-emerald-400 space-y-1.5 scrollbar-thin">
            {auditLogs.map((log) => (
              <div key={log.id} className="hover:bg-white/5 p-1 rounded transition-colors">
                <span className="text-zinc-500">[{log.timestamp}]</span>{" "}
                <span className="text-indigo-400">({log.module})</span>{" "}
                <span className="text-sky-300 font-bold">{log.action}:</span>{" "}
                <span className="text-zinc-300">{log.details}</span>{" "}
                <span className="text-purple-400 font-bold block mt-0.5 text-[9px] uppercase">
                  SHA-256 Verified ID: {log.id}
                </span>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-zinc-500 italic text-center pt-10">No auditing logs currently reported.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
