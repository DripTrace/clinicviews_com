// components/SipErrorBoundary.tsx
import React, { ErrorInfo, ReactNode } from "react";

interface SipErrorBoundaryProps {
    children: ReactNode;
}

interface SipErrorBoundaryState {
    hasError: boolean;
}

class SipErrorBoundary extends React.Component<
    SipErrorBoundaryProps,
    SipErrorBoundaryState
> {
    constructor(props: SipErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): SipErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default SipErrorBoundary;
