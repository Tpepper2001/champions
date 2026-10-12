import React, { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
  Loader2,
  ExternalLink,
  Terminal,
  ChevronDown,
  ChevronUp,
  Info,
  Activity,
} from "lucide-react";
import Footer from "./Footer";
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  OperationType, 
  handleFirestoreError 
} from "../firebase";

export default function StaffMailPortal({
  siteData,
  onUpdateSiteData,
  onSaveToCloud,
  onBackToSite,
  onOpenManager,
}) {
  const [mailboxes, setMailboxes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isLoggedIn = isAuthenticated;
  const [currentUser, setCurrentUser] = useState(null);
  const [activeMailbox, setActiveMailbox] = useState(null);
  const [mailFolder, setMailFolder] = useState("inbox"); // "inbox" | "sent" | "compose"
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendSuccessBanner, setSendSuccessBanner] = useState("");
  const [sendErrorBanner, setSendErrorBanner] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(null);
  const [lastSentResult, setLastSentResult] = useState(null);
  // sendProgress shape: {
  //   step: 1 | 2 | 3 | 4,
  //   percentage: number,
  //   stage: string,
  //   details: string,
  //   status: 'in-progress' | 'success' | 'error',
  //   errorStep?: number,
  //   errorMessage?: string,
  //   errorDetails?: string,
  // }

  // DELIVERY & ERROR LOGGING STATES
  const [deliveryLogs, setDeliveryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("clg_mail_delivery_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [logFilter, setLogFilter] = useState("all"); // "all" | "error" | "warn" | "info" | "success"
  const [resendStatus, setResendStatus] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState(null);
  const [copiedLogId, setCopiedLogId] = useState(null);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const appendLog = (level, stage, message, details = null) => {
    const newEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      isoTime: new Date().toISOString(),
      level, // 'info' | 'warn' | 'error' | 'success'
      stage,
      message,
      details: details ? JSON.parse(JSON.stringify(details)) : null,
    };
    setDeliveryLogs((prev) => {
      const updated = [newEntry, ...prev].slice(0, 100);
      try {
        localStorage.setItem("clg_mail_delivery_logs", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newEntry;
  };

  const clearDeliveryLogs = () => {
    setDeliveryLogs([]);
    try {
      localStorage.removeItem("clg_mail_delivery_logs");
    } catch {}
  };

  const checkResendServerStatus = useCallback(async () => {
    setIsCheckingStatus(true);
    try {
      const res = await fetch("/api/resend-status");
      if (res.ok) {
        const data = await res.json();
        setResendStatus(data);
        appendLog(
          data.configured ? "info" : "warn",
          "Server Health",
          `Resend API Status: ${data.configured ? "Configured (" + data.apiKeyMasked + ")" : "Not configured in .env"}`,
          data
        );
      } else {
        appendLog("error", "Server Health", `Status check returned HTTP ${res.status}`);
      }
    } catch (err) {
      appendLog("error", "Server Health", "Cannot contact /api/resend-status: " + err.message, { error: err.message });
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  const handleTestConnection = async () => {
    setTestConnectionStatus({ loading: true });
    appendLog("info", "Diagnostics", "Running diagnostic probe to test Resend API connection...");
    try {
      const res = await fetch("/api/test-connection", { method: "POST" });
      const data = await res.json();
      setTestConnectionStatus({ loading: false, data, ok: res.ok && data.ok });
      if (res.ok && data.ok) {
        appendLog("success", "Diagnostics", "Resend API connection probe PASSED: " + (data.message || "Connected"), data);
      } else {
        appendLog("error", "Diagnostics", `Diagnostic probe FAILED (${data.code || "HTTP " + res.status}): ${data.error}`, data);
      }
    } catch (err) {
      const errData = { error: err.message };
      setTestConnectionStatus({ loading: false, data: errData, ok: false });
      appendLog("error", "Diagnostics", "Diagnostic probe network failure: " + err.message, errData);
    }
  };

  // Run status check once on mount when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkResendServerStatus();
    }
  }, [isAuthenticated, checkResendServerStatus]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubMailboxes = onSnapshot(
      collection(db, "mailboxes"),
      (snapshot) => {
        setMailboxes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "mailboxes")
    );

    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "messages")
    );

    return () => {
      unsubMailboxes();
      unsubMessages();
    };
  }, [isAuthenticated]);

  const staffEmails = mailboxes;

  // Automatically select or create mailbox for the authenticated user
  useEffect(() => {
    if (!currentUser || !isAuthenticated) return;
    const userEmail = (currentUser.email || "").toLowerCase().trim();
    if (!userEmail) return;

    const userBase = userEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");

    const myMailbox = mailboxes.find((m) => {
      const mbEmail = (m.email || "").toLowerCase().trim();
      const mbFwd = (m.forwardingEmail || "").toLowerCase().trim();
      const mbUser = (m.username || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
      return (
        mbEmail === userEmail ||
        mbFwd === userEmail ||
        (mbUser && userBase && (mbUser === userBase || userBase.includes(mbUser) || mbUser.includes(userBase)))
      );
    });

    if (myMailbox) {
      if (!activeMailbox || activeMailbox.id !== myMailbox.id) {
        setActiveMailbox(myMailbox);
      }
    } else if (mailboxes.length > 0 && !activeMailbox) {
      // Look for any mailbox sharing part of user's name
      const fuzzyMatch = mailboxes.find((m) => {
        const mName = (m.fullName || m.name || "").toLowerCase();
        const uName = (currentUser.displayName || "").toLowerCase();
        return uName && mName && (mName.includes(uName) || uName.includes(mName));
      });
      setActiveMailbox(fuzzyMatch || mailboxes[0]);
    } else if (mailboxes.length === 0 && !activeMailbox) {
      // If no mailbox exists in Firestore yet for the authenticated user, provision it
      const defaultName = (currentUser.displayName || userEmail.split("@")[0])
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const cleanUser = sanitizeUsername(userEmail.split("@")[0]);
      const officialEmail = userEmail.endsWith("@cleadglobal.org")
        ? userEmail
        : `${cleanUser}@cleadglobal.org`;

      const newMb = {
        email: officialEmail,
        forwardingEmail: userEmail,
        fullName: defaultName,
        name: defaultName,
        role: "Staff Member",
        department: "Leadership & Programs",
        username: cleanUser,
        status: "Active",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addDoc(collection(db, "mailboxes"), newMb)
        .then((docRef) => {
          const created = { id: docRef.id, ...newMb };
          setActiveMailbox(created);
        })
        .catch((err) => console.error("Could not auto-provision mailbox:", err));
    }
  }, [mailboxes, currentUser, isAuthenticated, activeMailbox]);


  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

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
  const [activeTab, setActiveTab] = useState("webmail"); // "create" | "webmail" | "directory" | "config"

  // Built-in Webmail helpers

  const formatMsgDate = (val) => {
    if (!val) return "Just now";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return val;
    }
  };

  const sanitizeUsername = (val) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .replace(/\.+/g, ".")
      .replace(/^\.|\.$/g, "");

  const normalizeEmailInput = (input) => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return "";
    return trimmed.includes("@") ? trimmed : `${sanitizeUsername(trimmed)}@cleadglobal.org`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const emailToUse = normalizeEmailInput(loginUsername);
    if (!emailToUse) {
      setLoginError("Please enter your email or username.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailToUse, loginPassword);
      setLoginUsername("");
      setLoginPassword("");
    } catch (err) {
      setLoginError("Invalid email/username or password.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoginError("");
    const emailToUse = normalizeEmailInput(loginUsername);
    if (!emailToUse) {
      setLoginError("Please enter a desired username or email address.");
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailToUse, loginPassword);
      const user = userCredential.user;
      const defaultName = fullName.trim() || user.email.split("@")[0];
      
      // Create mailbox document automatically
      const mailboxRef = await addDoc(collection(db, "mailboxes"), {
        email: user.email,
        name: defaultName,
        fullName: defaultName,
        role: role.trim() || "Staff Member",
        department: department || "Leadership & Programs",
        username: user.email.split("@")[0],
        status: "Active",
        createdAt: new Date().toISOString().slice(0, 10),
      });

      // Create welcome message
      await addDoc(collection(db, "messages"), {
        mailboxId: mailboxRef.id,
        to: user.email,
        from: "admin@cleadglobal.org",
        fromName: "CLG Mail System",
        subject: "Welcome to Champions Leadership Global",
        body: `Hello ${defaultName},\n\nYour official Champions Leadership Global mailbox (${user.email}) is ready.\n\nYou can now send and receive messages using the Webmail Portal.`,
        date: new Date().toISOString().slice(0, 10),
        receivedAt: new Date().toISOString(),
        folder: "inbox",
        read: false,
      });
      
    } catch (err) {
      setLoginError("Failed to create account: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

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

    try {
      const displayName = fullName.trim() || cleanUser;
      const mailboxData = {
        fullName: displayName,
        name: displayName,
        role: role.trim() || "Staff Member",
        department,
        username: cleanUser,
        email: fullEmail,
        forwardingEmail: forwardingEmail.trim() || siteData?.branding?.email || "",
        tempPassword: finalPassword,
        status: "Active",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      const mailboxRef = await addDoc(collection(db, "mailboxes"), mailboxData);

      await addDoc(collection(db, "messages"), {
        mailboxId: mailboxRef.id,
        to: fullEmail,
        from: "admin@cleadglobal.org",
        fromName: "CLG Mail System",
        subject: `Your new ${fullEmail} staff mailbox is ready`,
        body: `Hello ${displayName},\n\nYour official Champions Leadership Global email address (${fullEmail}) has been provisioned.\n\nTemporary Password: ${finalPassword}`,
        date: new Date().toISOString().slice(0, 10),
        receivedAt: new Date().toISOString(),
        folder: "inbox",
        read: false,
      });

      const newAccount = {
        id: mailboxRef.id,
        ...mailboxData,
      };

      setIsCreating(false);
      setCreatedAccount(newAccount);
      setActiveMailbox(newAccount);
      setFullName("");
      setRole("");
      setUsername("");
      setPassword("");
      setAutoSuggested(true);
    } catch (err) {
      setErrorMsg("Failed to provision mailbox: " + (err.message || "Please try again."));
      setIsCreating(false);
      handleFirestoreError(err, OperationType.WRITE, "mailboxes/messages");
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendErrorBanner("");
    setSendSuccessBanner("");
    setLastSentResult(null);

    const target = composeTo.trim();
    if (!target || !composeSubject.trim()) {
      setSendErrorBanner("Please provide both a recipient and a subject.");
      return;
    }

    // Auto-append domain if only username entered
    const targetRecipient = target.includes("@")
      ? target.toLowerCase()
      : `${sanitizeUsername(target)}@cleadglobal.org`;

    const senderEmail = (
      activeMailbox?.email ||
      currentUser?.email ||
      "info@cleadglobal.org"
    ).toLowerCase().trim();

    const senderName =
      activeMailbox?.fullName ||
      activeMailbox?.name ||
      currentUser?.displayName ||
      senderEmail.split("@")[0];

    const isExternal = !targetRecipient.endsWith("@cleadglobal.org");
    const isSelf =
      targetRecipient === senderEmail ||
      targetRecipient === (currentUser?.email || "").toLowerCase().trim() ||
      targetRecipient === (activeMailbox?.forwardingEmail || "").toLowerCase().trim();

    setIsSending(true);
    appendLog("info", "Validation", `Initiating email dispatch: to="${targetRecipient}", subject="${composeSubject.trim()}"`);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Step 1: Authentication & Identity Validation
      setSendProgress({
        step: 1,
        percentage: 20,
        stage: "Step 1/4: Authenticating Sender Identity",
        details: `Verifying authorization for ${senderEmail} (${currentUser?.uid ? "Authenticated" : "Session active"})...`,
        status: "in-progress",
      });
      appendLog("info", "Step 1: Auth", `Authenticated as ${currentUser?.email} (${senderEmail})`);
      await delay(200);

      if (!currentUser && !auth.currentUser) {
        throw new Error("Authentication failed: User is not logged into Firebase Authentication.");
      }

      // Step 2: Payload Packaging & Recipient Resolution
      setSendProgress({
        step: 2,
        percentage: 45,
        stage: "Step 2/4: Packaging Message Envelope",
        details: `Resolving recipient routing for ${targetRecipient} and preparing dual delivery records...`,
        status: "in-progress",
      });
      appendLog("info", "Step 2: Envelope", `To: ${targetRecipient} (${isExternal ? "External internet address" : "Internal @cleadglobal.org"}). Subject: "${composeSubject.trim()}"`);
      await delay(200);

      const nowIso = new Date().toISOString();
      const subjectText = composeSubject.trim();
      const bodyText = composeBody.trim();

      // Find or provision recipient mailbox
      let targetMb = mailboxes.find((m) => {
        const e = (m.email || "").toLowerCase().trim();
        const f = (m.forwardingEmail || "").toLowerCase().trim();
        const u = (m.username || "").toLowerCase().trim();
        const tr = targetRecipient.toLowerCase().trim();
        return e === tr || f === tr || (u && tr.split("@")[0] === u);
      });

      // Auto-provision recipient mailbox if internal @cleadglobal.org address
      if (!targetMb && targetRecipient.endsWith("@cleadglobal.org")) {
        try {
          const userPart = targetRecipient.split("@")[0];
          const defaultMbName = userPart
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const newDocRef = await addDoc(collection(db, "mailboxes"), {
            email: targetRecipient,
            fullName: defaultMbName,
            name: defaultMbName,
            role: "Staff Member",
            department: "Champions Leadership Global",
            username: userPart,
            status: "Active",
            createdAt: nowIso.slice(0, 10),
          });
          targetMb = { id: newDocRef.id, email: targetRecipient, fullName: defaultMbName };
          appendLog("info", "Provisioning", `Auto-provisioned internal mailbox for ${targetRecipient} (Doc ID: ${newDocRef.id})`);
        } catch (provisionErr) {
          console.warn("Could not auto-provision recipient mailbox:", provisionErr);
          appendLog("warn", "Provisioning", `Failed to auto-provision mailbox: ${provisionErr.message}`);
        }
      }

      // Step 3: Cloud Database Relay Write (Sent copy + Recipient Inbox copy)
      setSendProgress({
        step: 3,
        percentage: 75,
        stage: "Step 3/4: Writing to Cloud Mail Relay",
        details: `Transmitting dual records to Firestore 'messages' (Sent Outbox record & Recipient Inbox record)...`,
        status: "in-progress",
      });

      // 1. Sent record for sender Outbox
      const sentPayload = {
        mailboxId: activeMailbox?.id || "general",
        senderMailboxId: activeMailbox?.id || null,
        folder: "sent",
        to: targetRecipient,
        from: senderEmail,
        fromName: senderName,
        subject: subjectText,
        body: bodyText,
        date: nowIso,
        receivedAt: nowIso,
        read: true,
        createdAt: nowIso,
        status: "delivered",
      };
      const sentDocRef = await addDoc(collection(db, "messages"), sentPayload);

      // 2. Inbox record for recipient Inbox
      const inboxPayload = {
        mailboxId: targetMb?.id || (isSelf && activeMailbox?.id ? activeMailbox.id : "general"),
        recipientMailboxId: targetMb?.id || null,
        recipientEmail: targetRecipient,
        folder: "inbox",
        to: targetRecipient,
        from: senderEmail,
        fromName: senderName,
        subject: subjectText,
        body: bodyText,
        date: nowIso,
        receivedAt: nowIso,
        read: false,
        createdAt: nowIso,
        status: "delivered",
      };
      const inboxDocRef = await addDoc(collection(db, "messages"), inboxPayload);
      appendLog("info", "Step 3: Cloud DB", `Dual records created in Firestore: Sent #${sentDocRef.id}, Inbox #${inboxDocRef.id}`);

      // Step 4: Dispatch via Resend Cloud API for internet delivery
      let resendOutcome = null;
      let resendHttpStatus = 0;
      try {
        setSendProgress({
          step: 4,
          percentage: 90,
          stage: "Step 4/4: Transmitting via Resend Cloud API",
          details: `Calling Resend API proxy relay for internet delivery to ${targetRecipient}...`,
          status: "in-progress",
        });
        appendLog("info", "Step 4: Resend Dispatch", `Calling /api/send-email: From "${senderEmail}", To "${targetRecipient}", Subject "${subjectText}"`);

        const resendRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: senderEmail,
            fromName: senderName,
            to: targetRecipient,
            subject: subjectText,
            text: bodyText,
          }),
        });
        resendHttpStatus = resendRes.status;

        const resendJson = await resendRes.json().catch(() => ({
          ok: false,
          error: `Non-JSON response from server (HTTP ${resendRes.status})`,
        }));

        resendOutcome = {
          ...resendJson,
          httpStatus: resendHttpStatus,
          ok: resendRes.ok && Boolean(resendJson.ok),
        };

        if (resendOutcome.ok) {
          appendLog("success", "Step 4: Resend Dispatch", `Resend API accepted dispatch! Dispatch ID: ${resendOutcome.id}`, resendOutcome);
        } else {
          appendLog("error", "Step 4: Resend Dispatch", `Resend API rejected message (${resendOutcome.code || "HTTP " + resendHttpStatus}): ${resendOutcome.error || "Delivery failed"}`, {
            httpStatus: resendHttpStatus,
            code: resendOutcome.code,
            error: resendOutcome.error,
            details: resendOutcome.details,
            troubleshooting: resendOutcome.troubleshooting,
          });
        }
      } catch (proxyErr) {
        console.warn("Resend API proxy warning:", proxyErr);
        resendOutcome = {
          ok: false,
          error: proxyErr.message || "Proxy connection issue",
          code: "ERR_NETWORK_PROXY",
        };
        appendLog("error", "Step 4: Resend Dispatch", `Network/proxy exception: ${proxyErr.message}`, { error: proxyErr.message });
      }

      const deliveredViaResend = Boolean(resendOutcome && resendOutcome.ok);

      // Handle delivery status and error reporting
      if (isExternal && !deliveredViaResend) {
        const errorReason = resendOutcome?.error || "Resend API rejected external delivery";
        setSendProgress({
          step: 4,
          percentage: 85,
          stage: "Step 4/4: Internet Dispatch Issue (Resend API)",
          details: `Archived to intranet cloud (#${sentDocRef.id}), but external delivery to ${targetRecipient} failed: ${errorReason}`,
          status: "error",
          errorStep: 4,
          errorMessage: errorReason,
          errorDetails: resendOutcome?.troubleshooting ? resendOutcome.troubleshooting.join(" • ") : undefined,
        });

        setSendErrorBanner(
          `External email could not be delivered to ${targetRecipient}: ${errorReason}. Inspect the Diagnostic Error Logs below.`
        );
        setSendSuccessBanner("");
        setShowLogConsole(true);

        setLastSentResult({
          recipient: targetRecipient,
          recipientIsExternal: isExternal,
          recipientMailbox: targetMb,
          subject: subjectText,
          body: bodyText,
          sentDocId: sentDocRef.id,
          inboxDocId: inboxDocRef.id,
          isSentToSelf: isSelf,
          resendDispatched: false,
          resendId: null,
          resendError: errorReason,
          resendCode: resendOutcome?.code || `HTTP_${resendHttpStatus}`,
          resendDetails: resendOutcome?.details || null,
          resendTroubleshooting: resendOutcome?.troubleshooting || null,
        });
      } else {
        // Successful delivery (either Resend succeeded or internal intranet message delivered)
        setSendProgress({
          step: 4,
          percentage: 100,
          stage: deliveredViaResend
            ? "Step 4/4: Delivered via Resend Cloud API"
            : "Step 4/4: Message Dispatched & Synced",
          details: deliveredViaResend
            ? `Resend Dispatch ID #${resendOutcome.id} confirmed! Synced to Intranet Inbox (#${inboxDocRef.id}).`
            : `Delivered to internal mailbox #${inboxDocRef.id}.`,
          status: "success",
        });

        setLastSentResult({
          recipient: targetRecipient,
          recipientIsExternal: isExternal,
          recipientMailbox: targetMb,
          subject: subjectText,
          body: bodyText,
          sentDocId: sentDocRef.id,
          inboxDocId: inboxDocRef.id,
          isSentToSelf: isSelf,
          resendDispatched: deliveredViaResend,
          resendId: resendOutcome?.id || null,
          resendError: null,
        });

        setSendSuccessBanner(
          deliveredViaResend
            ? `Message delivered via Resend API and synced to ${targetRecipient}!`
            : `Message successfully delivered to ${targetRecipient}!`
        );
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      const msg = err?.message || "Failed to send message. Please try again.";
      setSendErrorBanner(`Failed to send email: ${msg}`);
      appendLog("error", "Fatal Send Error", `Send process aborted: ${msg}`, { error: err.stack || err.message });
      setShowLogConsole(true);

      setSendProgress((prev) => {
        const failedStep = prev ? prev.step : 1;
        let stepName = "Unknown step";
        if (failedStep === 1) stepName = "Sender Authentication";
        else if (failedStep === 2) stepName = "Payload Packaging";
        else if (failedStep === 3) stepName = "Firestore Cloud Transmission / Security Rules";
        else if (failedStep === 4) stepName = "Confirmation & Routing";

        return {
          step: failedStep,
          percentage: prev ? prev.percentage : 25,
          stage: `Error at Step ${failedStep}/4: ${stepName}`,
          details: `Error details: ${msg}`,
          status: "error",
          errorStep: failedStep,
          errorMessage: msg,
        };
      });

      handleFirestoreError(err, OperationType.WRITE, "messages");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await deleteDoc(doc(db, "mailboxes", id));
      if (activeMailbox?.id === id) {
        const remaining = staffEmails.filter((acc) => acc.id !== id);
        setActiveMailbox(remaining[0] || null);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, "mailboxes");
    }
  };

  const filteredStaff = staffEmails.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter and sort messages for activeMailbox
  const currentMailboxEmail = (
    activeMailbox?.email ||
    currentUser?.email ||
    ""
  ).toLowerCase().trim();
  const currentFwdEmail = (activeMailbox?.forwardingEmail || "").toLowerCase().trim();
  const currentUsername = (activeMailbox?.username || currentMailboxEmail.split("@")[0] || "").toLowerCase().trim();
  const currentAuthEmail = (currentUser?.email || "").toLowerCase().trim();

  const inboxMessages = messages
    .filter((m) => {
      // Must not be a pure sent copy
      if (m.folder === "sent") {
        return false;
      }

      const toEmail = (m.to || m.recipientEmail || "").toLowerCase().trim();
      const toUsername = toEmail.split("@")[0];

      // Direct recipient match
      const isDirect =
        toEmail === currentMailboxEmail ||
        (currentFwdEmail && toEmail === currentFwdEmail) ||
        (currentAuthEmail && toEmail === currentAuthEmail) ||
        (currentUsername && toUsername === currentUsername);

      // Broadcast address match
      const isBroadcast =
        toEmail === "all@cleadglobal.org" ||
        toEmail === "everyone@cleadglobal.org" ||
        toEmail === "staff@cleadglobal.org";

      // Tied to this mailbox ID
      const isForThisMailbox =
        activeMailbox?.id &&
        (m.mailboxId === activeMailbox.id || m.recipientMailboxId === activeMailbox.id);

      return isDirect || isBroadcast || isForThisMailbox;
    })
    .sort(
      (a, b) =>
        new Date(b.date || b.receivedAt || b.createdAt || 0) -
        new Date(a.date || a.receivedAt || a.createdAt || 0)
    );

  const sentMessages = messages
    .filter((m) => {
      if (m.folder !== "sent") return false;

      const fromEmail = (m.from || "").toLowerCase().trim();
      const fromUsername = fromEmail.split("@")[0];

      const isDirectSender =
        fromEmail === currentMailboxEmail ||
        (currentFwdEmail && fromEmail === currentFwdEmail) ||
        (currentAuthEmail && fromEmail === currentAuthEmail) ||
        (currentUsername && fromUsername === currentUsername);

      const isSentFromThisMailbox =
        activeMailbox?.id &&
        (m.mailboxId === activeMailbox.id || m.senderMailboxId === activeMailbox.id);

      return isDirectSender || isSentFromThisMailbox;
    })
    .sort(
      (a, b) =>
        new Date(b.date || b.receivedAt || b.createdAt || 0) -
        new Date(a.date || a.receivedAt || a.createdAt || 0)
    );

  const displayedMessages =
    mailFolder === "sent" ? sentMessages : inboxMessages;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-black text-white text-center">
            {isSignupMode ? "Staff Mail Enrollment" : "Staff Login"}
          </h2>
          <p className="text-sm text-slate-400 text-center -mt-2">
            {isSignupMode ? "Register for your official staff email mailbox." : "Sign in to access your webmail portal."}
          </p>
          <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Corporate Email Address"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="password"
              placeholder={isSignupMode ? "Set Mailbox Password" : "Password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
            {loginError && <p className="text-rose-400 text-xs">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-amber-400 text-slate-950 font-bold rounded-xl"
            >
              {isSignupMode ? "Enroll Now" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setIsSignupMode(!isSignupMode)}
              className="w-full text-xs text-slate-400 hover:text-white mt-2"
            >
              {isSignupMode ? "Already enrolled? Sign in" : "New staff member? Enroll here"}
            </button>
          </form>
        </div>
      </div>
    );
  }

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

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
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
            onClick={() => setActiveTab("create")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "create"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/70"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create New Staff Email
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

        {/* CREATE NEW STAFF EMAIL TAB */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-6">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    Create Official @cleadglobal.org Email
                  </h2>
                  <p className="text-xs text-slate-400">
                    Provision a new custom staff email address and instant webmail inbox
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateEmail} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                      Full Name *
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
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Program Coordinator"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    >
                      <option value="Executive Office">Executive Office</option>
                      <option value="Leadership & Programs">Leadership & Programs</option>
                      <option value="Operations & Admin">Operations & Admin</option>
                      <option value="Media & Communications">Media & Communications</option>
                      <option value="Partnerships & Outreach">Partnerships & Outreach</option>
                      <option value="Finance & Grants">Finance & Grants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                      Forwarding Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="personal@gmail.com"
                      value={forwardingEmail}
                      onChange={(e) => setForwardingEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Desired Email Username *
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-amber-400 overflow-hidden">
                    <input
                      type="text"
                      required
                      placeholder="firstname.lastname"
                      value={username}
                      onChange={handleUsernameChange}
                      className="flex-1 px-3.5 py-2.5 bg-transparent text-white text-sm font-mono focus:outline-none"
                    />
                    <span className="px-3.5 py-2.5 bg-slate-900 text-amber-400 font-mono text-xs font-bold border-l border-slate-800">
                      @cleadglobal.org
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase">
                      Mailbox Password
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Generate Strong Password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Leave blank to auto-generate password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  {isCreating ? "Provisioning Mailbox..." : "Create @cleadglobal.org Email"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {createdAccount ? (
                <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Mailbox Successfully Provisioned!
                  </div>
                  <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Staff Name:</span>
                      <span className="text-white font-bold">{createdAccount.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Email Address:</span>
                      <span className="text-amber-400 font-bold">{createdAccount.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Password:</span>
                      <span className="text-emerald-300">{createdAccount.tempPassword}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openWebmailForAccount(createdAccount)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Inbox className="w-4 h-4" />
                    Open {createdAccount.email} Inbox Now
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Instant Webmail & Directory Sync
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every email created here is immediately added to the live Cloud Directory and gets a dedicated Webmail Inbox where you can send and receive messages.
                  </p>
                </div>
              )}
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
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {sendSuccessBanner}
              </div>
            )}

            {sendErrorBanner && (
              <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-3 text-xs font-bold text-rose-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                {sendErrorBanner}
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
                  <div className="flex items-center gap-1.5">
                    {inboxMessages.filter((m) => !m.read).length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-amber-400 text-slate-950 font-black">
                        {inboxMessages.filter((m) => !m.read).length} new
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-300">
                      {inboxMessages.length}
                    </span>
                  </div>
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

                <button
                  type="button"
                  onClick={() => {
                    setMailFolder("logs");
                    setSelectedMessage(null);
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                    mailFolder === "logs"
                      ? "bg-slate-800 text-sky-400 border border-slate-700"
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" /> Delivery & Error Logs
                  </span>
                  <div className="flex items-center gap-1.5">
                    {deliveryLogs.filter((l) => l.level === "error").length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-rose-500 text-white font-black animate-pulse">
                        {deliveryLogs.filter((l) => l.level === "error").length} err
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-400">
                      {deliveryLogs.length}
                    </span>
                  </div>
                </button>
              </div>

              {/* Right Content Area */}
              <div className="md:col-span-9 p-6">
                {mailFolder === "logs" ? (
                  /* FULL DELIVERY & DIAGNOSTICS LOG CENTER */
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-sky-400" />
                          Mail Delivery Diagnostics & Server Logs
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Real-time trace of message dispatches, Resend API status, cloud synchronization, and network errors.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={handleTestConnection}
                          disabled={testConnectionStatus?.loading}
                          className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Activity className="w-3.5 h-3.5 text-sky-400" />
                          {testConnectionStatus?.loading ? "Testing..." : "Run Test Probe"}
                        </button>
                        <button
                          type="button"
                          onClick={checkResendServerStatus}
                          disabled={isCheckingStatus}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? "animate-spin" : ""}`} />
                          Refresh Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const report = `CHAMPIONS LEADERSHIP GLOBAL - MAIL DIAGNOSTICS REPORT\nGenerated: ${new Date().toISOString()}\nResend Configured: ${resendStatus?.configured ? "YES" : "NO"} (${resendStatus?.apiKeyMasked || "No Key"})\nSender Domain: ${resendStatus?.senderDomain || "cleadglobal.org"}\nActive Mailbox: ${activeMailbox?.email || "None"}\nUser Email: ${currentUser?.email || "None"}\n\n--- DELIVERY LOG ENTRIES (${deliveryLogs.length}) ---\n${deliveryLogs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.stage}] ${l.message} ${l.details ? "\nDetails: " + JSON.stringify(l.details, null, 2) : ""}`).join("\n\n")}`;
                            navigator.clipboard.writeText(report);
                            setCopiedLogId("report");
                            setTimeout(() => setCopiedLogId(null), 2000);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {copiedLogId === "report" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Report!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Full Report
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={clearDeliveryLogs}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold transition cursor-pointer"
                        >
                          Clear Logs
                        </button>
                      </div>
                    </div>

                    {/* Status Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold">Resend API Relay</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${resendStatus?.configured ? "bg-emerald-400" : isCheckingStatus ? "bg-amber-400 animate-pulse" : "bg-rose-500 animate-pulse"}`} />
                        </div>
                        <div className="text-sm font-extrabold text-white">
                          {resendStatus?.configured
                            ? "Configured & Active"
                            : isCheckingStatus
                            ? "Checking Environment..."
                            : "Missing RESEND_API_KEY"}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          {resendStatus?.apiKeyMasked
                            ? `Key: ${resendStatus.apiKeyMasked}`
                            : isCheckingStatus
                            ? "Detecting..."
                            : "Set RESEND_API_KEY in Environment"}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold">Sender Domain</span>
                          <Globe className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-sm font-extrabold text-white font-mono">
                          cleadglobal.org
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Fallback: <span className="font-mono text-slate-300">onboarding@resend.dev</span>
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold">Events Logged</span>
                          <span className="text-xs font-mono font-bold text-amber-400">{deliveryLogs.length}</span>
                        </div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-2">
                          <span className="text-rose-400">{deliveryLogs.filter(l => l.level === "error").length} Errors</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-400">{deliveryLogs.filter(l => l.level === "success").length} Success</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {deliveryLogs.filter(l => l.level === "warn").length} warnings recorded
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Probe Card if present */}
                    {testConnectionStatus && (
                      <div
                        className={`p-4 rounded-2xl border space-y-2 ${
                          testConnectionStatus.ok
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                            : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-2">
                            {testConnectionStatus.ok ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                            )}
                            Diagnostic Connection Probe: {testConnectionStatus.ok ? "PASSED" : "FAILED"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {testConnectionStatus.data?.code || ""}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed font-mono">
                          {testConnectionStatus.data?.error || testConnectionStatus.data?.message}
                        </p>
                        {testConnectionStatus.data?.troubleshooting && (
                          <div className="pt-1">
                            <span className="text-xs font-bold text-white">Suggested Fixes:</span>
                            <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1 mt-1 font-sans">
                              {testConnectionStatus.data.troubleshooting.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Filter Pills */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {["all", "error", "warn", "info", "success"].map((f) => {
                          const count = f === "all" ? deliveryLogs.length : deliveryLogs.filter((l) => l.level === f).length;
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setLogFilter(f)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                                logFilter === f
                                  ? "bg-amber-400 text-slate-950"
                                  : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                              }`}
                            >
                              {f} ({count})
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-xs text-slate-500">
                        Showing {deliveryLogs.filter((l) => (logFilter === "all" ? true : l.level === logFilter)).length} of {deliveryLogs.length} events
                      </span>
                    </div>

                    {/* Detailed Log Table */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                      {deliveryLogs.filter((l) => (logFilter === "all" ? true : l.level === logFilter)).length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-xs">
                          No logs found matching filter "{logFilter}". Click "Run Test Probe" or send an email to generate logs.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto font-mono text-xs">
                          {deliveryLogs
                            .filter((l) => (logFilter === "all" ? true : l.level === logFilter))
                            .map((entry) => {
                              const isExp = expandedLogId === entry.id;
                              return (
                                <div key={entry.id} className="p-3.5 hover:bg-slate-900/60 transition space-y-1.5">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2 flex-wrap">
                                      <span className="text-slate-500 text-[11px]">
                                        [{entry.timestamp}]
                                      </span>
                                      <span
                                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                          entry.level === "error"
                                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                            : entry.level === "warn"
                                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                            : entry.level === "success"
                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                            : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                        }`}
                                      >
                                        {entry.level}
                                      </span>
                                      <span className="text-amber-400 font-bold text-[11px]">
                                        [{entry.stage}]
                                      </span>
                                      <span className="text-slate-200 font-sans text-xs break-all">
                                        {entry.message}
                                      </span>
                                    </div>

                                    {entry.details && (
                                      <button
                                        type="button"
                                        onClick={() => setExpandedLogId(isExp ? null : entry.id)}
                                        className="text-xs text-sky-400 hover:text-sky-300 font-sans font-bold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                      >
                                        {isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        {isExp ? "Collapse" : "Inspect Payload"}
                                      </button>
                                    )}
                                  </div>

                                  {isExp && entry.details && (
                                    <div className="mt-2 p-3 rounded-xl bg-black/90 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
                                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 font-sans">
                                        <span>Diagnostic Object Payload</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(JSON.stringify(entry.details, null, 2));
                                            setCopiedLogId(entry.id);
                                            setTimeout(() => setCopiedLogId(null), 1500);
                                          }}
                                          className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          {copiedLogId === entry.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                          {copiedLogId === entry.id ? "Copied" : "Copy JSON"}
                                        </button>
                                      </div>
                                      <pre className="whitespace-pre-wrap">{JSON.stringify(entry.details, null, 2)}</pre>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* How Resend & Email Routing Works Guide */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                      <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                        <Info className="w-4 h-4 text-amber-400" />
                        Understanding Email Delivery & Resend API Architecture
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 leading-relaxed font-sans text-xs">
                        <div className="space-y-1.5">
                          <strong className="text-white block font-sans">1. Internal Staff Emails (@cleadglobal.org):</strong>
                          <p>
                            Internal communications to any colleague or yourself are automatically recorded in Firestore and delivered instantly to the recipient's Webmail Inbox with 100% reliability, requiring no external mail server.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <strong className="text-white block font-sans">2. External Internet Emails (Gmail, Yahoo, etc.):</strong>
                          <p>
                            To deliver directly to a recipient's personal inbox outside the system, the server relays through the Resend API. This requires <code className="text-amber-300 font-mono">RESEND_API_KEY</code> set in <code className="text-amber-300 font-mono">.env</code>.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <strong className="text-white block font-sans">3. Resend Free Sandbox Notice:</strong>
                          <p>
                            If you are using Resend on the free tier with <code className="text-amber-300 font-mono">onboarding@resend.dev</code>, Resend only permits sending test emails to the email address registered on your Resend account. To send to any external address, verify <code className="text-amber-300 font-mono">cleadglobal.org</code> at <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="text-sky-400 underline">resend.com/domains</a>.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <strong className="text-white block font-sans">4. Direct Gmail 1-Click Dispatch:</strong>
                          <p>
                            You can bypass all API requirements anytime by clicking the <strong>"Open & Send in Gmail (Web)"</strong> button when composing a message, which opens a pre-composed message in your personal Gmail.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : mailFolder === "compose" ? (
                  <form onSubmit={handleSendEmail} className="space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <PenSquare className="w-4 h-4 text-amber-400" />
                        New Message from {activeMailbox?.email}
                      </h3>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase">
                          To (Recipient Email or Staff) *
                        </label>
                        {staffEmails.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span>Quick fill:</span>
                            <select
                              onChange={(e) => {
                                if (e.target.value) setComposeTo(e.target.value);
                              }}
                              defaultValue=""
                              className="bg-slate-900 border border-slate-700 text-amber-300 px-2 py-0.5 rounded text-[11px] focus:outline-none"
                            >
                              <option value="" disabled>Select colleague...</option>
                              <option value="all@cleadglobal.org">All Staff (all@cleadglobal.org)</option>
                              {staffEmails.map((s) => (
                                <option key={s.id} value={s.email}>
                                  {s.fullName || s.name} ({s.email})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="colleague@cleadglobal.org or username"
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

                    {/* DELIVERY PROGRESS BAR & STEP TRACKER */}
                    {sendProgress && (
                      <div
                        className={`rounded-2xl p-4 border transition-all duration-300 ${
                          sendProgress.status === "error"
                            ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                            : sendProgress.status === "success"
                            ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                            : "bg-slate-950 border-amber-400/40 text-slate-200 shadow-lg shadow-amber-400/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {sendProgress.status === "in-progress" && (
                              <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                            )}
                            {sendProgress.status === "success" && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {sendProgress.status === "error" && (
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span className="text-xs font-black tracking-wide">
                              {sendProgress.stage}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                              sendProgress.status === "error"
                                ? "bg-rose-900/60 text-rose-300"
                                : sendProgress.status === "success"
                                ? "bg-emerald-900/60 text-emerald-300"
                                : "bg-amber-400/20 text-amber-300"
                            }`}
                          >
                            {sendProgress.percentage}%
                          </span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              sendProgress.status === "error"
                                ? "bg-rose-500"
                                : sendProgress.status === "success"
                                ? "bg-emerald-400"
                                : "bg-gradient-to-r from-amber-500 to-amber-300"
                            }`}
                            style={{ width: `${sendProgress.percentage}%` }}
                          />
                        </div>

                        {/* 4 Stage Pills */}
                        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-bold">
                          {[
                            { step: 1, label: "1. Auth Check" },
                            { step: 2, label: "2. Payload Prep" },
                            { step: 3, label: "3. Cloud DB Write" },
                            { step: 4, label: "4. Delivered" },
                          ].map((st) => {
                            const isDone = sendProgress.step > st.step || (sendProgress.step === st.step && sendProgress.status === "success");
                            const isCurrent = sendProgress.step === st.step;
                            const isFailed = sendProgress.status === "error" && sendProgress.errorStep === st.step;

                            return (
                              <div
                                key={st.step}
                                className={`px-2 py-1.5 rounded-lg flex flex-col items-center justify-center text-center transition ${
                                  isFailed
                                    ? "bg-rose-900/40 text-rose-300 border border-rose-500/50"
                                    : isDone
                                    ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                                    : isCurrent
                                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse"
                                    : "bg-slate-900/50 text-slate-500 border border-slate-800"
                                }`}
                              >
                                <span>{st.label}</span>
                                <span className="text-[9px] font-normal opacity-80 mt-0.5">
                                  {isFailed ? "Failed" : isDone ? "Complete" : isCurrent ? "Active" : "Pending"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Detailed Status or Diagnostic Error Message */}
                        <div className="mt-2.5 text-[11px] leading-relaxed">
                          {sendProgress.status === "error" ? (
                            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200">
                              <p className="font-bold flex items-center gap-1.5 text-rose-300">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Exact Point of Failure: Stage {sendProgress.errorStep}
                              </p>
                              <p className="mt-1 font-mono text-[10px] break-words text-rose-200/90">
                                {sendProgress.errorMessage}
                              </p>
                              <p className="mt-1.5 text-[10px] text-slate-400">
                                Tip: Verify that you are signed in, the recipient address is valid, and permissions are granted in Firestore rules.
                              </p>
                            </div>
                          ) : (
                            <p className="text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              {sendProgress.details}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DELIVERY VERIFICATION & ACTIONS PANEL */}
                    {lastSentResult && (
                      <div className="rounded-2xl p-4 bg-emerald-950/40 border border-emerald-500/40 space-y-3.5 shadow-xl">
                        <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                              Delivery Confirmed & Synced
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Sent #{lastSentResult.sentDocId.slice(0, 6)} • Inbox #{lastSentResult.inboxDocId.slice(0, 6)}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {lastSentResult.resendDispatched && (
                            <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white">Resend API Internet Relay:</strong> Successfully dispatched to public email servers (Resend ID: <span className="font-mono text-emerald-300">{lastSentResult.resendId}</span>).
                              </div>
                            </div>
                          )}

                          {lastSentResult.resendError && (
                            <div className="flex items-start gap-2 text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div className="text-[11px] leading-relaxed">
                                <strong className="text-white">Resend Relay Notice:</strong> {lastSentResult.resendError}
                                <span className="block text-slate-400 mt-0.5">
                                  Your message is safely recorded in the intranet cloud database. To send directly to external Gmail without an API key, use the 1-click Gmail button below.
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-white">Sent Outbox Archive:</strong> Recorded in{" "}
                              <span className="font-mono text-amber-300">{activeMailbox?.email}</span> Sent folder.
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-white">Recipient Webmail Inbox:</strong> Delivered directly to{" "}
                              <span className="font-mono text-emerald-300">{lastSentResult.recipient}</span> Inbox as unread message.
                            </div>
                          </div>
                        </div>

                        {/* External recipient explanation & dispatch bridge */}
                        {lastSentResult.recipientIsExternal && (
                          <div className="bg-slate-950/80 rounded-xl p-3 border border-amber-400/30 space-y-2 text-xs">
                            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              External Domain ({lastSentResult.recipient.split("@")[1] || "internet"})
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              This email has been registered in the CLG Webmail relay. For recipients on public services like Google Mail, click below to dispatch directly via your web Gmail account or device client:
                            </p>
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                  lastSentResult.recipient
                                )}&su=${encodeURIComponent(
                                  lastSentResult.subject
                                )}&body=${encodeURIComponent(lastSentResult.body)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 shadow transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open & Send in Gmail (Web)
                              </a>
                              <a
                                href={`mailto:${encodeURIComponent(
                                  lastSentResult.recipient
                                )}?subject=${encodeURIComponent(
                                  lastSentResult.subject
                                )}&body=${encodeURIComponent(lastSentResult.body)}`}
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 transition"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                Device Mail App
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Immediate Navigation Buttons */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {lastSentResult.isSentToSelf && (
                            <button
                              type="button"
                              onClick={() => {
                                setMailFolder("inbox");
                                setSelectedMessage(null);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition"
                            >
                              <Inbox className="w-3.5 h-3.5" />
                              View in Your Inbox Now
                            </button>
                          )}

                          {lastSentResult.recipientMailbox && !lastSentResult.isSentToSelf && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMailbox(lastSentResult.recipientMailbox);
                                setMailFolder("inbox");
                                setSelectedMessage(null);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition"
                            >
                              <Inbox className="w-3.5 h-3.5" />
                              Switch & View in {lastSentResult.recipientMailbox.email} Inbox
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setMailFolder("sent");
                              setSelectedMessage(null);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs inline-flex items-center gap-1.5 transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                            View in Sent Mail
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setLastSentResult(null);
                              setSendProgress(null);
                              setSendSuccessBanner("");
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white font-semibold text-xs transition ml-auto"
                          >
                            Compose Another Email
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2 flex-wrap">
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs inline-flex items-center gap-2 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSending ? "Sending Email..." : "Send Official Email"}
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
                      <button
                        type="button"
                        onClick={() => setShowLogConsole((prev) => !prev)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition ml-auto ${
                          showLogConsole
                            ? "bg-sky-950/60 border-sky-500/50 text-sky-300"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5 text-sky-400" />
                        {showLogConsole ? "Hide Error Logs" : "View Error Logs"}
                        {deliveryLogs.filter((l) => l.level === "error").length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-rose-500 text-white font-black animate-pulse">
                            {deliveryLogs.filter((l) => l.level === "error").length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* LIVE ERROR & DELIVERY LOG CONSOLE */}
                    {(showLogConsole || sendProgress?.status === "error") && (
                      <div className="rounded-2xl p-4 bg-slate-950 border border-slate-800 space-y-3 mt-4 shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-sky-400" />
                            <span className="text-xs font-black text-white uppercase tracking-wider">
                              Delivery & Error Logs Console
                            </span>
                            <span className={`w-2 h-2 rounded-full ${resendStatus?.configured ? "bg-emerald-400" : isCheckingStatus ? "bg-amber-400 animate-pulse" : "bg-rose-500"}`} />
                            <span className="text-[10px] font-mono text-slate-400">
                              Resend: {resendStatus?.configured ? `Key Active (${resendStatus.apiKeyMasked})` : isCheckingStatus ? "Checking..." : "Key Missing in Environment"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Filter pills */}
                            {["all", "error", "warn", "info"].map((f) => {
                              const count = f === "all" ? deliveryLogs.length : deliveryLogs.filter((l) => l.level === f).length;
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => setLogFilter(f)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                                    logFilter === f
                                      ? "bg-amber-400 text-slate-950"
                                      : "bg-slate-900 text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {f} ({count})
                                </button>
                              );
                            })}

                            <button
                              type="button"
                              onClick={handleTestConnection}
                              disabled={testConnectionStatus?.loading}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Activity className="w-3 h-3 text-sky-400" />
                              {testConnectionStatus?.loading ? "Testing..." : "Test Probe"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const logText = deliveryLogs
                                  .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.stage}] ${l.message} ${l.details ? JSON.stringify(l.details) : ""}`)
                                  .join("\n");
                                navigator.clipboard.writeText(logText);
                                setCopiedLogId("all");
                                setTimeout(() => setCopiedLogId(null), 2000);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              {copiedLogId === "all" ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" /> Copy Logs
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={clearDeliveryLogs}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 text-[10px] transition cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Test Probe Result Card if available */}
                        {testConnectionStatus && (
                          <div
                            className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                              testConnectionStatus.ok
                                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                                : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[11px]">
                              <span className="flex items-center gap-1.5">
                                {testConnectionStatus.ok ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                )}
                                Diagnostic Probe Result: {testConnectionStatus.ok ? "SUCCESS" : "FAILED"}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {testConnectionStatus.data?.code || ""}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              {testConnectionStatus.data?.error || testConnectionStatus.data?.message}
                            </p>
                            {testConnectionStatus.data?.troubleshooting && (
                              <ul className="list-disc pl-4 text-[10px] text-slate-300 space-y-0.5 mt-1 font-sans">
                                {testConnectionStatus.data.troubleshooting.map((tip, idx) => (
                                  <li key={idx}>{tip}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* Log Stream Terminal */}
                        <div className="bg-black/90 p-3 rounded-xl border border-slate-900 max-h-64 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                          {deliveryLogs
                            .filter((l) => (logFilter === "all" ? true : l.level === logFilter))
                            .length === 0 ? (
                            <div className="text-slate-500 text-center py-4">
                              No log entries recorded for filter "{logFilter}". Click "Test Probe" or send an email.
                            </div>
                          ) : (
                            deliveryLogs
                              .filter((l) => (logFilter === "all" ? true : l.level === logFilter))
                              .map((entry) => {
                                const isExp = expandedLogId === entry.id;
                                return (
                                  <div
                                    key={entry.id}
                                    className={`p-2 rounded-lg border transition ${
                                      entry.level === "error"
                                        ? "bg-rose-950/40 border-rose-900/60 text-rose-200"
                                        : entry.level === "warn"
                                        ? "bg-amber-950/30 border-amber-900/50 text-amber-200"
                                        : entry.level === "success"
                                        ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-200"
                                        : "bg-slate-900/40 border-slate-800 text-slate-300"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-1.5 flex-wrap">
                                        <span className="text-[10px] text-slate-500 select-none">
                                          [{entry.timestamp}]
                                        </span>
                                        <span
                                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded select-none ${
                                            entry.level === "error"
                                              ? "bg-rose-600 text-white"
                                              : entry.level === "warn"
                                              ? "bg-amber-500 text-slate-950"
                                              : entry.level === "success"
                                              ? "bg-emerald-600 text-white"
                                              : "bg-sky-600 text-white"
                                          }`}
                                        >
                                          {entry.level}
                                        </span>
                                        <span className="text-amber-300/80 text-[10px]">
                                          [{entry.stage}]
                                        </span>
                                        <span className="break-all">{entry.message}</span>
                                      </div>

                                      {entry.details && (
                                        <button
                                          type="button"
                                          onClick={() => setExpandedLogId(isExp ? null : entry.id)}
                                          className="text-[10px] text-sky-400 hover:text-sky-300 shrink-0 font-sans font-bold flex items-center gap-0.5"
                                        >
                                          {isExp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                          {isExp ? "Hide" : "Details"}
                                        </button>
                                      )}
                                    </div>

                                    {isExp && entry.details && (
                                      <pre className="mt-2 p-2 rounded bg-black border border-slate-800 text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                        {JSON.stringify(entry.details, null, 2)}
                                      </pre>
                                    )}
                                  </div>
                                );
                              })
                          )}
                        </div>

                        {/* Troubleshooting & Direct Alternative Callout */}
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                            <Info className="w-3.5 h-3.5" />
                            How to Resolve External Email Delivery:
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 leading-relaxed font-sans">
                            <li>
                              <strong className="text-slate-200">1. Server Environment (.env):</strong> Ensure you have <code className="text-amber-300 font-mono">RESEND_API_KEY=re_...</code> in your <code className="text-amber-300 font-mono">.env</code> file.
                            </li>
                            <li>
                              <strong className="text-slate-200">2. Free Resend Sandbox Limitation:</strong> On Resend's free tier without a custom domain, emails sent through the test domain can only be sent to your registered account email. To send to any Gmail address, verify <code className="text-amber-300 font-mono">cleadglobal.org</code> at <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="text-sky-400 underline">resend.com/domains</a>.
                            </li>
                            <li>
                              <strong className="text-slate-200">3. Instant 1-Click Alternative:</strong> You can send directly using your personal/staff Gmail client by clicking the <strong>"Open & Send in Gmail (Web)"</strong> button above.
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
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
                        <Clock className="w-3.5 h-3.5" /> {formatMsgDate(selectedMessage.date || selectedMessage.receivedAt)}
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
                            onClick={() => {
                              setSelectedMessage(msg);
                              if (!msg.read && msg.id) {
                                updateDoc(doc(db, "messages", msg.id), { read: true }).catch(console.error);
                              }
                            }}
                            className={`w-full text-left py-3.5 px-3 hover:bg-slate-800/40 rounded-xl transition flex items-start justify-between gap-4 ${
                              !msg.read && mailFolder === "inbox"
                                ? "bg-amber-400/5 border-l-2 border-amber-400"
                                : ""
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {!msg.read && mailFolder === "inbox" && (
                                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unread Message" />
                                )}
                                <span className={`text-sm truncate ${!msg.read && mailFolder === "inbox" ? "font-black text-white" : "font-bold text-slate-200"}`}>
                                  {mailFolder === "sent"
                                    ? `To: ${msg.to}`
                                    : msg.fromName || msg.from}
                                </span>
                                <span className="text-[11px] font-mono text-amber-400/90">
                                  {mailFolder === "sent" ? "" : `<${msg.from}>`}
                                </span>
                              </div>
                              <div className={`text-xs mt-0.5 truncate ${!msg.read && mailFolder === "inbox" ? "font-bold text-amber-300" : "font-semibold text-slate-300"}`}>
                                {msg.subject}
                              </div>
                              <div className="text-xs text-slate-400 truncate mt-0.5">
                                {msg.body}
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                              {formatMsgDate(msg.date || msg.receivedAt)}
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
      <Footer />
    </div>
  );
}
