import React, { useState } from "react";
import { Lock, User, ArrowLeft, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function AdminLogin({ onLoginSuccess, onCancel, logoUrl }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // Required credentials: Username = Admin, Password = Pass
      if (username.trim() === "Admin" && password === "Pass") {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError("Invalid username or password. Please check your credentials.");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition mb-6 px-3 py-1.5 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Website
        </button>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-rose-500/20 border border-amber-400/30 text-amber-400 mb-1 shadow-lg shadow-amber-400/5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="CLG Logo"
                  className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1"
                />
              ) : (
                <Lock className="w-8 h-8" />
              )}
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-2">
                Restricted Access
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Website Manager
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative credentials to manage content & photos.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-400/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In to Manager</span>
              )}
            </button>
          </form>

          {/* Credential Hint */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Default access: <span className="text-amber-400 font-mono font-bold">Admin</span> / <span className="text-amber-400 font-mono font-bold">Pass</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
