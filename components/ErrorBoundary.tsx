"use client"

import React, { ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
          <p className="mb-4">申し訳ありませんが、問題が発生しました。</p>
          {this.state.error && (
            <p className="mb-4 text-red-500">{this.state.error.message}</p>
          )}
          <Button onClick={() => this.setState({ hasError: false, error: null })}>
            再試行
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary