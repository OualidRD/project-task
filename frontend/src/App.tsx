  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { ThemeProvider, createTheme } from '@mui/material/styles';
  import CssBaseline from '@mui/material/CssBaseline';
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  import { ErrorBoundary } from './components/ErrorBoundary';
  import { AuthProvider, useAuth } from './context/AuthContext';
  import { ThemeProvider as CustomThemeProvider, useThemeMode } from './context/ThemeContext';
  import { ProtectedRoute } from './components/ProtectedRoute';
  import { LoginPage } from './pages/LoginPage';
  import { SignUpPage } from './pages/SignUpPage';
  import { LandingPage } from './pages/LandingPage';
  import { DashboardPage } from './pages/DashboardPage';
  import { ProjectsPage } from './pages/ProjectsPage';
  import { ProjectDetailPage } from './pages/ProjectDetailPage';

  const AppContent = () => {
    const { mode } = useThemeMode();
    const { isAuthenticated } = useAuth();

    const theme = createTheme({
      palette: {
        mode: mode || 'dark',
        primary: {
          main: '#667eea',
        },
        secondary: {
          main: '#764ba2',
        },
        background: {
          default: mode === 'dark' ? '#0f172a' : '#ffffff',
          paper: mode === 'dark' ? '#1e293b' : '#f8fafc',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/login" element={<LoginPage />} />          <Route path="/signup" element={<SignUpPage />} />          <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            pauseOnHover={true}
            draggable={true}
          />
      </ThemeProvider>
    );
  };

  function App() {
    return (
      <ErrorBoundary>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <CustomThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </CustomThemeProvider>
        </Router>
      </ErrorBoundary>
    );
  }

  export default App;
