import { Component, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  fallback: (m: string) => ReactNode;
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: null
    };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: (error as Error).message || 'Error'
    };
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.message || 'Error');
    }

    return this.props.children;
  }
}
