import React, { ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 ErrorBoundary caught an error:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Component Stack:', errorInfo.componentStack);
    
    // Log specific error types for debugging
    if (error.message.includes('Element type is invalid')) {
      console.error('   → Issue: Invalid React component - likely a missing export or import mismatch');
      console.error('   → Check: react-toastify, LoadingOverlay, or custom component exports');
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Full page reload to clear any cached state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                textAlign: 'center',
                padding: 4,
                borderRadius: '16px',
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid #334155',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: '#ef4444',
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: '#f1f5f9',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Oops! Something went wrong
              </Typography>
              <Typography
                sx={{
                  color: '#cbd5e1',
                  fontSize: '0.95rem',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                An unexpected error occurred in the application. This might be a temporary issue.
              </Typography>
              {this.state.error && (
                <Box
                  sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: 2,
                    borderRadius: '8px',
                    mb: 3,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#fca5a5',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      textAlign: 'left',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.message}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={this.handleReset}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                    px: 4,
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 700,
                    px: 4,
                  }}
                >
                  Refresh Page
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
