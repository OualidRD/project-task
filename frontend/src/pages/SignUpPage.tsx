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

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const { mode } = useThemeMode();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const isDark = mode === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setLocalError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.fullName, formData.email, formData.password, formData.confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setLocalError('Sign up failed. Please try again.');
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
                  Create Account
                </Typography>
                <Typography
                  sx={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                >
                  Join TaskFlow to manage projects efficiently
                </Typography>
              </Box>

              {/* Error Alert */}
              {(localError || error) && (
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
                    {localError || error}
                  </Alert>
                </motion.div>
              )}

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
              >
                {/* Full Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <TextField
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
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

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
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

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                  transition={{ duration: 0.4, delay: 0.3 }}
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
                    {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
                  </Button>
                </motion.div>
              </Box>

              {/* Sign In Link */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? '#cbd5e1' : '#64748b',
                    fontWeight: 500,
                  }}
                >
                  Already have an account?{' '}
                  <Link
                    onClick={() => navigate('/login')}
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
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};
