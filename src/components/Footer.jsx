import React from "react";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-800 bg-slate-950 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
        <Mail className="w-3.5 h-3.5" />
        <span>Champions Leadership Global Mail System</span>
        <span className="text-slate-700">|</span>
        <span>Managed by Tpeps Technologies</span>
      </div>
    </footer>
  );
}
