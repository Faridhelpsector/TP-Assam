/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ThemeDefinition } from "../themeConfig";
import { Lock, Unlock, Fingerprint, ShieldAlert, Cpu, Calendar, Clock, RefreshCw, AlertCircle, KeyRound, ArrowRight } from "lucide-react";

interface LockScreenProps {
  currentTheme: ThemeDefinition;
  isDarkMode: boolean;
  onUnlock: () => void;
  onLogAudit: (action: string, module: string, details: string) => void;
}

export default function LockScreen({
  currentTheme,
  isDarkMode,
  onUnlock,
  onLogAudit
}: LockScreenProps) {
  const [pinValue, setPinValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBypassing, setIsBypassing] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

  // Sound system feedback
  const playSfx = (type: "click" | "success" | "error" | "init") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.06);
      } else if (type === "success") {
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.07);
          gain.gain.setValueAtTime(0.05, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.5);
        });
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.4);
      } else if (type === "init") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.25);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.35);
      }
    } catch {
      // Ignored if browser prevents audio contexts
    }
  };

  useEffect(() => {
    playSfx("init");
    
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDateStr(now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      onLogAudit("Terminal Unlocked", "Session Authorization", "Administrative session authorized via secure PIN token matching");
    } else {
      playSfx("error");
      setErrorMessage("Access Denied: Invalid Administrative security PIN entered.");
      setPinValue("");
    }
  };

  // Simulate automatic face biometric verification bypass
  const handleBiometricBypass = () => {
    playSfx("click");
    setIsBypassing(true);
    setErrorMessage(null);

    setTimeout(() => {
      playSfx("success");
      setIsBypassing(false);
      onUnlock();
      onLogAudit("Terminal Unlocked", "Biometric Bypass", "Identified face structure matching Master Admin Office. Authorization approved.");
    }, 1800);
  };

  // Submit on 4 characters automatically
  useEffect(() => {
    if (pinValue.length === 4) {
      handleSubmitPin();
    }
  }, [pinValue]);

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between ${currentTheme.mainBg} p-6 relative overflow-hidden transition-colors duration-300`}>
      
      {/* Decorative futuristic glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[45%] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2.5 rounded-2xl bg-indigo-600/10 text-indigo-500 dark:bg-indigo-950/40 font-bold shadow-sm">
            {currentTheme.bannerPattern}
          </span>
          <div className="text-left">
            <h1 className={`font-black text-slate-900 dark:text-white text-base tracking-tight`}>
              EduCore Pro
            </h1>
            <p className="text-[9.5px] uppercase tracking-widest text-[#94a3b8] font-bold font-mono">
              Administrative Suite
            </p>
          </div>
        </div>

        <div className="bg-slate-500/10 text-slate-500 dark:text-zinc-400 px-3 py-1 rounded-full font-mono font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 border dark:border-slate-800">
          <Cpu size={12} className="animate-spin text-cyan-400" /> Secure Terminal Session Blocked
        </div>
      </div>

      {/* CENTER WORKSPACE SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 z-10 self-center w-full max-w-sm md:max-w-md relative">
        <div className={`${currentTheme.cardBg} ${currentTheme.cardRoundness} border ${currentTheme.cardBorder} p-6 md:p-8 ${currentTheme.cardShadow} w-full shadow-2xl relative text-center space-y-6 overflow-hidden`}>
          
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500" />

          {/* Secure Padlock Shield indicator */}
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner relative">
            {isBypassing ? (
              <RefreshCw size={26} className="animate-spin text-cyan-400" />
            ) : (
              <Lock size={26} className="animate-pulse" />
            )}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white dark:border-slate-900" />
          </div>

          <div className="space-y-1.5">
            <h2 className={`text-xl font-bold tracking-tight text-[#111827] dark:text-white ${currentTheme.fontHeading}`}>
              Enter Administrative Key
            </h2>
            <p className="text-xs text-[#64748b]">
              Terminal locked. Enter authorization PIN code or carry bypass check.
            </p>
          </div>

          {/* PIN INDICATOR DOTS or SCANNER LOADING SCREEN */}
          {isBypassing ? (
            <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-900/40 text-center space-y-3.5 animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-40 block animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <div>
                <p className="text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest">Biometric Face Verification Active</p>
                <p className="text-[9px] text-slate-500 dark:text-zinc-400 font-mono leading-normal mt-0.5">Analyses 128-vertex facial grid coordinates. Searching matches...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Output Display of PIN */}
              <div className="flex justify-center gap-4 py-2.5">
                {[0, 1, 2, 3].map((index) => {
                  const hasChar = pinValue.length > index;
                  return (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                        hasChar
                          ? "bg-indigo-600 border-indigo-600 scale-125 shadow-md shadow-indigo-600/35"
                          : "border-slate-300 dark:border-slate-800"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Status or Errors feedback box */}
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl text-[10.5px] font-semibold flex items-center gap-2 text-left leading-normal animate-shake">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* NUMERIC INTEGRATED DIAL KEYPAD */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num)}
                    className="cursor-pointer py-3 text-slate-800 dark:text-white dark:hover:text-white dark:bg-slate-900/60 hover:bg-slate-100 bg-slate-50 active:scale-95 transition-all text-sm font-extrabold rounded-2xl border dark:border-slate-800/80 shadow-sm"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="cursor-pointer py-3 text-[#f43f5e] dark:hover:bg-rose-950/20 hover:bg-rose-50 font-bold text-xs uppercase tracking-wider rounded-2xl border dark:border-slate-800/80"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => handleKeyPress("0")}
                  className="cursor-pointer py-3 text-slate-800 dark:text-white dark:hover:text-white dark:bg-slate-900/60 hover:bg-slate-100 bg-slate-50 active:scale-95 transition-all text-sm font-extrabold rounded-2xl border dark:border-slate-800/80"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  className="cursor-pointer py-3 text-slate-500 dark:hover:bg-slate-850 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-2xl border dark:border-slate-800/80"
                >
                  Delete
                </button>
              </div>

              {/* DEMO BYPASS BIOMETRIC OPTION AND TUTORIAL TIP */}
              <div className="pt-4 border-t dark:border-slate-800 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleBiometricBypass}
                  className="cursor-pointer w-full py-2 bg-gradient-to-r from-cyan-500/10 to-indigo-500/15 hover:from-cyan-500/20 hover:to-indigo-500/25 text-cyan-705 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-cyan-400/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Fingerprint size={14} className="text-indigo-400" /> Trigger Simulated Biometric Unlock Bypass
                </button>

                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-medium">
                  💡 Hint: Enter secure master core keys <span className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-slate-900 dark:text-white">1234</span> or <span className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-slate-900 dark:text-white">2026</span> to authenticate manually.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER METRICS SYSTEM STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-4 text-[10px] text-slate-400 font-mono gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-cyan-400" /> System Checked: {timeStr}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} className="text-indigo-400" /> {dateStr}
          </span>
        </div>

        <div className="text-center md:text-right font-medium">
          Secure Sandbox Connection • SHA-256 Auth Shield Active
        </div>
      </div>

    </div>
  );
}
