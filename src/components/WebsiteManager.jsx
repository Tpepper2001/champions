import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Sliders,
  Type,
  Users,
  Calendar,
  BookOpen,
  Award,
  MessageSquare,
  Compass,
  FileText,
  LogOut,
} from "lucide-react";

export default function WebsiteManager({
  data,
  onChange,
  onSave,
  onReset,
  onClose,
  onLogout,
  initialTab = "branding",
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [saveToast, setSaveToast] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const tabs = [
    { id: "branding", label: "Branding & Contacts", icon: Sliders },
    { id: "hero", label: "Hero Header", icon: Sparkles },
    { id: "about", label: "About & Story", icon: FileText },
    { id: "stats", label: "Impact & Stats", icon: Award },
    { id: "values", label: "Core Values", icon: Compass },
    { id: "ceo", label: "CEO Jerry Oyedele", icon: Award },
    { id: "events", label: "Events (Upcoming & Past)", icon: Calendar },
    { id: "team", label: "Team & Volunteers", icon: Users },
    { id: "blog", label: "Blog & Articles", icon: BookOpen },
    { id: "reviews", label: "Reviews & Testimonials", icon: MessageSquare },
    { id: "booking", label: "Booking & Forms", icon: Type },
    { id: "backup", label: "Data Backup & Restore", icon: Download },
  ];

  const handleSaveClick = () => {
    onSave();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Helper deep update
  const updateSection = (section, field, value) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  // Export JSON file
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clg-website-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === "object") {
          onChange(parsed);
          handleSaveClick();
          alert("Website content successfully imported and saved!");
        }
      } catch (err) {
        alert("Invalid JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* TOP STICKY BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-sm">
              CLG
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-wide">
                Website Manager
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                LIVE CMS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Edit every text and picture • Changes sync immediately to site
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition active:scale-95 shadow-sm"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            View Live Site
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 border border-amber-300 transition shadow-lg shadow-amber-400/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-700/60 transition"
              title="Log out of Website Manager"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              Logout
            </button>
          )}

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
            title="Revert to original website default content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          All changes saved to your browser!
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Reset all content to original defaults?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will replace all your custom text, pictures, and events with
              the original default template data. This action cannot be undone unless you export a JSON backup.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setResetConfirmOpen(false);
                  handleSaveClick();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SIDEBAR TABS */}
        <aside className="w-full md:w-64 lg:w-72 bg-slate-950/80 border-r border-slate-800 shrink-0 p-3 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
          <div className="hidden md:block px-3 py-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Site Sections
            </span>
          </div>

          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left whitespace-nowrap md:whitespace-normal shrink-0 ${
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-amber-400/80"}`} />
                <span>{t.label}</span>
              </button>
            );
          })}

          <div className="mt-auto hidden md:block pt-6 border-t border-slate-800/80 px-2 space-y-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download Backup
            </button>
          </div>
        </aside>

        {/* EDITOR MAIN AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 1. BRANDING & CONTACTS */}
            {activeTab === "branding" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    Branding & Global Contacts
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control your logo picture, brand name, contact links, and footer statements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Image */}
                  <div className="md:col-span-2">
                    <ImageUploader
                      label="Brand Logo Picture"
                      aspect="avatar"
                      value={data.branding.logoUrl}
                      onChange={(v) => updateSection("branding", "logoUrl", v)}
                      helperText="Square/circle logo with transparent or light background"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={data.branding.name}
                      onChange={(e) => updateSection("branding", "name", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={data.branding.tagline}
                      onChange={(e) => updateSection("branding", "tagline", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={data.branding.email}
                      onChange={(e) => updateSection("branding", "email", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={data.branding.phone}
                      onChange={(e) => updateSection("branding", "phone", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      WhatsApp Link
                    </label>
                    <input
                      type="text"
                      value={data.branding.whatsApp}
                      onChange={(e) => updateSection("branding", "whatsApp", e.target.value)}
                      placeholder="https://wa.me/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Formspree Form Action Endpoint
                    </label>
                    <input
                      type="text"
                      value={data.branding.formAction}
                      onChange={(e) => updateSection("branding", "formAction", e.target.value)}
                      placeholder="https://formspree.io/f/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Footer Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={data.branding.footerDesc}
                      onChange={(e) => updateSection("branding", "footerDesc", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Footer Copyright Text
                    </label>
                    <input
                      type="text"
                      value={data.branding.copyrightText}
                      onChange={(e) => updateSection("branding", "copyrightText", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* 2. HERO SECTION */}
            {activeTab === "hero" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Hero Section
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit the main homepage banner image, bold headlines, quotes, buttons, and scrolling ticker text.
                  </p>
                </div>

                {/* Hero Background Image */}
                <ImageUploader
                  label="Hero Background Picture"
                  aspect="wide"
                  value={data.hero.bgImage}
                  onChange={(v) => updateSection("hero", "bgImage", v)}
                  helperText="High resolution landscape photo (1920x1080 recommended)"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Top Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.eyebrow}
                      onChange={(e) => updateSection("hero", "eyebrow", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Headline: Line 1
                    </label>
                    <input
                      type="text"
                      value={data.hero.titleLine1}
                      onChange={(e) => updateSection("hero", "titleLine1", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Headline: Highlighted Word
                    </label>
                    <input
                      type="text"
                      value={data.hero.titleHighlight}
                      onChange={(e) => updateSection("hero", "titleHighlight", e.target.value)}
                      className="w-full bg-slate-800 border border-amber-400/40 rounded-xl px-4 py-2 text-sm text-amber-300 font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Headline: Line 3
                    </label>
                    <input
                      type="text"
                      value={data.hero.titleLine3}
                      onChange={(e) => updateSection("hero", "titleLine3", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={data.hero.sub}
                      onChange={(e) => updateSection("hero", "sub", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Hero Quote Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.quote}
                      onChange={(e) => updateSection("hero", "quote", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Quote Author
                    </label>
                    <input
                      type="text"
                      value={data.hero.quoteAuthor}
                      onChange={(e) => updateSection("hero", "quoteAuthor", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.primaryBtnText}
                      onChange={(e) => updateSection("hero", "primaryBtnText", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Secondary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.secondaryBtnText}
                      onChange={(e) => updateSection("hero", "secondaryBtnText", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Marquee words */}
                <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Scrolling Marquee Ticker Keywords
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const word = prompt("Enter new keyword for ticker:");
                        if (word?.trim()) {
                          updateSection("hero", "marqueeItems", [...data.hero.marqueeItems, word.trim()]);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Keyword
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.hero.marqueeItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs font-medium"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.hero.marqueeItems.filter((_, i) => i !== idx);
                            updateSection("hero", "marqueeItems", filtered);
                          }}
                          className="text-slate-400 hover:text-rose-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 3. ABOUT SECTION */}
            {activeTab === "about" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    About & Story Section
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit the foundational story, mission, vision, and featured quote.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Section Sub-Label
                    </label>
                    <input
                      type="text"
                      value={data.aboutSection.label}
                      onChange={(e) => updateSection("aboutSection", "label", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Section Main Title
                    </label>
                    <input
                      type="text"
                      value={data.aboutSection.title}
                      onChange={(e) => updateSection("aboutSection", "title", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Story Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={data.aboutSection.p1}
                      onChange={(e) => updateSection("aboutSection", "p1", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Story Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={data.aboutSection.p2}
                      onChange={(e) => updateSection("aboutSection", "p2", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Story Paragraph 3
                    </label>
                    <textarea
                      rows={3}
                      value={data.aboutSection.p3}
                      onChange={(e) => updateSection("aboutSection", "p3", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Featured Callout Quote
                    </label>
                    <textarea
                      rows={2}
                      value={data.aboutSection.quote}
                      onChange={(e) => updateSection("aboutSection", "quote", e.target.value)}
                      className="w-full bg-slate-800 border border-amber-400/40 rounded-xl px-4 py-2 text-sm text-amber-200 focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  {/* Vision Card */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Vision Card Title
                    </label>
                    <input
                      type="text"
                      value={data.aboutSection.visionTitle}
                      onChange={(e) => updateSection("aboutSection", "visionTitle", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                      Vision Card Content
                    </label>
                    <textarea
                      rows={3}
                      value={data.aboutSection.visionDesc}
                      onChange={(e) => updateSection("aboutSection", "visionDesc", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  {/* Mission Card */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Mission Card Title
                    </label>
                    <input
                      type="text"
                      value={data.aboutSection.missionTitle}
                      onChange={(e) => updateSection("aboutSection", "missionTitle", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                      Mission Card Content
                    </label>
                    <textarea
                      rows={3}
                      value={data.aboutSection.missionDesc}
                      onChange={(e) => updateSection("aboutSection", "missionDesc", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* 4. IMPACT & STATS */}
            {activeTab === "stats" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Impact & Statistics Section
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit stat counters, metrics, labels, emojis, and the callout banner.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Sub-label
                    </label>
                    <input
                      type="text"
                      value={data.statsSection.label}
                      onChange={(e) => updateSection("statsSection", "label", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Title Prefix
                    </label>
                    <input
                      type="text"
                      value={data.statsSection.title}
                      onChange={(e) => updateSection("statsSection", "title", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Title Highlight
                    </label>
                    <input
                      type="text"
                      value={data.statsSection.titleHighlight}
                      onChange={(e) => updateSection("statsSection", "titleHighlight", e.target.value)}
                      className="w-full bg-slate-800 border border-amber-400/40 rounded-xl px-4 py-2 text-sm text-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200">Stat Metric Cards</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newStat = {
                          id: `stat-${Date.now()}`,
                          num: "100",
                          suffix: "+",
                          label: "New Metric",
                          desc: "Description of this metric",
                          icon: "⭐",
                        };
                        updateSection("statsSection", "items", [...data.statsSection.items, newStat]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Stat Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.statsSection.items.map((stat, idx) => (
                      <div
                        key={stat.id || idx}
                        className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.statsSection.items.filter((_, i) => i !== idx);
                            updateSection("statsSection", "items", filtered);
                          }}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                          title="Delete metric card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Icon</label>
                            <input
                              type="text"
                              value={stat.icon}
                              onChange={(e) => {
                                const copy = [...data.statsSection.items];
                                copy[idx] = { ...copy[idx], icon: e.target.value };
                                updateSection("statsSection", "items", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-base text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Number</label>
                            <input
                              type="text"
                              value={stat.num}
                              onChange={(e) => {
                                const copy = [...data.statsSection.items];
                                copy[idx] = { ...copy[idx], num: e.target.value };
                                updateSection("statsSection", "items", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-sm font-black text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Suffix</label>
                            <input
                              type="text"
                              value={stat.suffix}
                              onChange={(e) => {
                                const copy = [...data.statsSection.items];
                                copy[idx] = { ...copy[idx], suffix: e.target.value };
                                updateSection("statsSection", "items", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-sm font-black text-amber-400 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const copy = [...data.statsSection.items];
                              copy[idx] = { ...copy[idx], label: e.target.value };
                              updateSection("statsSection", "items", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                          <input
                            type="text"
                            value={stat.desc}
                            onChange={(e) => {
                              const copy = [...data.statsSection.items];
                              copy[idx] = { ...copy[idx], desc: e.target.value };
                              updateSection("statsSection", "items", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banner Callout */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Bottom Clarity Banner
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={data.statsSection.bannerTitle}
                        onChange={(e) => updateSection("statsSection", "bannerTitle", e.target.value)}
                        placeholder="Banner Title"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={data.statsSection.bannerSub}
                        onChange={(e) => updateSection("statsSection", "bannerSub", e.target.value)}
                        placeholder="Banner Subtitle"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={data.statsSection.bannerBtnText}
                        onChange={(e) => updateSection("statsSection", "bannerBtnText", e.target.value)}
                        placeholder="Button Text"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 5. CORE VALUES */}
            {activeTab === "values" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    Core Values Section
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add, edit, or remove the organizational core values and descriptions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Section Sub-Label
                    </label>
                    <input
                      type="text"
                      value={data.coreValues.label}
                      onChange={(e) => updateSection("coreValues", "label", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.coreValues.title}
                      onChange={(e) => updateSection("coreValues", "title", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Subtitle / Explanation
                    </label>
                    <textarea
                      rows={2}
                      value={data.coreValues.subtitle}
                      onChange={(e) => updateSection("coreValues", "subtitle", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                {/* Values List */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200">Core Values Cards</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newVal = {
                          id: `val-${Date.now()}`,
                          title: "New Value",
                          desc: "Description of this organizational core value.",
                        };
                        updateSection("coreValues", "items", [...data.coreValues.items, newVal]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Core Value
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.coreValues.items.map((val, idx) => (
                      <div
                        key={val.id || idx}
                        className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2 relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.coreValues.items.filter((_, i) => i !== idx);
                            updateSection("coreValues", "items", filtered);
                          }}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                          title="Delete value"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <label className="text-[10px] font-bold text-amber-400 uppercase">
                          Value Title
                        </label>
                        <input
                          type="text"
                          value={val.title}
                          onChange={(e) => {
                            const copy = [...data.coreValues.items];
                            copy[idx] = { ...copy[idx], title: e.target.value };
                            updateSection("coreValues", "items", copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white outline-none"
                        />

                        <label className="text-[10px] font-bold text-slate-400 uppercase block pt-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={val.desc}
                          onChange={(e) => {
                            const copy = [...data.coreValues.items];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            updateSection("coreValues", "items", copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 6. CEO JERRY OYEDELE */}
            {activeTab === "ceo" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    CEO Jerry Oyedele & Biography
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage CEO welcome video, profile photo, credentials, bio chapters, and speaker booking.
                  </p>
                </div>

                {/* Homepage Video Block */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Homepage Welcome Video
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Section Title</label>
                      <input
                        type="text"
                        value={data.ceoSection.homeTitle}
                        onChange={(e) => updateSection("ceoSection", "homeTitle", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">YouTube Embed URL</label>
                      <input
                        type="text"
                        value={data.ceoSection.videoUrl}
                        onChange={(e) => updateSection("ceoSection", "videoUrl", e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subtitle</label>
                      <input
                        type="text"
                        value={data.ceoSection.homeSubtitle}
                        onChange={(e) => updateSection("ceoSection", "homeSubtitle", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CEO Profile Picture & Personal Details */}
                <div className="space-y-4">
                  <ImageUploader
                    label="CEO Profile Picture"
                    aspect="video"
                    value={data.ceoSection.photo}
                    onChange={(v) => updateSection("ceoSection", "photo", v)}
                    helperText="Portrait or studio photo of Jerry Oyedele"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={data.ceoSection.name}
                        onChange={(e) => updateSection("ceoSection", "name", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={data.ceoSection.title}
                        onChange={(e) => updateSection("ceoSection", "title", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Biography Intro & Quote */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Biography Opening & Turning-Point Quote
                  </h3>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Intro Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={data.ceoSection.bioIntro1}
                      onChange={(e) => updateSection("ceoSection", "bioIntro1", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Intro Paragraph 2</label>
                    <textarea
                      rows={2}
                      value={data.ceoSection.bioIntro2}
                      onChange={(e) => updateSection("ceoSection", "bioIntro2", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-400 uppercase">Turning Point Quote</label>
                    <textarea
                      rows={2}
                      value={data.ceoSection.quote}
                      onChange={(e) => updateSection("ceoSection", "quote", e.target.value)}
                      className="w-full bg-slate-900 border border-amber-400/40 rounded-xl p-2.5 text-xs text-amber-200 outline-none"
                    />
                  </div>
                </div>

                {/* Bio Chapters (Journey, Musicologist, Speaker, Faith) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200">Biography Story Chapters</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newSec = {
                          id: `bio-${Date.now()}`,
                          heading: "New Chapter",
                          paras: ["First paragraph of this chapter.", "Second paragraph."],
                        };
                        updateSection("ceoSection", "bioSections", [...data.ceoSection.bioSections, newSec]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Chapter
                    </button>
                  </div>

                  {data.ceoSection.bioSections.map((sec, idx) => (
                    <div key={sec.id || idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = data.ceoSection.bioSections.filter((_, i) => i !== idx);
                          updateSection("ceoSection", "bioSections", filtered);
                        }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                        title="Delete chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <label className="text-[10px] font-bold text-amber-400 uppercase">Chapter Title</label>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => {
                          const copy = [...data.ceoSection.bioSections];
                          copy[idx] = { ...copy[idx], heading: e.target.value };
                          updateSection("ceoSection", "bioSections", copy);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white outline-none"
                      />

                      <label className="text-[10px] font-bold text-slate-400 uppercase block pt-1">
                        Content (Separate paragraphs with a blank line)
                      </label>
                      <textarea
                        rows={4}
                        value={sec.paras.join("\n\n")}
                        onChange={(e) => {
                          const copy = [...data.ceoSection.bioSections];
                          copy[idx] = { ...copy[idx], paras: e.target.value.split("\n\n").filter(p => p.trim()) };
                          updateSection("ceoSection", "bioSections", copy);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Academic Degrees & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Degrees */}
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-400 uppercase">Academic Degrees</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newDeg = { id: `deg-${Date.now()}`, degree: "B.Sc. Leadership", school: "OAU", status: "Completed" };
                          updateSection("ceoSection", "degrees", [...data.ceoSection.degrees, newDeg]);
                        }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300"
                      >
                        + Add Degree
                      </button>
                    </div>
                    {data.ceoSection.degrees.map((d, idx) => (
                      <div key={d.id || idx} className="bg-slate-900 p-2.5 rounded-xl space-y-1 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.ceoSection.degrees.filter((_, i) => i !== idx);
                            updateSection("ceoSection", "degrees", filtered);
                          }}
                          className="absolute top-2 right-2 text-slate-400 hover:text-rose-400"
                        >
                          ×
                        </button>
                        <input
                          type="text"
                          value={d.degree}
                          onChange={(e) => {
                            const copy = [...data.ceoSection.degrees];
                            copy[idx] = { ...copy[idx], degree: e.target.value };
                            updateSection("ceoSection", "degrees", copy);
                          }}
                          className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-slate-800 pb-1"
                        />
                        <input
                          type="text"
                          value={d.school}
                          onChange={(e) => {
                            const copy = [...data.ceoSection.degrees];
                            copy[idx] = { ...copy[idx], school: e.target.value };
                            updateSection("ceoSection", "degrees", copy);
                          }}
                          className="w-full bg-transparent text-[11px] text-slate-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-400 uppercase">Certifications</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newCert = { id: `cert-${Date.now()}`, cert: "Advanced Leadership Certificate", school: "Global Institute" };
                          updateSection("ceoSection", "certifications", [...data.ceoSection.certifications, newCert]);
                        }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300"
                      >
                        + Add Cert
                      </button>
                    </div>
                    {data.ceoSection.certifications.map((c, idx) => (
                      <div key={c.id || idx} className="bg-slate-900 p-2.5 rounded-xl space-y-1 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.ceoSection.certifications.filter((_, i) => i !== idx);
                            updateSection("ceoSection", "certifications", filtered);
                          }}
                          className="absolute top-2 right-2 text-slate-400 hover:text-rose-400"
                        >
                          ×
                        </button>
                        <input
                          type="text"
                          value={c.cert}
                          onChange={(e) => {
                            const copy = [...data.ceoSection.certifications];
                            copy[idx] = { ...copy[idx], cert: e.target.value };
                            updateSection("ceoSection", "certifications", copy);
                          }}
                          className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-slate-800 pb-1"
                        />
                        <input
                          type="text"
                          value={c.school}
                          onChange={(e) => {
                            const copy = [...data.ceoSection.certifications];
                            copy[idx] = { ...copy[idx], school: e.target.value };
                            updateSection("ceoSection", "certifications", copy);
                          }}
                          className="w-full bg-transparent text-[11px] text-slate-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 7. EVENTS (UPCOMING & PAST) */}
            {activeTab === "events" && (
              <section className="space-y-8 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    Events Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage both upcoming conferences and past event historical archives.
                  </p>
                </div>

                {/* Upcoming Events */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Upcoming Events</h3>
                      <p className="text-xs text-slate-400">Displayed in main events grid with registration buttons</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newEv = {
                          id: `up-${Date.now()}`,
                          quarter: "Q4 2026",
                          title: "New Flagship Conference",
                          theme: "Theme / Slogan",
                          loc: "Online (Virtual)",
                          desc: "Detailed description of this transformative event.",
                          tags: ["Virtual", "Free"],
                        };
                        updateSection("eventsSection", "upcoming", [...data.eventsSection.upcoming, newEv]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                    >
                      <Plus className="w-4 h-4" /> Add Upcoming Event
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.eventsSection.upcoming.map((ev, idx) => (
                      <div
                        key={ev.id || idx}
                        className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3 relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.eventsSection.upcoming.filter((_, i) => i !== idx);
                            updateSection("eventsSection", "upcoming", filtered);
                          }}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-amber-400 uppercase">Badge / Quarter</label>
                            <input
                              type="text"
                              value={ev.quarter}
                              onChange={(e) => {
                                const copy = [...data.eventsSection.upcoming];
                                copy[idx] = { ...copy[idx], quarter: e.target.value };
                                updateSection("eventsSection", "upcoming", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                            <input
                              type="text"
                              value={ev.loc}
                              onChange={(e) => {
                                const copy = [...data.eventsSection.upcoming];
                                copy[idx] = { ...copy[idx], loc: e.target.value };
                                updateSection("eventsSection", "upcoming", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Event Title</label>
                          <input
                            type="text"
                            value={ev.title}
                            onChange={(e) => {
                              const copy = [...data.eventsSection.upcoming];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              updateSection("eventsSection", "upcoming", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Theme</label>
                          <input
                            type="text"
                            value={ev.theme}
                            onChange={(e) => {
                              const copy = [...data.eventsSection.upcoming];
                              copy[idx] = { ...copy[idx], theme: e.target.value };
                              updateSection("eventsSection", "upcoming", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs italic text-amber-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                          <textarea
                            rows={3}
                            value={ev.desc}
                            onChange={(e) => {
                              const copy = [...data.eventsSection.upcoming];
                              copy[idx] = { ...copy[idx], desc: e.target.value };
                              updateSection("eventsSection", "upcoming", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Events */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Past Events Archive</h3>
                      <p className="text-xs text-slate-400">Historical records of conferences and masterclasses</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPast = {
                          id: `past-${Date.now()}`,
                          quarter: "OCT 2025",
                          title: "Previous Summit",
                          theme: "Theme here",
                          loc: "Virtual",
                          dates: "12–14 Oct, 2025",
                          desc: "Summary of past impact.",
                          tags: ["Virtual"],
                        };
                        updateSection("eventsSection", "past", [...data.eventsSection.past, newPast]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition border border-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Past Event
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.eventsSection.past.map((ev, idx) => (
                      <div
                        key={ev.id || idx}
                        className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2 relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.eventsSection.past.filter((_, i) => i !== idx);
                            updateSection("eventsSection", "past", filtered);
                          }}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ev.dates}
                            onChange={(e) => {
                              const copy = [...data.eventsSection.past];
                              copy[idx] = { ...copy[idx], dates: e.target.value };
                              updateSection("eventsSection", "past", copy);
                            }}
                            placeholder="Dates (e.g. 15–16 Nov, 2024)"
                            className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-amber-300 font-bold"
                          />
                          <input
                            type="text"
                            value={ev.loc}
                            onChange={(e) => {
                              const copy = [...data.eventsSection.past];
                              copy[idx] = { ...copy[idx], loc: e.target.value };
                              updateSection("eventsSection", "past", copy);
                            }}
                            placeholder="Location"
                            className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-300"
                          />
                        </div>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => {
                            const copy = [...data.eventsSection.past];
                            copy[idx] = { ...copy[idx], title: e.target.value };
                            updateSection("eventsSection", "past", copy);
                          }}
                          placeholder="Event Title"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white"
                        />
                        <textarea
                          rows={2}
                          value={ev.desc}
                          onChange={(e) => {
                            const copy = [...data.eventsSection.past];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            updateSection("eventsSection", "past", copy);
                          }}
                          placeholder="Short summary"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 8. TEAM & VOLUNTEERS */}
            {activeTab === "team" && (
              <section className="space-y-8 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Team Members & Volunteer Banner
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload team pictures, update designations, bios, and volunteer recruitment copy.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Core Team Members</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newMem = {
                        id: `team-${Date.now()}`,
                        name: "New Champion",
                        designation: "Team Role",
                        bio: "Bio description for this team member.",
                        linkedin: "",
                        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
                      };
                      updateSection("teamSection", "members", [...data.teamSection.members, newMem]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                  >
                    <Plus className="w-4 h-4" /> Add Team Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.teamSection.members.map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = data.teamSection.members.filter((_, i) => i !== idx);
                          updateSection("teamSection", "members", filtered);
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 p-1"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Photo Uploader */}
                      <ImageUploader
                        label="Member Photo"
                        aspect="avatar"
                        value={member.photo}
                        onChange={(v) => {
                          const copy = [...data.teamSection.members];
                          copy[idx] = { ...copy[idx], photo: v };
                          updateSection("teamSection", "members", copy);
                        }}
                        helperText="Upload square face photo"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-300 uppercase">Full Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const copy = [...data.teamSection.members];
                              copy[idx] = { ...copy[idx], name: e.target.value };
                              updateSection("teamSection", "members", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-amber-400 uppercase">Designation</label>
                          <input
                            type="text"
                            value={member.designation}
                            onChange={(e) => {
                              const copy = [...data.teamSection.members];
                              copy[idx] = { ...copy[idx], designation: e.target.value };
                              updateSection("teamSection", "members", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-amber-300 font-semibold outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-300 uppercase">Biography</label>
                        <textarea
                          rows={3}
                          value={member.bio}
                          onChange={(e) => {
                            const copy = [...data.teamSection.members];
                            copy[idx] = { ...copy[idx], bio: e.target.value };
                            updateSection("teamSection", "members", copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn URL (optional)</label>
                        <input
                          type="text"
                          value={member.linkedin || ""}
                          onChange={(e) => {
                            const copy = [...data.teamSection.members];
                            copy[idx] = { ...copy[idx], linkedin: e.target.value };
                            updateSection("teamSection", "members", copy);
                          }}
                          placeholder="https://www.linkedin.com/in/..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Volunteer Callout Banner */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Volunteer Recruitment Banner
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Title Prefix</label>
                      <input
                        type="text"
                        value={data.teamSection.volunteerTitle}
                        onChange={(e) => updateSection("teamSection", "volunteerTitle", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-amber-400 uppercase">Title Highlight</label>
                      <input
                        type="text"
                        value={data.teamSection.volunteerHighlight}
                        onChange={(e) => updateSection("teamSection", "volunteerHighlight", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-amber-300 font-bold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                      <textarea
                        rows={2}
                        value={data.teamSection.volunteerDesc}
                        onChange={(e) => updateSection("teamSection", "volunteerDesc", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 9. BLOG & ARTICLES */}
            {activeTab === "blog" && (
              <section className="space-y-8 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    Leadership Blog Articles
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload cover photos, edit articles, categories, dates, read-time estimates, and article body texts.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Articles & Thought Leadership</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newPost = {
                        id: `post-${Date.now()}`,
                        title: "New Inspiring Article",
                        img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
                        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                        category: "Leadership",
                        excerpt: "A brief, compelling summary of this article.",
                        readTime: "5 min read",
                        ctaHeading: "Ready to start your leadership journey?",
                        ctaSub: "Book a clarity session and take the next step.",
                        fullContent: "Write your complete article content here. Use ## for section headings and paragraph breaks.",
                      };
                      updateSection("blogSection", "posts", [newPost, ...data.blogSection.posts]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                  >
                    <Plus className="w-4 h-4" /> Create New Article
                  </button>
                </div>

                <div className="space-y-6">
                  {data.blogSection.posts.map((post, idx) => (
                    <div
                      key={post.id || idx}
                      className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete article "${post.title}"?`)) {
                            const filtered = data.blogSection.posts.filter((_, i) => i !== idx);
                            updateSection("blogSection", "posts", filtered);
                          }
                        }}
                        className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/50"
                        title="Delete article"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cover Picture Uploader */}
                        <div>
                          <ImageUploader
                            label="Article Cover Picture"
                            aspect="video"
                            value={post.img}
                            onChange={(v) => {
                              const copy = [...data.blogSection.posts];
                              copy[idx] = { ...copy[idx], img: v };
                              updateSection("blogSection", "posts", copy);
                            }}
                            helperText="High quality photo (800x500)"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Article Title</label>
                            <input
                              type="text"
                              value={post.title}
                              onChange={(e) => {
                                const copy = [...data.blogSection.posts];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                updateSection("blogSection", "posts", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-base font-bold text-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                              <input
                                type="text"
                                value={post.category}
                                onChange={(e) => {
                                  const copy = [...data.blogSection.posts];
                                  copy[idx] = { ...copy[idx], category: e.target.value };
                                  updateSection("blogSection", "posts", copy);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-amber-400 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Publish Date</label>
                              <input
                                type="text"
                                value={post.date}
                                onChange={(e) => {
                                  const copy = [...data.blogSection.posts];
                                  copy[idx] = { ...copy[idx], date: e.target.value };
                                  updateSection("blogSection", "posts", copy);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Read Time</label>
                              <input
                                type="text"
                                value={post.readTime}
                                onChange={(e) => {
                                  const copy = [...data.blogSection.posts];
                                  copy[idx] = { ...copy[idx], readTime: e.target.value };
                                  updateSection("blogSection", "posts", copy);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Card Excerpt</label>
                            <textarea
                              rows={2}
                              value={post.excerpt}
                              onChange={(e) => {
                                const copy = [...data.blogSection.posts];
                                copy[idx] = { ...copy[idx], excerpt: e.target.value };
                                updateSection("blogSection", "posts", copy);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-300 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Full Article Content */}
                      <div className="pt-2">
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                          Full Article Content (Markdown headings supported with ##)
                        </label>
                        <textarea
                          rows={8}
                          value={post.fullContent}
                          onChange={(e) => {
                            const copy = [...data.blogSection.posts];
                            copy[idx] = { ...copy[idx], fullContent: e.target.value };
                            updateSection("blogSection", "posts", copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-200 leading-relaxed outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 10. REVIEWS & TESTIMONIALS */}
            {activeTab === "reviews" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    Reviews & Testimonials Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage real community testimonials, star ratings, reviewer names, and locations.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Community Reviews</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newRev = {
                        id: `rev-${Date.now()}`,
                        name: "New Champion",
                        role: "Abuja",
                        rating: 5,
                        text: "Champions' Leadership Global has inspired my journey in purpose discovery and transformed my character.",
                      };
                      updateSection("reviewsSection", "items", [newRev, ...data.reviewsSection.items]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                  >
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.reviewsSection.items.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = data.reviewsSection.items.filter((_, i) => i !== idx);
                          updateSection("reviewsSection", "items", filtered);
                        }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 p-1"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Reviewer Name</label>
                          <input
                            type="text"
                            value={rev.name}
                            onChange={(e) => {
                              const copy = [...data.reviewsSection.items];
                              copy[idx] = { ...copy[idx], name: e.target.value };
                              updateSection("reviewsSection", "items", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-amber-400 uppercase">Rating (1-5)</label>
                          <select
                            value={rev.rating}
                            onChange={(e) => {
                              const copy = [...data.reviewsSection.items];
                              copy[idx] = { ...copy[idx], rating: Number(e.target.value) };
                              updateSection("reviewsSection", "items", copy);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-amber-300 outline-none"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                            <option value={4}>⭐⭐⭐⭐ (4)</option>
                            <option value={3}>⭐⭐⭐ (3)</option>
                            <option value={2}>⭐⭐ (2)</option>
                            <option value={1}>⭐ (1)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Role / City</label>
                        <input
                          type="text"
                          value={rev.role}
                          onChange={(e) => {
                            const copy = [...data.reviewsSection.items];
                            copy[idx] = { ...copy[idx], role: e.target.value };
                            updateSection("reviewsSection", "items", copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Testimonial Story</label>
                        <textarea
                          rows={3}
                          value={rev.text}
                          onChange={(e) => {
                            const copy = [...data.reviewsSection.items];
                            copy[idx] = { ...copy[idx], text: e.target.value };
                            updateSection("reviewsSection", "items", copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 11. BOOKING & FORMS */}
            {activeTab === "booking" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Type className="w-5 h-5 text-amber-400" />
                    Booking & Consultation Setup
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure the booking banner photo, session categories, and instructions.
                  </p>
                </div>

                <ImageUploader
                  label="Booking Page Hero Background Picture"
                  aspect="wide"
                  value={data.bookingSection.bgImage}
                  onChange={(v) => updateSection("bookingSection", "bgImage", v)}
                  helperText="Inspiring consultation or leadership background photo"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Hero Eyebrow Label
                    </label>
                    <input
                      type="text"
                      value={data.bookingSection.label}
                      onChange={(e) => updateSection("bookingSection", "label", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Title Prefix
                    </label>
                    <input
                      type="text"
                      value={data.bookingSection.title}
                      onChange={(e) => updateSection("bookingSection", "title", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                      Title Highlighted Word
                    </label>
                    <input
                      type="text"
                      value={data.bookingSection.titleHighlight}
                      onChange={(e) => updateSection("bookingSection", "titleHighlight", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-amber-300 font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Subtitle / Invitation Text
                    </label>
                    <textarea
                      rows={2}
                      value={data.bookingSection.subtitle}
                      onChange={(e) => updateSection("bookingSection", "subtitle", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                {/* Session Types */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 uppercase">Available Coaching Session Types</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const opt = prompt("Enter new session type name:");
                        if (opt?.trim()) {
                          updateSection("bookingSection", "sessionTypes", [...data.bookingSection.sessionTypes, opt.trim()]);
                        }
                      }}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300"
                    >
                      + Add Session Type
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.bookingSection.sessionTypes.map((st, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-200"
                      >
                        {st}
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.bookingSection.sessionTypes.filter((_, i) => i !== idx);
                            updateSection("bookingSection", "sessionTypes", filtered);
                          }}
                          className="text-slate-400 hover:text-rose-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 12. DATA BACKUP & RESTORE */}
            {activeTab === "backup" && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-amber-400" />
                    Data Backup & Restore
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Export all website text and pictures into a single portable JSON file, or restore from a backup.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Export Website Data</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Download a copy of all current text, picture URLs, and configured sections as a .json backup file.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
                    >
                      <Download className="w-4 h-4" /> Download Content JSON
                    </button>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Restore / Import Backup</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Upload a previously exported JSON backup file to instantly restore your custom site content.
                      </p>
                    </div>
                    <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 text-white font-bold text-xs hover:bg-slate-600 transition cursor-pointer border border-slate-600">
                      <Upload className="w-4 h-4" /> Choose JSON File
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportJSON}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live JSON Data Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                        alert("Copied complete website JSON to clipboard!");
                      }}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                    >
                      Copy Raw JSON
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-400 bg-slate-900/80 p-4 rounded-2xl max-h-60 overflow-auto border border-slate-800">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
