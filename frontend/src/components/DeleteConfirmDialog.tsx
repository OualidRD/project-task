import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          borderRadius: '16px',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DeleteIcon sx={{ color: '#ef4444', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
            >
              {title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {description && (
            <Typography
              sx={{
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {description}
            </Typography>
          )}
          <Typography
            sx={{
              color: isDark ? '#cbd5e1' : '#475569',
              fontSize: '0.9rem',
              mt: description ? 2 : 0,
            }}
          >
            This action cannot be undone. Please confirm to proceed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1.5, p: 2 }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1 }}
          >
            <Button
              onClick={onCancel}
              disabled={isLoading}
              fullWidth
              variant="outlined"
              sx={{
                borderColor: isDark ? '#475569' : '#cbd5e1',
                color: isDark ? '#cbd5e1' : '#475569',
                fontWeight: 700,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.95rem',
                py: 1.2,
                '&:hover': {
                  borderColor: isDark ? '#64748b' : '#94a3b8',
                  backgroundColor: isDark
                    ? 'rgba(100, 116, 139, 0.1)'
                    : 'rgba(203, 213, 225, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1 }}
          >
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.95rem',
                py: 1.2,
                transition: 'all 0.3s ease',
                '&:hover:not(:disabled)': {
                  boxShadow: '0 12px 24px rgba(239, 68, 68, 0.3)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              Delete
            </Button>
          </motion.div>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};
