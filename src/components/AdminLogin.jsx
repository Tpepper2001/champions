import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, UserCheck } from "lucide-react";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  registerAdminProfile,
} from "../firebase";
import Footer from "./Footer";

export default function AdminLogin({ onLoginSuccess, onCancel, logoUrl }) {
  const [mode, setMode] = useState("signin"); // "signin" | "register"
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Founder & CEO / Website Manager");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";

  const handleSelectJerryPreset = () => {
    setEmail("jerryoyedele@cleadglobal.org");
    setFullName("Jerry Oyedele");
    setRole("Founder & CEO / Website Manager");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isRegister) {
        if (!fullName.trim()) {
          setError("Please enter the admin's full name.");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await registerAdminProfile(
          cred.user,
          fullName.trim() || "Jerry Oyedele",
          role.trim() || "Website Manager & Admin"
        );
        setSuccessMsg("Admin account registered successfully! Redirecting...");
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
      } else {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        if (cleanEmail === "jerryoyedele@cleadglobal.org") {
          await registerAdminProfile(
            cred.user,
            "Jerry Oyedele",
            "Founder & CEO / Website Manager"
          ).catch(() => {});
        }
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Admin auth error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        if (!isRegister && cleanEmail === "jerryoyedele@cleadglobal.org") {
          setError(
            "Account not yet created or credentials incorrect. Click 'Register Jerry Oyedele' to set up your password."
          );
        } else {
          setError("Incorrect email or password.");
        }
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered. Please switch to 'Sign in' to log in.");
      } else if (err.code === "auth/weak-password") {
        setError("Please choose a stronger password (at least 6 characters).");
      } else {
        setError(err.message || "Authentication failed. Please check your credentials.");
      }
      setIsLoading(false);
    }
  };

  const field =
    "mt-1 flex items-center rounded-lg border border-[#0A1128]/20 focus-within:border-[#0A1128] focus-within:ring-2 focus-within:ring-[#F4D03F]";

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-[#0A1128]">
      <div className="flex min-h-0 flex-1">
        {/* Brand panel */}
        <div className="hidden w-[42%] flex-col justify-between bg-[#0A1128] p-12 text-white lg:flex">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded object-contain bg-white p-1" />
            ) : (
              <Lock className="h-8 w-8 text-[#F4D03F]" />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#F4D03F]">Portal</p>
              <p className="text-sm font-semibold">Champions' Leadership Global</p>
            </div>
          </div>

          <div>
            <div className="mb-6 h-1 w-12 bg-[#F4D03F]" />
            <h1 className="text-4xl font-semibold leading-tight">
              Website Manager &
              <br />
              Admin Portal
            </h1>
            <p className="mt-4 max-w-sm text-white/70 leading-relaxed">
              Full control over website sections, photos, events, blogs, and staff accounts. Authorized administrators only.
            </p>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
              <p className="font-semibold text-[#F4D03F] flex items-center gap-1.5 mb-1">
                <ShieldCheck className="h-4 w-4" /> Designated Administrator
              </p>
              <p className="text-white/80">Jerry Oyedele &bull; jerryoyedele@cleadglobal.org</p>
              <p className="text-white/50 mt-1">Founder, CEO & Lead Website Manager</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="self-start text-sm text-white/60 transition-colors hover:text-[#F4D03F]"
          >
            &larr; Back to website
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mode Tabs */}
            <div className="flex rounded-lg bg-[#0A1128]/5 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition ${
                  !isRegister
                    ? "bg-[#0A1128] text-white shadow-sm"
                    : "text-[#0A1128]/70 hover:text-[#0A1128]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  if (!email) handleSelectJerryPreset();
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition ${
                  isRegister
                    ? "bg-[#0A1128] text-white shadow-sm"
                    : "text-[#0A1128]/70 hover:text-[#0A1128]"
                }`}
              >
                Register Admin
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">
                  {isRegister ? "Register Admin Account" : "Admin Sign In"}
                </h2>
                <p className="mt-1 text-sm text-[#0A1128]/60">
                  {isRegister
                    ? "Set up administrative access for Jerry Oyedele or website staff."
                    : "Access website manager controls and cloud synchronization."}
                </p>
              </div>
            </div>

            {/* Quick preset banner for Jerry Oyedele */}
            <div className="mt-4 rounded-xl border border-[#F4D03F]/40 bg-[#FFF8F0] p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0A1128] truncate">Jerry Oyedele</p>
                <p className="text-xs text-[#0A1128]/70 truncate">jerryoyedele@cleadglobal.org</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleSelectJerryPreset();
                  setMode(isRegister ? "register" : "signin");
                }}
                className="shrink-0 rounded-lg bg-[#0A1128] px-3 py-1.5 text-xs font-semibold text-[#F4D03F] hover:bg-[#1a2a5e] transition"
              >
                Select Jerry
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {isRegister && (
                <>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0A1128]/70">Full Name</span>
                    <div className={field}>
                      <input
                        type="text"
                        required
                        placeholder="Jerry Oyedele"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0A1128]/70">Role / Position</span>
                    <div className={field}>
                      <input
                        type="text"
                        required
                        placeholder="Founder & CEO / Website Manager"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                  </label>
                </>
              )}

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0A1128]/70">Admin Email</span>
                <div className={field}>
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder="jerryoyedele@cleadglobal.org"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0A1128]/70">
                    {isRegister ? "Set Password (min 6 chars)" : "Password"}
                  </span>
                </div>
                <div className={field}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3 text-[#0A1128]/50 hover:text-[#0A1128]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error && (
                <div role="alert" className="rounded-lg border-l-4 border-rose-500 bg-rose-50 p-3 text-xs font-medium text-rose-800 leading-relaxed">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 leading-relaxed flex items-center gap-2">
                  <UserCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A1128] py-3 text-sm font-bold text-[#F4D03F] shadow-md transition hover:bg-[#1a2a5e] disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#F4D03F]" />
                ) : isRegister ? (
                  <UserCheck className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {isRegister ? "Register & Enter Manager" : "Sign In to Website Manager"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 items-center text-xs text-[#0A1128]/60">
              <button
                type="button"
                onClick={() => {
                  setMode(isRegister ? "signin" : "register");
                  setError("");
                  if (!isRegister && !email) handleSelectJerryPreset();
                }}
                className="font-medium text-[#0A1128] underline underline-offset-4 hover:text-amber-600"
              >
                {isRegister
                  ? "Already registered? Switch to Sign in"
                  : "First time setup? Register Jerry Oyedele"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="mt-2 text-sm text-[#0A1128]/60 hover:text-[#0A1128] lg:hidden"
              >
                &larr; Back to website
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}