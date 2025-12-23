import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  WbSunny,
  Nightlight,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface ProfessionalNavbarProps {
  showUserMenu?: boolean;
  onLogout?: () => void;
}

export const ProfessionalNavbar: React.FC<ProfessionalNavbarProps> = ({
  showUserMenu = false,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isDark = mode === 'dark';
  const bgColor = isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const accentBorder = isDark ? '#334155' : '#e0f2fe';
  const boxShadow = isDark
    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
    : '0 4px 20px rgba(0, 0, 0, 0.05)';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
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
          background: bgColor,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${accentBorder}`,
          boxShadow: boxShadow,
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: -0.5,
              fontSize: '1.35rem',
              fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            }}
          >
            TaskFlow
          </Typography>
        </motion.div>

        {/* Right Side Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.15, rotate: 20 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDark ? '#fbbf24' : '#667eea',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(102, 126, 234, 0.1)',
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

          {/* User Menu */}
          {showUserMenu && user && (
            <>
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    },
                  }}
                >
                  {(user.fullName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </IconButton>
              </motion.div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    background: isDark
                      ? 'rgba(30, 41, 59, 0.95)'
                      : 'rgba(248, 250, 252, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    mt: 1,
                  },
                }}
              >
                <MenuItem disabled sx={{ opacity: 0.6 }}>
                  <Typography variant="caption">
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    '&:hover': {
                      background: isDark
                        ? 'rgba(102, 126, 234, 0.2)'
                        : 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};
