import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface AdvancedCircularProgressProps {
  value: number;
  total?: number;
  label?: string;
  size?: number;
  completed?: number;
}

export const AdvancedCircularProgress: React.FC<AdvancedCircularProgressProps> = ({
  value,
  total = 100,
  size = 120,
  completed,
}) => {
  const percentage = Math.round((value / total) * 100);
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background circle */}
        <svg
          style={{
            position: 'absolute',
            width: size,
            height: size,
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Base circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.3))' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {percentage}%
          </Typography>
          {completed !== undefined && (
            <Typography
              variant="caption"
              sx={{
                color: '#22c55e',
                fontWeight: 600,
                fontSize: '0.65rem',
                mt: 0.3,
              }}
            >
              {completed}/{value}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};
