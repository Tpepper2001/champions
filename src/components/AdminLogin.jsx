import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { auth, signInWithEmailAndPassword } from "../firebase";
import Footer from "./Footer";

export default function AdminLogin({ onLoginSuccess, onCancel, logoUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Incorrect email or password.");
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
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-10 w-10 rounded object-contain" />
          ) : (
            <Lock className="h-8 w-8 text-[#F4D03F]" />
          )}
          <div>
            <div className="mb-6 h-1 w-12 bg-[#F4D03F]" />
            <h1 className="text-4xl font-semibold leading-tight">
              Manage your
              <br />
              website.
            </h1>
            <p className="mt-4 max-w-sm text-white/60">Update text, photos, events and more. Changes go live when you save.</p>
          </div>
          <button onClick={onCancel} className="self-start text-sm text-white/60 transition-colors hover:text-[#F4D03F]">
            ← Back to website
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-1 text-sm text-[#0A1128]/60">Administrator access only.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <div className={field}>
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Password</span>
                <div className={field}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none"
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
                <p role="alert" className="rounded-r border-l-4 border-[#F4D03F] bg-[#F4D03F]/15 px-3 py-2 text-sm font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F4D03F] py-3 font-semibold text-[#0A1128] transition hover:brightness-95 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </button>
            </form>

            <button onClick={onCancel} className="mt-6 text-sm text-[#0A1128]/60 hover:text-[#0A1128] lg:hidden">
              ← Back to website
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}