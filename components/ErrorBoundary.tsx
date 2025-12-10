import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleHardReset = () => {
    try {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    } catch (e) {
        console.error("Failed to clear data", e);
        window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tighter">TEMPORARY GLITCH</h1>
            <p className="text-zinc-400 max-w-md mb-8 text-sm leading-relaxed">
                Even Kings face obstacles. The app encountered an unexpected error.
            </p>
            
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg"
                >
                    Try Reloading
                </button>
                <button 
                    onClick={this.handleHardReset}
                    className="bg-zinc-800 text-red-400 border border-zinc-700 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors text-xs"
                >
                    Factory Reset App
                </button>
            </div>

            {this.state.error && (
                <div className="mt-8 p-4 bg-black/50 rounded-lg text-left max-w-lg w-full overflow-auto max-h-40 border border-zinc-800">
                    <p className="text-[10px] font-mono text-zinc-500 break-words">Error Details: {this.state.error.toString()}</p>
                </div>
            )}
        </div>
      );
    }

    return this.props.children;
  }
}