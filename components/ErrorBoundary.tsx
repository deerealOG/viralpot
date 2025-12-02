import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

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
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Oops! Something went wrong
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            {/* Error details (dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button fullWidth onClick={this.handleReload}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <Button fullWidth variant="secondary" onClick={this.handleReset}>
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>

            {/* Help text */}
            <p className="text-xs text-slate-500">
              If this problem persists, try clearing your browser cache or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
