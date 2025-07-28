import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@bookmark-pro/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Extension Error Boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    // Chrome Extension에서는 popup을 다시 로드
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-80 h-60 flex flex-col items-center justify-center bg-white p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                오류가 발생했습니다
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                예상치 못한 오류가 발생했습니다.
                <br />
                다시 시도해 주세요.
              </p>
            </div>

            <Button
              onClick={this.handleReload}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-xs text-gray-500 max-w-full">
                <summary className="cursor-pointer">오류 상세 정보</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}