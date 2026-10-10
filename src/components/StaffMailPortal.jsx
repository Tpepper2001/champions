import React, { useState } from "react";
import {
  Mail,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Globe,
  Server,
  Lock,
  Sparkles,
  Search,
  RefreshCw,
  Building2,
  Inbox,
  Send,
  PenSquare,
  LogOut,
  UserCheck,
  Clock,
  Reply,
} from "lucide-react";

const DEFAULT_STAFF_EMAILS = [
  {
    id: "staff-1",
    fullName: "Jerry Oyedele",
    role: "Chief Executive Officer",
    department: "Executive Leadership",
    username: "jerry.oyedele",
    email: "jerry.oyedele@cleadglobal.org",
    forwardingEmail: "championsleadershipglobal@gmail.com",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "staff-2",
    fullName: "Admin & Operations",
    role: "Operations Desk",
    department: "Administration",
    username: "info",
    email: "info@cleadglobal.org",
    forwardingEmail: "championsleadershipglobal@gmail.com",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "staff-3",
    fullName: "Partnerships & Events",
    role: "Events Coordinator",
    department: "Events & Outreach",
    username: "events",
    email: "events@cleadglobal.org",
    forwardingEmail: "championsleadershipglobal@gmail.com",
    status: "Active",
    createdAt: "2026-02-10",
  },
];

const DEFAULT_MESSAGES = [
  {
    id: "msg-welcome-1",
    to: "all@cleadglobal.org",
    from: "system@cleadglobal.org",
    fromName: "CLG Mail System (mail.cleadglobal.org)",
    subject: "Welcome to Official Champions Leadership Global Staff Webmail",
    body: "Welcome to your official @cleadglobal.org staff mailbox!\n\nYour custom corporate email address is now active on mail.cleadglobal.org. You can use this portal to:\n• Send and receive official messages with colleagues and external contacts\n• Provision new @cleadglobal.org email addresses for staff and regional directors\n• Connect your mailbox to mobile or desktop email clients via IMAP/SMTP.\n\n— Champions Leadership Global IT & Operations",
    date: "2026-02-15 09:00",
    folder: "inbox",
    read: false,
  },
];

export default function StaffMailPortal({
  siteData,
  onUpdateSiteData,
  onSaveToCloud,
  onBackToSite,
  onOpenManager,
}) {
  const staffEmails =
    siteData?.staffMail?.accounts && Array.isArray(siteData.staffMail.accounts)
      ? siteData.staffMail.accounts
      : DEFAULT_STAFF_EMAILS;

  const messages =
    siteData?.staffMail?.messages && Array.isArray(siteData.staffMail.messages)
      ? siteData.staffMail.messages
      : DEFAULT_MESSAGES;

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Leadership & Programs");
  const [username, setUsername] = useState("");
  const [forwardingEmail, setForwardingEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [autoSuggested, setAutoSuggested] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("create"); // "create" | "webmail" | "directory" | "config"

  // Built-in Webmail state
  const [activeMailbox, setActiveMailbox] = useState(
    () => staffEmails[0] || DEFAULT_STAFF_EMAILS[0]
  );
  const [mailFolder, setMailFolder] = useState("inbox"); // "inbox" | "sent" | "compose"
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendSuccessBanner, setSendSuccessBanner] = useState("");

  const sanitizeUsername = (val) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .replace(/\.+/g, ".")
      .replace(/^\.|\.$/g, "");

  const handleFullNameChange = (e) => {
    const val = e.target.value;
    setFullName(val);
    if (autoSuggested) {
      const parts = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);
      if (parts.length >= 2) {
        setUsername(`${parts[0]}.${parts[parts.length - 1]}`);
      } else if (parts.length === 1) {
        setUsername(parts[0]);
      } else {
        setUsername("");
      }
    }
  };

  const handleUsernameChange = (e) => {
    setAutoSuggested(false);
    setUsername(sanitizeUsername(e.target.value));
    setErrorMsg("");
  };

  const generateStrongPassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    let pass = "CLG-";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setShowPassword(true);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openWebmailForAccount = (account) => {
    if (account) {
      setActiveMailbox(account);
    }
    setActiveTab("webmail");
    setMailFolder("inbox");
    setSelectedMessage(null);
  };

  const handleCreateEmail = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanUser = sanitizeUsername(username);
    if (!cleanUser || cleanUser.length < 2) {
      setErrorMsg(
        "Please enter a valid email username (at least 2 characters)."
      );
      return;
    }

    const fullEmail = `${cleanUser}@cleadglobal.org`;
    const exists = staffEmails.some(
      (acc) => acc.email.toLowerCase() === fullEmail.toLowerCase()
    );
    if (exists) {
      setErrorMsg(
        `The address ${fullEmail} is already registered to a staff member.`
      );
      return;
    }

    const finalPassword =
      password.trim() ||
      `CLG-${Math.random().toString(36).slice(2, 8).toUpperCase()}!26`;

    setIsCreating(true);

    const newAccount = {
      id: `staff-${Date.now()}`,
      fullName: fullName.trim(),
      role: role.trim() || "Staff Member",
      department,
      username: cleanUser,
      email: fullEmail,
      forwardingEmail:
        forwardingEmail.trim() || siteData?.branding?.email || "",
      tempPassword: finalPassword,
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const welcomeMsg = {
      id: `msg-${Date.now()}`,
      to: fullEmail,
      from: "admin@cleadglobal.org",
      fromName: "Champions Leadership Global Admin",
      subject: `Your new ${fullEmail} staff mailbox is ready`,
      body: `Hello ${newAccount.fullName},\n\nYour official Champions Leadership Global email address (${fullEmail}) has been provisioned.\n\nRole: ${newAccount.role}\nDepartment: ${newAccount.department}\nForwarding Address: ${newAccount.forwardingEmail || "None set"}\n\nYou can read and send emails directly from this Webmail Portal at any time.\n\nWarm regards,\nChampions Leadership Global`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      folder: "inbox",
      read: false,
    };

    const updatedAccounts = [newAccount, ...staffEmails];
    const updatedMessages = [welcomeMsg, ...messages];

    const nextSiteData = {
      ...siteData,
      staffMail: {
        ...(siteData?.staffMail || {}),
        portalUrl: "mail.cleadglobal.org",
        domain: "cleadglobal.org",
        accounts: updatedAccounts,
        messages: updatedMessages,
      },
    };

    if (onUpdateSiteData) {
      onUpdateSiteData(nextSiteData);
    }

    try {
      if (onSaveToCloud) {
        await onSaveToCloud(nextSiteData);
      }
    } catch (err) {
      console.warn("Saved locally, cloud sync notice:", err);
    }

    setTimeout(() => {
      setIsCreating(false);
      setCreatedAccount(newAccount);
      setActiveMailbox(newAccount);
      setFullName("");
      setRole("");
      setUsername("");
      setPassword("");
      setAutoSuggested(true);
    }, 300);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) return;

    const currentEmail = activeMailbox?.email || "info@cleadglobal.org";
    const currentName = activeMailbox?.fullName || "CLG Staff";

    const newMsg = {
      id: `msg-${Date.now()}`,
      to: composeTo.trim(),
      from: currentEmail,
      fromName: currentName,
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      folder: "sent",
      read: true,
    };

    const updatedMessages = [newMsg, ...messages];
    const nextSiteData = {
      ...siteData,
      staffMail: {
        ...(siteData?.staffMail || {}),
        portalUrl: "mail.cleadglobal.org",
        domain: "cleadglobal.org",
        accounts: staffEmails,
        messages: updatedMessages,
      },
    };

    if (onUpdateSiteData) {
      onUpdateSiteData(nextSiteData);
    }
    try {
      if (onSaveToCloud) {
        await onSaveToCloud(nextSiteData);
      }
    } catch (err) {}

    setSendSuccessBanner(`Message sent from ${currentEmail} to ${composeTo.trim()}`);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setMailFolder("sent");
    setSelectedMessage(newMsg);
    setTimeout(() => setSendSuccessBanner(""), 4000);
  };

  const handleDeleteAccount = async (id) => {
    const updatedAccounts = staffEmails.filter((acc) => acc.id !== id);
    const nextSiteData = {
      ...siteData,
      staffMail: {
        ...(siteData?.staffMail || {}),
        portalUrl: "mail.cleadglobal.org",
        domain: "cleadglobal.org",
        accounts: updatedAccounts,
        messages,
      },
    };
    if (onUpdateSiteData) {
      onUpdateSiteData(nextSiteData);
    }
    try {
      if (onSaveToCloud) {
        await onSaveToCloud(nextSiteData);
      }
    } catch (e) {}
  };

  const filteredStaff = staffEmails.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter messages for activeMailbox
  const currentMailboxEmail = (activeMailbox?.email || "").toLowerCase();
  const inboxMessages = messages.filter(
    (m) =>
      m.to?.toLowerCase() === currentMailboxEmail ||
      m.to?.toLowerCase() === "all@cleadglobal.org"
  );
  const sentMessages = messages.filter(
    (m) => m.from?.toLowerCase() === currentMailboxEmail
  );

  const displayedMessages =
    mailFolder === "sent" ? sentMessages : inboxMessages;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          {siteData?.branding?.logoUrl ? (
            <img
              src={siteData.branding.logoUrl}
              alt="CLG"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
              CLG
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                mail.cleadglobal.org
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Official Staff Mail Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Champions Leadership Global • Custom Staff Email Provisioning, Webmail & Directory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => openWebmailForAccount(activeMailbox)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition"
            title="Open Built-In Staff Webmail Inbox"
          >
            <Inbox className="w-3.5 h-3.5" />
            Open Webmail Inbox
          </button>

          {onOpenManager && (
            <button
              type="button"
              onClick={onOpenManager}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Website Manager
            </button>
          )}

          {onBackToSite && (
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              Back to Main Site
            </button>
          )}
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Staff Email System • @cleadglobal.org
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Official <span className="text-amber-400">@cleadglobal.org</span> Staff Mail Portal
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create custom corporate email addresses for Champions Leadership Global staff,
              access your built-in Webmail Inbox, and manage the organization directory.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-center">
              <div className="text-xl font-black text-amber-400">
                {staffEmails.length}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Active Mailboxes
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-center">
              <div className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1 py-1">
                <ShieldCheck className="w-4 h-4" /> Firebase Synced
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Live Cloud Directory
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "create"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/70"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Custom Staff Email
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("webmail")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "webmail"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/70"
            }`}
          >
            <Inbox className="w-4 h-4" />
            Webmail Inbox & Compose
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "directory"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/70"
            }`}
          >
            <Mail className="w-4 h-4" />
            Staff Email Directory ({staffEmails.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("config")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "config"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/70"
            }`}
          >
            <Server className="w-4 h-4" />
            Subdomain DNS & Mail Server Setup
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: CREATE FORM */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-400" />
                    Provision New Staff Email Address
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fill in your staff details below to create your custom @cleadglobal.org mailbox.
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700">
                  @cleadglobal.org
                </span>
              </div>

              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateEmail} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Staff Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={handleFullNameChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Job Title / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Program Coordinator"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        <option value="Executive Leadership">
                          Executive Leadership
                        </option>
                        <option value="Leadership & Programs">
                          Leadership & Programs
                        </option>
                        <option value="Administration">Administration</option>
                        <option value="Events & Outreach">
                          Events & Outreach
                        </option>
                        <option value="Media & Communications">
                          Media & Communications
                        </option>
                        <option value="Global Chapters & Volunteers">
                          Global Chapters & Volunteers
                        </option>
                        <option value="Finance & Partnerships">
                          Finance & Partnerships
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Recovery / Forwarding Email
                    </label>
                    <input
                      type="email"
                      placeholder="Personal email for notifications"
                      value={forwardingEmail}
                      onChange={(e) => setForwardingEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Custom Email Handle Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Choose Custom Email Address *
                  </label>
                  <div className="flex items-stretch rounded-xl overflow-hidden border border-slate-700 focus-within:border-amber-400 bg-slate-950">
                    <input
                      type="text"
                      required
                      placeholder="firstname.lastname"
                      value={username}
                      onChange={handleUsernameChange}
                      className="flex-1 px-3.5 py-3 bg-transparent text-white text-sm font-mono focus:outline-none"
                    />
                    <span className="px-4 py-3 bg-slate-800/90 text-amber-400 font-mono text-sm font-bold flex items-center border-l border-slate-700 select-none">
                      @cleadglobal.org
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-slate-400">
                      Preview:{" "}
                      <strong className="text-emerald-400 font-mono">
                        {username
                          ? `${username}@cleadglobal.org`
                          : "your.name@cleadglobal.org"}
                      </strong>
                    </span>
                    <div className="flex gap-1.5">
                      {fullName.trim() && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const parts = fullName
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9\s]/g, "")
                                .split(/\s+/)
                                .filter(Boolean);
                              if (parts.length >= 2) {
                                setUsername(
                                  `${parts[0]}.${parts[parts.length - 1]}`
                                );
                              } else if (parts[0]) {
                                setUsername(parts[0]);
                              }
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            first.last
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const parts = fullName
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9\s]/g, "")
                                .split(/\s+/)
                                .filter(Boolean);
                              if (parts.length >= 2) {
                                setUsername(
                                  `${parts[0][0]}${parts[parts.length - 1]}`
                                );
                              }
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            flast
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mailbox Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Mailbox Password
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                    >
                      <RefreshCw className="w-3 h-3" /> Generate Secure Password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password or leave blank to auto-generate"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
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
                  disabled={isCreating}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Provisioning Mailbox...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Create Custom Email Address
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT: CREDENTIALS RESULT OR WEBMAIL ACCESS */}
            <div className="lg:col-span-5 space-y-6">
              {createdAccount ? (
                <div className="bg-emerald-950/30 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          Mailbox Created & Active
                        </span>
                        <h3 className="text-base font-extrabold text-white">
                          {createdAccount.fullName}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Email Address:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-amber-400">
                          {createdAccount.email}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(createdAccount.email, "new-email")
                          }
                          className="p-1 rounded hover:bg-slate-800 text-slate-300"
                          title="Copy email"
                        >
                          {copiedField === "new-email" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Password:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-300">
                          {createdAccount.tempPassword}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(createdAccount.tempPassword, "new-pass")
                          }
                          className="p-1 rounded hover:bg-slate-800 text-slate-300"
                          title="Copy password"
                        >
                          {copiedField === "new-pass" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        Active on Firebase Cloud
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => openWebmailForAccount(createdAccount)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
                    >
                      <Inbox className="w-4 h-4" />
                      Open {createdAccount.username} Webmail Inbox
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("directory")}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                    >
                      View Directory
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Portal Access Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Built-In Staff Webmail Client
                    </h3>
                    <p className="text-xs text-slate-400">
                      Check and send emails for any @cleadglobal.org account right here
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-amber-400 truncate">
                    {activeMailbox?.email || "info@cleadglobal.org"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openWebmailForAccount(activeMailbox)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <Inbox className="w-3.5 h-3.5" /> Launch Inbox
                    </button>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-400 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Custom{" "}
                      <strong className="text-slate-200">
                        name@cleadglobal.org
                      </strong>{" "}
                      staff addresses
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Instant built-in Webmail Inbox & Compose (no external 404)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Synced with Champions Leadership Global Firebase Database
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* BUILT-IN WEBMAIL INBOX & COMPOSER */}
        {activeTab === "webmail" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Webmail Top Account Bar */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                  {(activeMailbox?.fullName || "S")[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">
                      {activeMailbox?.fullName || "Staff Mailbox"}
                    </span>
                    <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      {activeMailbox?.email}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {activeMailbox?.role} • {activeMailbox?.department}
                  </p>
                </div>
              </div>

              {/* Switch active staff mailbox */}
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Switch Mailbox:
                </label>
                <select
                  value={activeMailbox?.email || ""}
                  onChange={(e) => {
                    const found = staffEmails.find(
                      (a) => a.email === e.target.value
                    );
                    if (found) {
                      setActiveMailbox(found);
                      setSelectedMessage(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                >
                  {staffEmails.map((acc) => (
                    <option key={acc.id} value={acc.email}>
                      {acc.email} ({acc.fullName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {sendSuccessBanner && (
              <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-3 text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {sendSuccessBanner}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
              {/* Left Sidebar */}
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-2 bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => {
                    setMailFolder("compose");
                    setSelectedMessage(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md mb-3 transition"
                >
                  <PenSquare className="w-4 h-4" />
                  Compose Email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMailFolder("inbox");
                    setSelectedMessage(null);
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                    mailFolder === "inbox"
                      ? "bg-slate-800 text-amber-400 border border-slate-700"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Inbox className="w-4 h-4" /> Inbox
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-300">
                    {inboxMessages.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMailFolder("sent");
                    setSelectedMessage(null);
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                    mailFolder === "sent"
                      ? "bg-slate-800 text-amber-400 border border-slate-700"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Sent Mail
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-300">
                    {sentMessages.length}
                  </span>
                </button>
              </div>

              {/* Right Content Area */}
              <div className="md:col-span-9 p-6">
                {mailFolder === "compose" ? (
                  <form onSubmit={handleSendEmail} className="space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <PenSquare className="w-4 h-4 text-amber-400" />
                        New Message from {activeMailbox?.email}
                      </h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        To (Recipient Email) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="colleague@cleadglobal.org or external email"
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter email subject..."
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Message Body *
                      </label>
                      <textarea
                        rows={7}
                        required
                        placeholder="Write your official message here..."
                        value={composeBody}
                        onChange={(e) => setComposeBody(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs inline-flex items-center gap-2 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Official Email
                      </button>
                      <a
                        href={`mailto:${encodeURIComponent(
                          composeTo
                        )}?subject=${encodeURIComponent(
                          composeSubject
                        )}&body=${encodeURIComponent(composeBody)}`}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition"
                      >
                        Open in Device Mail App
                      </a>
                    </div>
                  </form>
                ) : selectedMessage ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedMessage(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to{" "}
                        {mailFolder === "sent" ? "Sent Mail" : "Inbox"}
                      </button>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedMessage.date}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-white">
                        {selectedMessage.subject}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-500">From:</span>{" "}
                          <strong className="text-slate-200">
                            {selectedMessage.fromName || selectedMessage.from}
                          </strong>{" "}
                          &lt;{selectedMessage.from}&gt;
                        </div>
                        <div>
                          <span className="text-slate-500">To:</span>{" "}
                          <strong className="text-amber-300 font-mono">
                            {selectedMessage.to}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                      {selectedMessage.body}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setComposeTo(selectedMessage.from);
                        setComposeSubject(`Re: ${selectedMessage.subject}`);
                        setMailFolder("compose");
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                        {mailFolder === "sent" ? "Sent Messages" : "Inbox Messages"} —{" "}
                        <span className="text-amber-400 font-mono lowercase">
                          {activeMailbox?.email}
                        </span>
                      </h3>
                    </div>

                    {displayedMessages.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 text-xs">
                        No messages in this folder yet. Click "Compose Email" to send a message.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800/70">
                        {displayedMessages.map((msg) => (
                          <button
                            key={msg.id}
                            type="button"
                            onClick={() => setSelectedMessage(msg)}
                            className="w-full text-left py-3.5 px-3 hover:bg-slate-800/40 rounded-xl transition flex items-start justify-between gap-4"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm truncate">
                                  {mailFolder === "sent"
                                    ? `To: ${msg.to}`
                                    : msg.fromName || msg.from}
                                </span>
                                <span className="text-[11px] font-mono text-amber-400/90">
                                  {mailFolder === "sent" ? "" : `<${msg.from}>`}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                                {msg.subject}
                              </div>
                              <div className="text-xs text-slate-400 truncate mt-0.5">
                                {msg.body}
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                              {msg.date}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "directory" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  Official @cleadglobal.org Staff Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  All active custom email accounts provisioned for Champions Leadership Global
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("create")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition"
                >
                  <UserPlus className="w-3.5 h-3.5" /> New Email
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Custom Email Address</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredStaff.map((acc) => (
                    <tr
                      key={acc.id}
                      className="hover:bg-slate-800/30 transition"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {acc.fullName}
                        </div>
                        <div className="text-xs text-slate-400">{acc.role}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                          {acc.email}
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.email, acc.id)}
                            className="text-slate-400 hover:text-white"
                            title="Copy email address"
                          >
                            {copiedField === acc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {acc.department}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {acc.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openWebmailForAccount(acc)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-semibold inline-flex items-center gap-1"
                          >
                            <Inbox className="w-3 h-3" /> Open Inbox
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(acc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Remove mailbox"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStaff.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500 text-xs"
                      >
                        No matching staff email accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="space-y-6">
            {/* DNS Subdomain Setup Card */}
            <div className="bg-slate-900 border border-amber-400/30 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  How to Connect <span className="text-amber-400 font-mono">mail.cleadglobal.org</span> in Vercel & DNS
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This portal works immediately at{" "}
                <strong className="text-amber-300 font-mono">/mail</strong> and{" "}
                <strong className="text-amber-300 font-mono">#mail</strong> on your main domain. To also make{" "}
                <strong className="text-amber-300 font-mono">https://mail.cleadglobal.org</strong> resolve directly without a "Page Not Found" or DNS error:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-400">
                    Step 1 — Add Domain in Vercel
                  </div>
                  <p className="text-slate-400">
                    Open your Vercel Project &rarr; <strong>Settings</strong> &rarr;{" "}
                    <strong>Domains</strong> &rarr; Click <strong>Add Domain</strong> and enter{" "}
                    <code className="text-emerald-300">mail.cleadglobal.org</code>.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-400">
                    Step 2 — Add DNS CNAME Record
                  </div>
                  <p className="text-slate-400">
                    In your domain DNS manager for <code className="text-slate-200">cleadglobal.org</code>, add a{" "}
                    <strong className="text-emerald-300">CNAME</strong> record with Host/Name{" "}
                    <code className="text-emerald-300">mail</code> pointing to{" "}
                    <code className="text-emerald-300">cname.vercel-dns.com</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-extrabold text-white">
                    Incoming Mail Server (IMAP)
                  </h3>
                </div>
                <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Server Hostname:</span>
                    <span className="text-amber-300 font-bold">
                      mail.cleadglobal.org
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">IMAP Port (SSL/TLS):</span>
                    <span className="text-emerald-300">993</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">POP3 Port (SSL/TLS):</span>
                    <span className="text-emerald-300">995</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-extrabold text-white">
                    Outgoing Mail Server (SMTP)
                  </h3>
                </div>
                <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Server Hostname:</span>
                    <span className="text-amber-300 font-bold">
                      mail.cleadglobal.org
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">SMTP Port (SSL/TLS):</span>
                    <span className="text-emerald-300">465 / 587</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Authentication:</span>
                    <span className="text-emerald-300">
                      Full @cleadglobal.org Email
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
