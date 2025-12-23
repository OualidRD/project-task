import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import {
  WbSunny,
  Nightlight,
  BarChart,
  People,
  AutoAwesome,
  Rocket,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { AnimatedCounter } from '../components/AnimatedCounter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Rocket sx={{ fontSize: 45 }} />,
    title: 'Lightning Fast',
    description: 'Optimized performance to keep you productive and focused on what matters.',
  },
  {
    icon: <BarChart sx={{ fontSize: 45 }} />,
    title: 'Analytics & Insights',
    description: 'Track your progress with beautiful charts and actionable insights.',
  },
  {
    icon: <People sx={{ fontSize: 45 }} />,
    title: 'Team Collaboration',
    description: 'Share projects and collaborate seamlessly with your team members.',
  },
  {
    icon: <AutoAwesome sx={{ fontSize: 45 }} />,
    title: 'Smart Organization',
    description: 'Intelligent task management to keep your workflow organized.',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const isDark = mode === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const accentBorder = isDark ? '#334155' : '#e0f2fe';

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        color: textColor,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Floating orb 1 */}
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: isDark
              ? 'radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />

        {/* Floating orb 2 */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: '400px',
            height: '400px',
            background: isDark
              ? 'radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(118,75,162,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
          }}
        />

        {/* Floating orb 3 */}
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '-100px',
            width: '350px',
            height: '350px',
            background: isDark
              ? 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(102,126,234,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(45px)',
          }}
        />
      </Box>

      {/* Content wrapper with higher z-index */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 100 }}
      >
        <Box
          sx={{
            py: 2.5,
            px: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isDark
              ? 'rgba(15, 23, 42, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            borderBottom: `1.5px solid ${accentBorder}`,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                cursor: 'pointer',
                letterSpacing: -0.7,
                fontSize: '1.4rem',
              }}
              onClick={() => navigate('/')}
            >
              TaskFlow
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 20 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: isDark ? '#fbbf24' : '#3b82f6',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  },
                }}
              >
                {isDark ? (
                  <WbSunny sx={{ fontSize: 22 }} />
                ) : (
                  <Nightlight sx={{ fontSize: 22 }} />
                )}
              </IconButton>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    borderColor: '#667eea',
                    bgcolor: isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)',
                  },
                }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  px: 3.5,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                }}
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </motion.div>
          </Box>
        </Box>
      </motion.div>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 12, md: 14 }, mt: { xs: 10, md: 10 }, position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    lineHeight: 1.15,
                    fontSize: { xs: '2.2rem', md: '3.8rem' },
                    letterSpacing: -1.5,
                  }}
                >
                  Organize Tasks{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    With Precision
                  </Box>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 5,
                    opacity: 0.75,
                    fontSize: { xs: '1.05rem', md: '1.3rem' },
                    fontWeight: 500,
                    lineHeight: 1.7,
                  }}
                >
                  Enterprise-grade task management designed for teams. Collaborate, organize, and achieve goals faster than ever.
                </Typography>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex gap-4"
                style={{ display: 'flex', gap: '1.2rem', marginBottom: '3rem' }}
              >
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      py: 1.8,
                      px: 4.5,
                      boxShadow: '0 12px 32px rgba(102, 126, 234, 0.35)',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      '&:hover': {
                        boxShadow: '0 16px 48px rgba(102, 126, 234, 0.45)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Start Free Trial
                  </Button>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      py: 1.8,
                      px: 4.5,
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>

              {/* Dynamic Stats */}
              <motion.div variants={itemVariants}>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={4}>
                    <AnimatedCounter target={1000} label="Active Teams" suffix="+" />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <AnimatedCounter target={50000} label="Tasks Completed" suffix="+" />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <AnimatedCounter target={99} label="Uptime" suffix="%" />
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>

            {/* Hero Visual - Larger Dynamic Cards */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '360px', perspective: '1200px' }}>
                <Box sx={{ position: 'relative', width: '100%', height: '360px' }}>
                  {/* Card 1 - Shimmer Lines (Top Center) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 3,
                    }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -12, 0],
                        rotateX: [0, 3, 0],
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 3.5,
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%)'
                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.06) 100%)',
                          border: `2px solid ${accentBorder}`,
                          borderRadius: 4,
                          backdropFilter: 'blur(12px)',
                          boxShadow: isDark
                            ? '0 20px 60px rgba(102, 126, 234, 0.25)'
                            : '0 20px 60px rgba(102, 126, 234, 0.15)',
                          width: '240px',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                              }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.2,
                              }}
                              style={{
                                height: i === 1 ? '10px' : i === 2 ? '14px' : '10px',
                                borderRadius: '5px',
                                background: `linear-gradient(90deg, 
                                  ${isDark ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.25)'} 0%, 
                                  ${isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)'} 50%, 
                                  ${isDark ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.25)'} 100%)`,
                                backgroundSize: '200% 100%',
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </motion.div>
                  </motion.div>

                  {/* Card 2 - Bar Chart (Bottom Left) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: '0px',
                      zIndex: 2,
                    }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotateX: [0, -2, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(118, 75, 162, 0.15) 0%, rgba(102, 126, 234, 0.12) 100%)'
                            : 'linear-gradient(135deg, rgba(118, 75, 162, 0.08) 0%, rgba(102, 126, 234, 0.06) 100%)',
                          border: `2px solid ${accentBorder}`,
                          borderRadius: 4,
                          backdropFilter: 'blur(12px)',
                          boxShadow: isDark
                            ? '0 20px 60px rgba(118, 75, 162, 0.25)'
                            : '0 20px 60px rgba(118, 75, 162, 0.15)',
                          width: '220px',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: '100px' }}>
                          {[65, 85, 60, 90, 75].map((height, i) => (
                            <motion.div
                              key={i}
                              animate={{ scaleY: [0.4, 1, 0.4] }}
                              transition={{
                                duration: 2.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.12,
                              }}
                              style={{
                                flex: 1,
                                height: `${height}%`,
                                borderRadius: '4px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                transformOrigin: 'bottom',
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </motion.div>
                  </motion.div>

                  {/* Card 3 - Data Dots Network (Bottom Right) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      right: '0px',
                      zIndex: 1,
                    }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -14, 0],
                        rotateX: [0, 2, 0],
                      }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2.5,
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.05) 100%)',
                          border: `2px solid ${accentBorder}`,
                          borderRadius: 4,
                          backdropFilter: 'blur(12px)',
                          boxShadow: isDark
                            ? '0 20px 60px rgba(102, 126, 234, 0.2)'
                            : '0 20px 60px rgba(102, 126, 234, 0.1)',
                          width: '200px',
                          height: '200px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <svg
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                          }}
                          viewBox="0 0 200 200"
                        >
                          <line x1="50" y1="50" x2="100" y2="100" stroke="#667eea" strokeWidth="1.5" />
                          <line x1="100" y1="100" x2="150" y2="120" stroke="#667eea" strokeWidth="1.5" />
                          <line x1="150" y1="120" x2="170" y2="50" stroke="#667eea" strokeWidth="1.5" />
                        </svg>
                        {[
                          { top: '25%', left: '20%' },
                          { top: '50%', left: '55%' },
                          { top: '75%', left: '75%' },
                          { top: '35%', left: '85%' },
                        ].map((pos, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: i * 0.25,
                            }}
                            style={{
                              position: 'absolute',
                              top: pos.top,
                              left: pos.left,
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#667eea',
                              boxShadow: '0 0 16px rgba(102, 126, 234, 0.6)',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        ))}
                      </Paper>
                    </motion.div>
                  </motion.div>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          py: 14,
          background: isDark
            ? 'linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.06) 100%)'
            : 'linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.03) 100%)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '2.8rem' },
                letterSpacing: -1,
              }}
            >
              Powerful Features
            </Typography>

            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 10,
                opacity: 0.7,
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Everything you need to manage your tasks efficiently
            </Typography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    whileHover={{ y: -16, transition: { duration: 0.3 } }}
                  >
                    <Paper
                      sx={{
                        p: 4.5,
                        height: '100%',
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
                          : 'linear-gradient(135deg, rgba(240, 249, 255, 0.8) 0%, rgba(240, 249, 255, 0.6) 100%)',
                        border: `2px solid ${accentBorder}`,
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '1.5px',
                          background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                          borderColor: '#667eea',
                          '&::before': {
                            opacity: 1,
                          },
                          boxShadow: isDark
                            ? '0 24px 60px rgba(102, 126, 234, 0.35)'
                            : '0 24px 60px rgba(102, 126, 234, 0.25)',
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(30, 41, 59, 0.8) 100%)'
                            : 'linear-gradient(135deg, rgba(240, 249, 255, 1) 0%, rgba(240, 249, 255, 0.8) 100%)',
                        },
                      }}
                    >
                      <motion.div
                        initial={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          color: '#667eea',
                          marginBottom: '1.8rem',
                          display: 'flex',
                          justifyContent: 'center',
                          fontSize: '2.8rem',
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          textAlign: 'center',
                          fontSize: '1.15rem',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.7,
                          textAlign: 'center',
                          lineHeight: 1.8,
                          fontWeight: 500,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 14,
          background: isDark
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.06) 100%)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    letterSpacing: -1,
                  }}
                >
                  Ready to Get Started?
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.7,
                    mb: 5,
                    fontWeight: 500,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  Join thousands of teams using TaskFlow to manage their projects efficiently.
                </Typography>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    py: 2.2,
                    px: 7,
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.35)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(102, 126, 234, 0.45)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate('/signup')}
                >
                  Start Your Free Trial
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 8,
          borderTop: `1.5px solid ${accentBorder}`,
          textAlign: 'center',
          opacity: 0.65,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          © 2025 TaskFlow. Built for teams. All rights reserved.
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};
