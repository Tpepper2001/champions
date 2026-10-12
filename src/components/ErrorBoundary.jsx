import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
            <h1 className="text-2xl font-bold text-rose-400">Component Render Error</h1>
            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = "";
                  window.location.href = "/";
                }}
                className="px-4 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition"
              >
                Return to Home
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-700 transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
