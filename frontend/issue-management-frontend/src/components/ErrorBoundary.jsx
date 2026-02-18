import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error && this.state.error.message ? this.state.error.message : String(this.state.error)
      return (
        <div style={{ padding: 20 }}>
          <h2 style={{ color: 'darkred' }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#111' }}>{msg}</pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
