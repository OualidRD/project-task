import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = 'Processing...' 
}) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: 4,
          borderRadius: '16px',
          backgroundColor: 'rgba(30, 41, 59, 0.98)',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.3s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'scale(0.95)' },
            to: { opacity: 1, transform: 'scale(1)' },
          },
        }}
      >
        <CircularProgress
          size={50}
          sx={{
            color: '#667eea',
          }}
        />
        <Typography
          sx={{
            color: '#f1f5f9',
            fontWeight: 600,
            fontSize: '1rem',
            textAlign: 'center',
            minWidth: 200,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingOverlay;
