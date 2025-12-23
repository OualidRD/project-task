import React from 'react';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { SearchOutlined as SearchIcon, FilterListOutlined as FilterIcon, ClearOutlined as ClearIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SmartFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: { label: string; value: string; active: boolean }[];
  onFilterToggle: (value: string) => void;
  isDark: boolean;
}

export const SmartTaskFilter: React.FC<SmartFilterProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterToggle,
  isDark,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 3,
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar - Wider */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: '1 1 auto',
            minWidth: '350px',
            padding: '10px 16px',
            borderRadius: '10px',
            background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.6)',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
            },
            '&:focus-within': {
              border: `1px solid #667eea`,
              boxShadow: '0 0 12px rgba(102, 126, 234, 0.2)',
            },
          }}
        >
          <SearchIcon
            sx={{
              color: isDark ? '#94a3b8' : '#64748b',
              fontSize: '1.2rem',
            }}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: isDark ? '#f1f5f9' : '#0f172a',
              outline: 'none',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <Tooltip title="Clear search">
              <IconButton
                size="small"
                onClick={() => onSearchChange('')}
                sx={{
                  color: isDark ? '#94a3b8' : '#64748b',
                  '&:hover': {
                    color: '#667eea',
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Smart Filters */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {filters.map((filter) => (
            <motion.div
              key={filter.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Chip
                label={filter.label}
                onClick={() => onFilterToggle(filter.value)}
                icon={<FilterIcon />}
                variant={filter.active ? 'filled' : 'outlined'}
                size="small"
                sx={{
                  background: filter.active
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'transparent',
                  border: filter.active
                    ? 'none'
                    : `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                  color: filter.active ? '#ffffff' : isDark ? '#cbd5e1' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: filter.active
                      ? '0 8px 16px rgba(102, 126, 234, 0.3)'
                      : `0 4px 8px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
                  },
                }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};
