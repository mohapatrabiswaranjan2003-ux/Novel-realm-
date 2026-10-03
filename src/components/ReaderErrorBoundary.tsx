import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, BookOpen, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  onBackToLibrary?: () => void;
  onGoToFirstChapter?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ReaderErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ReaderErrorBoundary caught an error in ReaderView:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Unable to Render Chapter
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                An unexpected error prevented this chapter from displaying properly. Your reading progress has been preserved.
              </p>
              {this.state.error?.message && (
                <div className="text-xs bg-slate-950 text-red-300/80 font-mono p-3 rounded-lg border border-red-900/30 text-left overflow-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-98"
              >
                <RotateCw className="w-4 h-4" />
                Retry Chapter
              </button>

              {this.props.onGoToFirstChapter && (
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                    this.props.onGoToFirstChapter?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60 rounded-xl text-sm font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  Jump to Chapter 1
                </button>
              )}

              {this.props.onBackToLibrary && (
                <button
                  type="button"
                  onClick={this.props.onBackToLibrary}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Library
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
