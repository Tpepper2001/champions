import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Inbox,
  Send,
  PenSquare,
  LogOut,
  Search,
  ArrowLeft,
  Reply,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  X,
  Mail,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "../firebase";
import Footer from "./Footer";

/* Palette: navy #0A1128 + gold #F4D03F (on white). Nothing else. */
const DOMAIN = "cleadglobal.org";

/* ---------- helpers ---------- */
const cleanUsername = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");

const toEmail = (input) => {
  const t = String(input || "").trim().toLowerCase();
  if (!t) return "";
  return t.includes("@") ? t : `${cleanUsername(t)}@${DOMAIN}`;
};

const prettyName = (s) =>
  String(s || "")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const initials = (name) =>
  String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "?";

const msgTime = (m) => m.receivedAt || m.createdAt || m.date || "";

const fmt = (iso, long = false) => {
  const d = new Date(iso);
  if (!iso || isNaN(d.getTime())) return "";
  if (long) return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const senderName = (m) => {
  const raw = String(m.fromName || m.from || "");
  const name = raw.replace(/<[^>]*>/, "").replace(/"/g, "").trim();
  return name || m.from || "Unknown sender";
};

const authError = (err) => {
  switch (err?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "This address already has an account. Sign in instead.";
    case "auth/weak-password":
      return "Choose a stronger password (at least 8 characters).";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network problem. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

/* ---------- sign in / onboarding ---------- */
function AuthScreen({ logo, orgName, onBackToSite, pendingName }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  const isSignup = mode === "signup";

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const email = isSignup
      ? `${cleanUsername(String(username).split("@")[0])}@${DOMAIN}`
      : toEmail(username);

    if (!email || email.startsWith("@")) {
      setError("Enter your email address.");
      return;
    }
    if (isSignup) {
      if (!name.trim()) return setError("Enter your full name.");
      if (password.length < 8) return setError("Use at least 8 characters for your password.");
    } else if (!password) {
      return setError("Enter your password.");
    }

    setBusy(true);
    try {
      if (isSignup) {
        pendingName.current = name.trim();
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(authError(err));
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 bg-white">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#0A1128] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt="" className="h-10 w-auto rounded" />
          ) : (
            <Mail className="h-8 w-8 text-[#F4D03F]" />
          )}
          <span className="font-semibold tracking-wide">{orgName}</span>
        </div>
        <div>
          <div className="h-1 w-12 bg-[#F4D03F] mb-6" />
          <h1 className="text-4xl font-semibold leading-tight">
            Your team mail,
            <br />
            ready in a minute.
          </h1>
          <p className="mt-4 text-white/60 max-w-sm">
            One address at @{DOMAIN} for everything you send and receive as part of the team.
          </p>
        </div>
        <button
          onClick={onBackToSite}
          className="self-start text-sm text-white/60 hover:text-[#F4D03F] transition-colors"
        >
          ← Back to website
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-[#0A1128]">
            <Mail className="h-6 w-6" />
            <span className="font-semibold">{orgName}</span>
          </div>

          <h2 className="text-2xl font-semibold text-[#0A1128]">
            {isSignup ? "Create your mailbox" : "Welcome back"}
          </h2>
          <p className="mt-1 text-sm text-[#0A1128]/60">
            {isSignup ? "Set up your staff email address." : "Sign in to your staff mailbox."}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-lg border border-[#0A1128]/15 p-1 text-sm font-medium">
            {[
              ["signin", "Sign in"],
              ["signup", "Create account"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`rounded-md py-2 transition-colors ${
                  mode === key ? "bg-[#0A1128] text-white" : "text-[#0A1128]/70 hover:text-[#0A1128]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {isSignup && (
              <label className="block">
                <span className="text-sm font-medium text-[#0A1128]">Full name</span>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!usernameTouched) {
                      const parts = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z\s]/g, "")
                        .split(/\s+/)
                        .filter(Boolean);
                      setUsername(parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0] || "");
                    }
                  }}
                  autoComplete="name"
                  className="mt-1 w-full rounded-lg border border-[#0A1128]/20 px-3 py-2.5 text-[#0A1128] outline-none focus:border-[#0A1128] focus:ring-2 focus:ring-[#F4D03F]"
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm font-medium text-[#0A1128]">
                {isSignup ? "Email address" : "Email or username"}
              </span>
              <div className="mt-1 flex items-center rounded-lg border border-[#0A1128]/20 focus-within:border-[#0A1128] focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <input
                  value={username}
                  onChange={(e) => {
                    setUsernameTouched(true);
                    setUsername(isSignup ? cleanUsername(e.target.value) : e.target.value);
                  }}
                  autoComplete="username"
                  autoCapitalize="none"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[#0A1128] outline-none"
                />
                {isSignup && (
                  <span className="pr-3 text-sm text-[#0A1128]/50 select-none">@{DOMAIN}</span>
                )}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#0A1128]">Password</span>
              <div className="mt-1 flex items-center rounded-lg border border-[#0A1128]/20 focus-within:border-[#0A1128] focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[#0A1128] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="px-3 text-[#0A1128]/50 hover:text-[#0A1128]"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignup && (
                <span className="mt-1 block text-xs text-[#0A1128]/50">At least 8 characters.</span>
              )}
            </label>

            {error && (
              <p role="alert" className="text-sm font-medium text-[#0A1128] border-l-4 border-[#F4D03F] bg-[#F4D03F]/15 px-3 py-2 rounded-r">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[#F4D03F] py-3 font-semibold text-[#0A1128] hover:brightness-95 disabled:opacity-60 flex items-center justify-center gap-2 transition"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Create my mailbox" : "Sign in"}
            </button>
          </form>

          <button
            onClick={onBackToSite}
            className="lg:hidden mt-6 text-sm text-[#0A1128]/60 hover:text-[#0A1128]"
          >
            ← Back to website
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- compose ---------- */
function Compose({ initial, onClose, onSend }) {
  const [to, setTo] = useState(initial?.to || "");
  const [subject, setSubject] = useState(initial?.subject || "");
  const [body, setBody] = useState(initial?.body || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!to.trim()) return setError("Add a recipient.");
    setBusy(true);
    try {
      await onSend({ to, subject, body });
    } catch (err) {
      setError(err.message || "Could not send. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end sm:p-6 bg-[#0A1128]/40 sm:bg-transparent pointer-events-none">
      <form
        onSubmit={submit}
        className="pointer-events-auto flex flex-col w-full sm:w-[540px] h-full sm:h-[520px] bg-white sm:rounded-xl border border-[#0A1128]/15 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between bg-[#0A1128] px-4 py-3 text-white">
          <span className="font-medium">New message</span>
          <button type="button" onClick={onClose} aria-label="Close" className="text-white/70 hover:text-[#F4D03F]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          autoCapitalize="none"
          className="border-b border-[#0A1128]/10 px-4 py-3 text-sm text-[#0A1128] outline-none placeholder:text-[#0A1128]/40"
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="border-b border-[#0A1128]/10 px-4 py-3 text-sm text-[#0A1128] outline-none placeholder:text-[#0A1128]/40"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
          className="flex-1 resize-none px-4 py-3 text-sm text-[#0A1128] outline-none placeholder:text-[#0A1128]/40"
        />

        <div className="flex items-center justify-between gap-3 border-t border-[#0A1128]/10 px-4 py-3">
          <p className="text-xs text-[#0A1128] min-w-0 truncate">{error}</p>
          <button
            type="submit"
            disabled={busy}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#F4D03F] px-5 py-2 text-sm font-semibold text-[#0A1128] hover:brightness-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- mailbox ---------- */
function MailApp({ mailbox, messages, logo, orgName, onSignOut, onBackToSite, onSend, onToast }) {
  const [folder, setFolder] = useState("inbox");
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [composing, setComposing] = useState(null);

  const displayName = mailbox.fullName || mailbox.name || prettyName(mailbox.username);

  const inbox = useMemo(() => messages.filter((m) => m.folder !== "sent"), [messages]);
  const sent = useMemo(() => messages.filter((m) => m.folder === "sent"), [messages]);
  const unread = inbox.filter((m) => m.read === false).length;

  const list = useMemo(() => {
    const source = folder === "inbox" ? inbox : sent;
    const q = search.trim().toLowerCase();
    return source.filter(
      (m) =>
        !q ||
        [m.subject, m.body, m.from, m.fromName, m.to].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [folder, inbox, sent, search]);

  const selected = messages.find((m) => m.id === selectedId) || null;

  const open = (m) => {
    setSelectedId(m.id);
    if (m.folder !== "sent" && m.read === false) {
      updateDoc(doc(db, "messages", m.id), { read: true }).catch(() => {});
    }
  };

  const remove = async (m) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", m.id));
      setSelectedId(null);
      onToast("Message deleted");
    } catch {
      onToast("Could not delete the message");
    }
  };

  const reply = (m) => {
    const quoted = String(m.body || "")
      .split("\n")
      .map((l) => `> ${l}`)
      .join("\n");
    setComposing({
      to: m.from,
      subject: /^re:/i.test(m.subject || "") ? m.subject : `Re: ${m.subject || ""}`,
      body: `\n\nOn ${fmt(msgTime(m), true)}, ${senderName(m)} wrote:\n${quoted}`,
    });
  };

  const navBtn = (key, label, Icon, count) => (
    <button
      onClick={() => {
        setFolder(key);
        setSelectedId(null);
      }}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        folder === key ? "bg-white/10 text-[#F4D03F]" : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {count > 0 && (
        <span className="rounded-full bg-[#F4D03F] px-2 py-0.5 text-xs font-semibold text-[#0A1128]">{count}</span>
      )}
    </button>
  );

  return (
    <div className="flex flex-1 min-h-0 bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#0A1128] p-4 text-white">
        <div className="flex items-center gap-2 px-2 py-2">
          {logo ? <img src={logo} alt="" className="h-7 w-auto rounded" /> : <Mail className="h-5 w-5 text-[#F4D03F]" />}
          <span className="truncate text-sm font-semibold">{orgName}</span>
        </div>

        <button
          onClick={() => setComposing({})}
          className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#F4D03F] py-2.5 text-sm font-semibold text-[#0A1128] hover:brightness-95"
        >
          <PenSquare className="h-4 w-4" /> Compose
        </button>

        <nav className="mt-5 space-y-1">
          {navBtn("inbox", "Inbox", Inbox, unread)}
          {navBtn("sent", "Sent", Send, 0)}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4D03F] text-sm font-semibold text-[#0A1128]">
              {initials(displayName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-white/50">{mailbox.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <button onClick={onBackToSite} className="text-white/50 hover:text-[#F4D03F]">
              Website
            </button>
            <button onClick={onSignOut} className="flex items-center gap-1 text-white/50 hover:text-[#F4D03F]">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* List + reader */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between bg-[#0A1128] px-4 py-3 text-white md:hidden">
          <div className="flex gap-1">
            {[
              ["inbox", "Inbox", unread],
              ["sent", "Sent", 0],
            ].map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => {
                  setFolder(key);
                  setSelectedId(null);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  folder === key ? "bg-white/10 text-[#F4D03F]" : "text-white/70"
                }`}
              >
                {label}
                {count > 0 ? ` (${count})` : ""}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setComposing({})} aria-label="Compose" className="text-[#F4D03F]">
              <PenSquare className="h-5 w-5" />
            </button>
            <button onClick={onSignOut} aria-label="Sign out" className="text-white/70">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Message list */}
          <section
            className={`${selected ? "hidden lg:flex" : "flex"} w-full lg:w-[380px] shrink-0 flex-col border-r border-[#0A1128]/10`}
          >
            <div className="border-b border-[#0A1128]/10 p-3">
              <div className="flex items-center gap-2 rounded-lg border border-[#0A1128]/15 px-3 py-2 focus-within:border-[#0A1128]">
                <Search className="h-4 w-4 text-[#0A1128]/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${folder === "inbox" ? "inbox" : "sent"}`}
                  className="w-full bg-transparent text-sm text-[#0A1128] outline-none placeholder:text-[#0A1128]/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {list.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#0A1128]/50">
                  <Inbox className="mb-3 h-8 w-8" />
                  <p className="text-sm">
                    {search ? "No messages match your search." : folder === "inbox" ? "Your inbox is empty." : "Nothing sent yet."}
                  </p>
                </div>
              ) : (
                list.map((m) => {
                  const isUnread = m.folder !== "sent" && m.read === false;
                  const who = folder === "sent" ? `To: ${m.to}` : senderName(m);
                  return (
                    <button
                      key={m.id}
                      onClick={() => open(m)}
                      className={`block w-full border-b border-[#0A1128]/10 px-4 py-3 text-left transition-colors hover:bg-[#F4D03F]/10 ${
                        selectedId === m.id ? "bg-[#F4D03F]/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#F4D03F] ring-1 ring-[#0A1128]" />}
                        <span className={`flex-1 truncate text-sm ${isUnread ? "font-semibold" : "font-medium"} text-[#0A1128]`}>
                          {who}
                        </span>
                        <span className="shrink-0 text-xs text-[#0A1128]/50">{fmt(msgTime(m))}</span>
                      </div>
                      <p className={`mt-0.5 truncate text-sm ${isUnread ? "font-semibold" : ""} text-[#0A1128]`}>
                        {m.subject || "(no subject)"}
                      </p>
                      <p className="truncate text-xs text-[#0A1128]/50">{String(m.body || "").replace(/\s+/g, " ")}</p>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Reader */}
          <section className={`${selected ? "flex" : "hidden lg:flex"} min-w-0 flex-1 flex-col`}>
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center text-[#0A1128]/40">
                <Mail className="mb-3 h-10 w-10" />
                <p className="text-sm">Select a message to read it</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-[#0A1128]/10 px-5 py-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="flex items-center gap-1 text-sm text-[#0A1128]/70 hover:text-[#0A1128] lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    {selected.folder !== "sent" && (
                      <button
                        onClick={() => reply(selected)}
                        className="flex items-center gap-2 rounded-lg bg-[#0A1128] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A1128]/90"
                      >
                        <Reply className="h-4 w-4" /> Reply
                      </button>
                    )}
                    <button
                      onClick={() => remove(selected)}
                      aria-label="Delete"
                      className="rounded-lg border border-[#0A1128]/15 p-2 text-[#0A1128]/70 hover:border-[#0A1128] hover:text-[#0A1128]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
                  <h2 className="text-xl font-semibold text-[#0A1128]">{selected.subject || "(no subject)"}</h2>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A1128] text-sm font-semibold text-[#F4D03F]">
                      {initials(senderName(selected))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#0A1128]">{senderName(selected)}</p>
                      <p className="truncate text-xs text-[#0A1128]/50">
                        {selected.from} → {selected.to}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[#0A1128]/50">{fmt(msgTime(selected), true)}</span>
                  </div>

                  <div className="mt-6 flex-1 border-t border-[#0A1128]/10 pt-6">
                    {selected.html ? (
                      <iframe
                        title="Message"
                        sandbox="allow-popups allow-popups-to-escape-sandbox"
                        srcDoc={`<base target="_blank"><style>body{font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0A1128;margin:0;word-wrap:break-word}img{max-width:100%;height:auto}</style>${selected.html}`}
                        className="h-full min-h-[320px] w-full border-0"
                      />
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[#0A1128]">
                        {selected.body}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {composing && (
        <Compose
          initial={composing}
          onClose={() => setComposing(null)}
          onSend={async (payload) => {
            await onSend(payload);
            setComposing(null);
            onToast("Message sent");
          }}
        />
      )}
    </div>
  );
}

/* ---------- portal (state + data) ---------- */
export default function StaffMailPortal({ siteData, onBackToSite }) {
  const logo = siteData?.branding?.logoUrl;
  const orgName = siteData?.branding?.name || "Champions' Leadership Global";

  const [user, setUser] = useState(undefined); // undefined = still checking
  const [mailbox, setMailbox] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [byBox, setByBox] = useState([]);
  const [byTo, setByTo] = useState([]);
  const [toast, setToast] = useState("");
  const [attempt, setAttempt] = useState(0);

  const pendingName = useRef("");
  const provisioning = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u || null)), []);

  // Find this person's mailbox, or create it the first time they sign in.
  useEffect(() => {
    if (!user) {
      provisioning.current = null;
      setMailbox(null);
      setByBox([]);
      setByTo([]);
      return;
    }
    if (provisioning.current === user.uid) return;
    provisioning.current = user.uid;
    setLoadError("");

    (async () => {
      try {
        const email = (user.email || "").toLowerCase();
        const mailboxes = collection(db, "mailboxes");

        let snap = await getDocs(query(mailboxes, where("email", "==", email)));
        if (snap.empty) snap = await getDocs(query(mailboxes, where("forwardingEmail", "==", email)));

        if (!snap.empty) {
          const d = snap.docs[0];
          if (!d.data().uid) updateDoc(d.ref, { uid: user.uid }).catch(() => {});
          setMailbox({ id: d.id, ...d.data() });
          return;
        }

        const username = email.split("@")[0];
        const name = pendingName.current || user.displayName || prettyName(username);
        const data = {
          email,
          username,
          fullName: name,
          name,
          role: "Staff Member",
          department: "Champions Leadership Global",
          status: "Active",
          uid: user.uid,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        const ref = await addDoc(mailboxes, data);
        const now = new Date().toISOString();
        await addDoc(collection(db, "messages"), {
          mailboxId: ref.id,
          to: email,
          recipientEmail: email,
          from: `welcome@${DOMAIN}`,
          fromName: orgName,
          folder: "inbox",
          subject: `Welcome, ${name.split(" ")[0]}`,
          body: `Hello ${name},\n\nYour mailbox ${email} is ready. You can send and receive email here whenever you sign in.\n\nWelcome to the team.`,
          date: now,
          receivedAt: now,
          createdAt: now,
          read: false,
          status: "delivered",
        });
        setMailbox({ id: ref.id, ...data });
      } catch (err) {
        console.error("Mailbox setup failed:", err);
        provisioning.current = null;
        setLoadError("We couldn't open your mailbox. Check your connection and try again.");
      }
    })();
  }, [user, orgName, attempt]);

  // Live messages: only this mailbox's own mail.
  useEffect(() => {
    if (!mailbox) return;
    const email = (mailbox.email || "").toLowerCase();
    const messages = collection(db, "messages");
    const read = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const fail = (e) => console.error("Mail sync error:", e);

    const u1 = onSnapshot(query(messages, where("mailboxId", "==", mailbox.id)), (s) => setByBox(read(s)), fail);
    const u2 = onSnapshot(query(messages, where("to", "==", email)), (s) => setByTo(read(s)), fail);
    return () => {
      u1();
      u2();
    };
  }, [mailbox]);

  const messages = useMemo(() => {
    const map = new Map();
    byBox.forEach((m) => map.set(m.id, m));
    // Mail addressed to me but filed elsewhere (e.g. sent before I signed up). Never other people's sent copies.
    byTo.filter((m) => m.folder !== "sent").forEach((m) => map.set(m.id, m));
    return [...map.values()].sort((a, b) => new Date(msgTime(b)) - new Date(msgTime(a)));
  }, [byBox, byTo]);

  const send = async ({ to, subject, body }) => {
    const target = toEmail(to);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) throw new Error("Enter a valid email address.");

    const senderEmail = mailbox.email.toLowerCase();
    const name = mailbox.fullName || mailbox.name || prettyName(mailbox.username);
    const now = new Date().toISOString();
    const cleanSubject = subject.trim() || "(no subject)";
    const base = {
      from: senderEmail,
      fromEmail: senderEmail,
      fromName: name,
      to: target,
      subject: cleanSubject,
      body: body.trim(),
      date: now,
      receivedAt: now,
      createdAt: now,
      status: "delivered",
    };
    const internal = target.endsWith(`@${DOMAIN}`);
    const messages = collection(db, "messages");

    if (internal) {
      // Staying inside the team: no outside delivery needed (avoids a duplicate coming back by webhook).
      const rec = await getDocs(query(collection(db, "mailboxes"), where("email", "==", target)));
      const recId = rec.empty ? null : rec.docs[0].id;
      await addDoc(messages, {
        ...base,
        mailboxId: recId || "general",
        recipientMailboxId: recId,
        recipientEmail: target,
        folder: "inbox",
        read: false,
      });
    } else {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: senderEmail,
          fromName: name,
          to: target,
          subject: cleanSubject,
          text: body.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "The message could not be delivered. Please try again.");
      }
    }

    await addDoc(messages, {
      ...base,
      mailboxId: mailbox.id,
      senderMailboxId: mailbox.id,
      folder: "sent",
      read: true,
    });
  };

  let content;
  if (user === undefined || (user && !mailbox && !loadError)) {
    content = (
      <div className="flex flex-1 items-center justify-center bg-white text-[#0A1128]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  } else if (user && loadError) {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-white p-6 text-center text-[#0A1128]">
        <p>{loadError}</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              provisioning.current = null;
              setLoadError("");
              setAttempt((n) => n + 1);
            }}
            className="rounded-lg bg-[#F4D03F] px-5 py-2 text-sm font-semibold"
          >
            Try again
          </button>
          <button onClick={() => signOut(auth)} className="rounded-lg border border-[#0A1128]/20 px-5 py-2 text-sm">
            Sign out
          </button>
        </div>
      </div>
    );
  } else if (!user) {
    content = <AuthScreen logo={logo} orgName={orgName} onBackToSite={onBackToSite} pendingName={pendingName} />;
  } else {
    content = (
      <MailApp
        mailbox={mailbox}
        messages={messages}
        logo={logo}
        orgName={orgName}
        onSignOut={() => signOut(auth)}
        onBackToSite={onBackToSite}
        onSend={send}
        onToast={showToast}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      {content}
      {toast && (
        <div className="fixed bottom-14 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#0A1128] px-4 py-2 text-sm font-medium text-[#F4D03F] shadow-lg">
          {toast}
        </div>
      )}
      <Footer />
    </div>
  );
}