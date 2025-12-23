import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedStatProps {
  endValue: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({ 
  endValue, 
  label, 
  suffix = '', 
  duration = 2 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const increment = endValue / (duration * 60); // 60 fps
    let animationFrameId: number;

    const animate = () => {
      startValue += increment;
      if (startValue < endValue) {
        setCount(Math.floor(startValue));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          {count.toLocaleString()}{suffix}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};
