import React, { useState } from "react";
import {
  Mail,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Server,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Footer from "./Footer";

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

export default function AdminMailPanel({
  siteData,
  onUpdateSiteData,
  onSaveToCloud,
  onBackToSite,
}) {
  const staffEmails =
    siteData?.staffMail?.accounts && Array.isArray(siteData.staffMail.accounts)
      ? siteData.staffMail.accounts
      : DEFAULT_STAFF_EMAILS;

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

    const updatedAccounts = [newAccount, ...staffEmails];

    const nextSiteData = {
      ...siteData,
      staffMail: {
        ...(siteData?.staffMail || {}),
        portalUrl: "mail.cleadglobal.org",
        domain: "cleadglobal.org",
        accounts: updatedAccounts,
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
      setFullName("");
      setRole("");
      setUsername("");
      setPassword("");
      setAutoSuggested(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <h2 className="text-sm font-black text-amber-400">Admin Email Control Panel</h2>
        {onBackToSite && (
          <button onClick={onBackToSite} className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        )}
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            Provision New Staff Email Address
          </h2>
          {/* ... (Create Email Form) ... */}
          <form onSubmit={handleCreateEmail} className="space-y-4">
              {/* Simplified form fields for brevity in this mock admin panel */}
              <input type="text" placeholder="Full Name" value={fullName} onChange={handleFullNameChange} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
              <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
              <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
              <button type="submit" className="w-full py-3 bg-amber-400 text-slate-950 font-bold rounded-xl">Create Account</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
