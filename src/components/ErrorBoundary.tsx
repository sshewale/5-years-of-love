// ─── ErrorBoundary ─────────────────────────────────────────────────────────
// Catches rendering errors in any child page and shows a graceful fallback
// instead of a blank white screen.

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
          style={{ backgroundColor: '#F5ECD7' }}
          role="alert"
          aria-live="assertive"
        >
          <div className="text-6xl mb-6" aria-hidden="true">💔</div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: '#B76E79' }}
          >
            Something went wrong
          </h1>
          <p
            className="text-base mb-8 max-w-sm"
            style={{ color: '#78716c', fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
          >
            Don't worry — our love story is still intact. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl font-medium text-white transition-transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #B76E79, #a55f6a)',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 16px rgba(183,110,121,0.35)',
            }}
          >
            Refresh Page ❤️
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
