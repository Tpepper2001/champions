import React, { useState, useEffect } from "react";
import {
  UserPlus,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Footer from "./Footer";
import { collection, onSnapshot } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../firebase";

export default function AdminMailPanel({
  siteData,
  onUpdateSiteData,
  onSaveToCloud,
  onBackToSite,
}) {
  const [mailboxes, setMailboxes] = useState([]);

  useEffect(() => {
    const unsubMailboxes = onSnapshot(
      collection(db, "mailboxes"),
      (snapshot) => {
        setMailboxes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, "mailboxes");
        } catch (e) {
          console.warn(e);
        }
      }
    );

    return () => unsubMailboxes();
  }, []);

  const staffEmails = mailboxes;

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
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleCreateEmail} className="space-y-4">
            <input type="text" placeholder="Full Name" value={fullName} onChange={handleFullNameChange} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
            <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white">
              <option value="Leadership & Programs">Leadership & Programs</option>
              <option value="Executive Leadership">Executive Leadership</option>
              <option value="Content & Media">Content & Media</option>
              <option value="Community & HR">Community & HR</option>
            </select>
            <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
            <input type="email" placeholder="Forwarding Email (optional)" value={forwardingEmail} onChange={(e) => setForwardingEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
            <div className="flex gap-2">
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white" />
              <button type="button" onClick={generateStrongPassword} className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-amber-400 inline-flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Generate
              </button>
            </div>
            <button type="submit" disabled={isCreating} className="w-full py-3 bg-amber-400 text-slate-950 font-bold rounded-xl">
              {isCreating ? "Creating..." : "Create Account"}
            </button>
          </form>
          {createdAccount && (
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Created {createdAccount.email}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(createdAccount.email, "email")}
                className="text-slate-300 hover:text-white inline-flex items-center gap-1"
              >
                {copiedField === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
