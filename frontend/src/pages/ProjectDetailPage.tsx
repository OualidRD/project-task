import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { AddOutlined as AddIcon, DeleteOutline as DeleteIcon, CheckCircleOutline as CheckIcon, EditOutlined as EditIcon } from '@mui/icons-material';
import { useToast } from '../hooks/useToast';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import LoadingOverlay from '../components/LoadingOverlay';
import { SmartTaskFilter } from '../components/SmartTaskFilter';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ProfessionalNavbar } from '../components/ProfessionalNavbar';
import { useThemeMode } from '../context/ThemeContext';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
}

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { mode } = useThemeMode();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null as any,
  });
  const [progress, setProgress] = useState({ totalTasks: 0, completedTasks: 0, progressPercentage: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10; // Fixed number of rows per page
  const [deleteProjectConfirmOpen, setDeleteProjectConfirmOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({ title: '', description: '' });
  const [filters, setFilters] = useState([
    { label: 'Completed', value: 'completed', active: false },
    { label: 'Pending', value: 'pending', active: false },
  ]);

  // Filter tasks based on search query and status filters
  const getFilteredTasks = () => {
    let filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply status filters
    const activeFilters = filters.filter(f => f.active);
    if (activeFilters.length > 0) {
      filtered = filtered.filter((task) => {
        const today = new Date();
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < today && !task.isCompleted;

        return activeFilters.some(filter => {
          if (filter.value === 'completed') return task.isCompleted;
          if (filter.value === 'pending') return !task.isCompleted && !isOverdue;
          return false;
        });
      });
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const paginatedTasks = filteredTasks.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const isDark = mode === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.6)';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const tableBg = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)';

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      const projectId_ = parseInt(projectId!);
      const [projectData, tasksData, progressData] = await Promise.all([
        projectService.getProject(projectId_),
        taskService.getTasks(projectId_, 0, 100),
        taskService.getProgress(projectId_),
      ]);

      setProject(projectData);
      setTasks(tasksData.content);
      setProgress(progressData);
    } catch {
      showToast('Failed to load project details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterToggle = (filterValue: string) => {
    setFilters(filters.map(f => 
      f.value === filterValue ? { ...f, active: !f.active } : f
    ));
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', dueDate: null });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', dueDate: null });
  };

  const handleSaveTask = async () => {
    if (!formData.title.trim()) {
      showToast('Task title is required', 'warning');
      return;
    }

    try {
      setIsActionLoading(true);
      const projectId_ = parseInt(projectId!);
      const isEditing = !!editingTask;
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? formData.dueDate.format('YYYY-MM-DD') : undefined,
      };

      if (editingTask) {
        await taskService.updateTask(projectId_, editingTask.id, taskData);
      } else {
        await taskService.createTask(projectId_, taskData);
      }
      
      handleCloseDialog();
      await loadProjectData();
      
      // Show toast AFTER everything is loaded
      showToast(
        isEditing ? '✓ Task updated successfully' : '✓ Task created successfully',
        'success'
      );
    } catch (error) {
      console.error('Error saving task:', error);
      showToast('✗ Failed to save task', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      setIsActionLoading(true);
      const projectId_ = parseInt(projectId!);
      await taskService.completeTask(projectId_, taskId);
      showToast('✓ Task completed! 🎉', 'success');
      await loadProjectData();
    } catch (error) {
      console.error('Error completing task:', error);
      showToast('✗ Failed to complete task', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setIsActionLoading(true);
      const projectId_ = parseInt(projectId!);
      await taskService.deleteTask(projectId_, taskToDelete);
      showToast('✓ Task deleted successfully', 'success');
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      await loadProjectData();
    } catch {
      showToast('✗ Failed to delete task', 'error');
      setDeleteConfirmOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditProject = () => {
    if (project) {
      setProjectFormData({ title: project.title, description: project.description });
      setEditProjectDialogOpen(true);
    }
  };

  const handleSaveProject = async () => {
    if (!projectFormData.title.trim()) {
      showToast('Project title is required', 'warning');
      return;
    }

    try {
      setIsActionLoading(true);
      const projectId_ = parseInt(projectId!);
      await projectService.updateProject(projectId_, projectFormData);
      setEditProjectDialogOpen(false);
      await loadProjectData();
      showToast('✓ Project updated successfully', 'success');
    } catch (error) {
      console.error('Error updating project:', error);
      showToast('✗ Failed to update project', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteProject = () => {
    setDeleteProjectConfirmOpen(true);
  };

  const confirmDeleteProject = async () => {
    try {
      setIsActionLoading(true);
      const projectId_ = parseInt(projectId!);
      await projectService.deleteProject(projectId_);
      showToast('✓ Project deleted successfully', 'success');
      navigate('/projects');
    } catch {
      showToast('✗ Failed to delete project', 'error');
      setDeleteProjectConfirmOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: bgColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: bgColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography color="error" variant="h6">
          Project not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: bgColor,
        transition: 'all 0.3s ease',
      }}
    >
      <LoadingOverlay isLoading={isActionLoading} message="Processing your request..." />
      {/* Navigation */}
      <ProfessionalNavbar showUserMenu={true} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
              <Button
                onClick={() => navigate('/projects')}
                sx={{
                  color: isDark ? '#94a3b8' : '#64748b',
                  fontWeight: 600,
                  mb: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    background: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                  },
                }}
              >
                ← Projects
              </Button>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                {project.title}
              </Typography>
              {project.description && (
                <Typography
                  sx={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    mt: 1,
                  }}
                >
                  {project.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleEditProject}
                  sx={{
                    color: isDark ? '#cbd5e1' : '#64748b',
                    '&:hover': {
                      color: '#667eea',
                      background: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleDeleteProject}
                  sx={{
                    color: '#ef4444',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.1)',
                    },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* Total Tasks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                }}
                elevation={0}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      mb: 1.5,
                    }}
                  >
                    Total Tasks
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {progress.totalTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Completed Tasks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                }}
                elevation={0}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      mb: 1.5,
                    }}
                  >
                    Completed
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {progress.completedTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Progress Rate */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                }}
                elevation={0}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#94a3b8' : '#64748b',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Completion Rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {Math.round(progress.progressPercentage)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      borderRadius: 4,
                      background: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Tasks Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Smart Filter */}
          <SmartTaskFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterToggle={handleFilterToggle}
            isDark={isDark}
          />

          <Card
            sx={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
            elevation={0}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: tableBg }}>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.9rem',
                        borderBottom: `1px solid ${borderColor}`,
                        width: '20%',
                      }}
                    >
                      Task
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.9rem',
                        borderBottom: `1px solid ${borderColor}`,
                        width: '35%',
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.9rem',
                        borderBottom: `1px solid ${borderColor}`,
                        width: '15%',
                      }}
                    >
                      Due Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.9rem',
                        borderBottom: `1px solid ${borderColor}`,
                        width: '10%',
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 800,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.9rem',
                        borderBottom: `1px solid ${borderColor}`,
                        width: '20%',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task: any, index: number) => (
                      <TableRow
                        key={task.id}
                        sx={{
                          background: index % 2 === 0 ? 'transparent' : tableBg,
                          opacity: task.isCompleted ? 0.6 : 1,
                          borderBottom: `1px solid ${borderColor}`,
                          '&:hover': {
                            background: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <TableCell
                          sx={{
                            color: isDark ? '#e2e8f0' : '#0f172a',
                            fontWeight: task.isCompleted ? 500 : 600,
                            opacity: task.isCompleted ? 0.7 : 1,
                          }}
                        >
                          {task.title}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: isDark ? '#cbd5e1' : '#64748b',
                            fontSize: '0.85rem',
                            maxWidth: '400px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={task.description}
                        >
                          {task.description || '—'}
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: '0.9rem' }}>
                          {task.dueDate ? (() => {
                            const dueDate = new Date(task.dueDate);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            dueDate.setHours(0, 0, 0, 0);
                            const isOverdue = dueDate < today && !task.isCompleted;
                            return (
                              <span style={{
                                color: isOverdue ? '#ef4444' : isDark ? '#cbd5e1' : '#64748b',
                                fontWeight: isOverdue ? 600 : 400,
                              }}>
                                {isOverdue && '⚠ '}
                                {dueDate.toLocaleDateString()}
                              </span>
                            );
                          })() : '—'}
                        </TableCell>
                        <TableCell>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Chip
                              icon={task.isCompleted ? <CheckIcon sx={{ color: 'inherit !important' }} /> : undefined}
                              label={task.isCompleted ? 'Completed' : 'Pending'}
                              size="small"
                              onClick={() => {
                                if (!task.isCompleted) {
                                  handleCompleteTask(task.id);
                                }
                              }}
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                background: task.isCompleted
                                  ? 'rgba(34, 197, 94, 0.2)'
                                  : 'rgba(102, 126, 234, 0.1)',
                                color: task.isCompleted ? '#22c55e' : '#667eea',
                                border: task.isCompleted
                                  ? '1px solid rgba(34, 197, 94, 0.5)'
                                  : '1px solid rgba(102, 126, 234, 0.3)',
                                cursor: !task.isCompleted ? 'pointer' : 'default',
                                transition: 'all 0.3s ease',
                                '&:hover': !task.isCompleted ? {
                                  background: 'rgba(102, 126, 234, 0.15)',
                                  borderColor: 'rgba(102, 126, 234, 0.5)',
                                } : {},
                              }}
                            />
                          </motion.div>
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          {!task.isCompleted && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ display: 'inline-block', marginRight: '4px' }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleCompleteTask(task.id)}
                                sx={{
                                  color: '#22c55e',
                                  '&:hover': {
                                    background: 'rgba(34, 197, 94, 0.1)',
                                  },
                                }}
                              >
                                <CheckIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </motion.div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ display: 'inline-block', marginRight: '4px' }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(task)}
                              sx={{
                                color: isDark ? '#cbd5e1' : '#64748b',
                                '&:hover': {
                                  background: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                                },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ display: 'inline-block' }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTask(task.id)}
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  background: 'rgba(239, 68, 68, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography color={isDark ? '#94a3b8' : '#64748b'} fontWeight={500}>
                          {searchQuery && tasks.length > 0
                            ? 'No tasks match your search. Try adjusting your search term.'
                            : 'No tasks yet. Add one to get started!'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Box
                sx={{
                  background: tableBg,
                  borderTop: `1px solid ${borderColor}`,
                  py: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <IconButton
                  onClick={() => handleChangePage(null, Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  sx={{
                    color: isDark ? '#cbd5e1' : '#64748b',
                    '&:disabled': {
                      color: isDark ? '#475569' : '#cbd5e1',
                    },
                  }}
                >
                  &lt;
                </IconButton>
                <Typography
                  sx={{
                    color: isDark ? '#cbd5e1' : '#64748b',
                    fontWeight: 600,
                    minWidth: '120px',
                    textAlign: 'center',
                  }}
                >
                  Page {currentPage + 1} of {Math.ceil(filteredTasks.length / 10)}
                </Typography>
                <IconButton
                  onClick={() => handleChangePage(null, currentPage + 1)}
                  disabled={currentPage >= Math.ceil(filteredTasks.length / 10) - 1}
                  sx={{
                    color: isDark ? '#cbd5e1' : '#64748b',
                    '&:disabled': {
                      color: isDark ? '#475569' : '#cbd5e1',
                    },
                  }}
                >
                  &gt;
                </IconButton>
              </Box>
            </TableContainer>
          </Card>

          {/* Add Task Button - Professional Placement */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: 20 }} />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                  },
                }}
              >
                Add New Task
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{
        sx: {
          background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
        }
      }}>
        <DialogTitle sx={{
          fontWeight: 800,
          color: isDark ? '#f1f5f9' : '#0f172a',
          fontSize: '1.25rem',
        }}>
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2.5}>
              <TextField
                autoFocus
                label="Task Title"
                fullWidth
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#1e293b' : '#f8fafc',
                    borderRadius: '12px',
                  },
                }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description (optional)"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#1e293b' : '#f8fafc',
                    borderRadius: '12px',
                  },
                }}
              />
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(date: any) => setFormData({ ...formData, dueDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? '#1e293b' : '#f8fafc',
                        borderRadius: '12px',
                      },
                    },
                  },
                }}
              />
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: isDark ? '#cbd5e1' : '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': {
                background: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.5)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTask}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
            }}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDeleteTask}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
      />

      {/* Edit Project Dialog */}
      <Dialog open={editProjectDialogOpen} onClose={() => setEditProjectDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{
        sx: {
          background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
        }
      }}>
        <DialogTitle sx={{
          fontWeight: 800,
          color: isDark ? '#f1f5f9' : '#0f172a',
          fontSize: '1.25rem',
        }}>
          Edit Project
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Project Title"
              fullWidth
              value={projectFormData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectFormData({ ...projectFormData, title: e.target.value })}
              placeholder="Enter project title"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? '#1e293b' : '#f8fafc',
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={projectFormData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProjectFormData({ ...projectFormData, description: e.target.value })}
              placeholder="Enter project description (optional)"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? '#1e293b' : '#f8fafc',
                  borderRadius: '12px',
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setEditProjectDialogOpen(false)}
            sx={{
              color: isDark ? '#cbd5e1' : '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': {
                background: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.5)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProject}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteProjectConfirmOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? All tasks will be deleted as well. This action cannot be undone."
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteProjectConfirmOpen(false)}
      />
    </Box>
  );
};
