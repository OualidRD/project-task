import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import { DeleteOutline as DeleteIcon, EditOutlined as EditIcon, AddOutlined as AddIcon } from '@mui/icons-material';
import { useToast } from '../hooks/useToast';
import { ProfessionalNavbar } from '../components/ProfessionalNavbar';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import LoadingOverlay from '../components/LoadingOverlay';
import { useThemeMode } from '../context/ThemeContext';

interface Project {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.1 },
  }),
};

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { mode } = useThemeMode();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const isDark = mode === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.6)';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects(0, 100);
      setProjects(data.content);
    } catch {
      showToast('Failed to load projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({ title: project.title, description: project.description });
    } else {
      setEditingProject(null);
      setFormData({ title: '', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({ title: '', description: '' });
  };

  const handleSaveProject = async () => {
    if (!formData.title.trim()) {
      showToast('Project title is required', 'warning');
      return;
    }

    try {
      setIsActionLoading(true);
      const isEditing = !!editingProject;
      
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
      } else {
        await projectService.createProject(formData);
      }
      
      handleCloseDialog();
      await loadProjects();
      
      // Show toast AFTER everything is loaded
      showToast(
        isEditing ? '✓ Project updated successfully' : '✓ Project created successfully',
        'success'
      );
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('✗ Failed to save project', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setIsActionLoading(true);
      await projectService.deleteProject(projectToDelete);
      showToast('✓ Project deleted successfully', 'success');
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      await loadProjects();
    } catch {
      showToast('✗ Failed to delete project', 'error');
      setDeleteConfirmOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: bgColor, transition: 'all 0.3s ease' }}>
      <LoadingOverlay isLoading={isActionLoading} message="Processing your request..." />
      {/* Navbar */}
      <ProfessionalNavbar showUserMenu={true} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  mb: 1,
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                My Projects
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  color: isDark ? '#94a3b8' : '#64748b',
                  fontWeight: 500,
                }}
              >
                Manage and organize all your projects in one place
              </Typography>
            </Box>
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
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  px: 3,
                  py: 1.2,
                }}
              >
                New Project
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {projects.length > 0 ? (
              projects.map((project: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: cardBg,
                        border: `1px solid ${borderColor}`,
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: isDark
                            ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                            : '0 20px 40px rgba(0, 0, 0, 0.08)',
                        },
                      }}
                      elevation={0}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            mb: 1.5,
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          {project.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2.5,
                            color: isDark ? '#cbd5e1' : '#64748b',
                            fontWeight: 500,
                            minHeight: '2.4rem',
                            lineHeight: 1.4,
                          }}
                        >
                          {project.description || 'No description provided'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: isDark ? '#94a3b8' : '#94a3b8',
                            fontWeight: 500,
                          }}
                        >
                          {new Date(project.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          p: 2,
                          borderTop: `1px solid ${borderColor}`,
                        }}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
                            onClick={() => handleOpenDialog(project)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              color: isDark ? '#cbd5e1' : '#475569',
                              fontSize: '0.85rem',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                              },
                            }}
                          >
                            Edit
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="small"
                            startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
                            onClick={() => handleDeleteProject(project.id)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              color: '#ef4444',
                              fontSize: '0.85rem',
                              '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                              },
                            }}
                          >
                            Delete
                          </Button>
                        </motion.div>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                  }}
                  elevation={0}
                >
                  <CardContent sx={{ textAlign: 'center', py: 8 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      No projects yet
                    </Typography>
                    <Typography
                      sx={{
                        color: isDark ? '#94a3b8' : '#64748b',
                        fontWeight: 500,
                        mb: 3,
                      }}
                    >
                      Create your first project to get started
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleOpenDialog()}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          px: 4,
                          py: 1.2,
                        }}
                      >
                        Create Your First Project
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: isDark
              ? 'rgba(30, 41, 59, 0.95)'
              : 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${borderColor}`,
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: '1.2rem',
            color: isDark ? '#f1f5f9' : '#0f172a',
          }}
        >
          {editingProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Project Title"
              fullWidth
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter project title"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: borderColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter project description"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: borderColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: isDark ? '#cbd5e1' : '#475569',
              borderRadius: '10px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProject}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
            }}
          >
            {editingProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? All associated tasks will be removed."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setProjectToDelete(null);
        }}
      />
    </Box>
  );
};
