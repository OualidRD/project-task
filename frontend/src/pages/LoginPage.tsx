import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { ProfessionalNavbar } from '../components/ProfessionalNavbar';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const { mode } = useThemeMode();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [localError, setLocalError] = useState('');

  const isDark = mode === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Navigation */}
      <ProfessionalNavbar />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              sx={{
                p: { xs: 4, sm: 5 },
                background: cardBg,
                border: `1px solid ${borderColor}`,
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
              }}
              elevation={0}
            >
              {/* Header */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    mb: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  sx={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                >
                  Sign in to your TaskFlow account
                </Typography>
              </Box>

              {/* Error Alert */}
              {(error || localError) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                      color: isDark ? '#fca5a5' : '#dc2626',
                      border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'}`,
                      borderRadius: '12px',
                    }}
                  >
                    {error || localError}
                  </Alert>
                </motion.div>
              )}

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
              >
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: inputBg,
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: isDark ? '#334155' : '#f1f5f9',
                        },
                        '&.Mui-focused': {
                          bgcolor: isDark ? '#1e293b' : '#f8fafc',
                          '& fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                      },
                    }}
                  />
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: inputBg,
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: isDark ? '#334155' : '#f1f5f9',
                        },
                        '&.Mui-focused': {
                          bgcolor: isDark ? '#1e293b' : '#f8fafc',
                          '& fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                      },
                    }}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      py: 1.6,
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover:not(:disabled)': {
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
                  </Button>
                </motion.div>
              </Box>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? '#cbd5e1' : '#64748b',
                    fontWeight: 500,
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    onClick={() => navigate('/signup')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    Create Account
                  </Link>
                </Typography>
              </Box>
            </Paper>

            {/* Demo Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box
                sx={{
                  mt: 3.5,
                  p: 3,
                  bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                  borderRadius: '12px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    fontWeight: 700,
                    mb: 1,
                    fontSize: '0.9rem',
                  }}
                >
                  Demo Account
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                  }}
                >
                  test@example.com / password123
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};
