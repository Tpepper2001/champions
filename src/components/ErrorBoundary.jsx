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
        <div className="min-h-screen bg-slate-950 text-white p-8">
          <h1 className="text-2xl font-bold text-rose-500">Component Render Error</h1>
          <pre className="mt-4 p-4 bg-slate-900 rounded font-mono text-sm">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
