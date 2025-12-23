import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { AddOutlined as AddIcon, FolderOutlined as FolderIcon, ChecklistOutlined as TaskIcon, DoneAllOutlined as DoneIcon } from '@mui/icons-material';
import { useToast } from '../hooks/useToast';
import { ProfessionalNavbar } from '../components/ProfessionalNavbar';
import { AdvancedCircularProgress } from '../components/AdvancedCircularProgress';
import { useThemeMode } from '../context/ThemeContext';

interface ProjectCardData {
  id: number;
  title: string;
  description: string;
  taskCount: number;
  completedCount: number;
  progress: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mode } = useThemeMode();
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = mode === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.6)';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const projectsData = await projectService.getProjects(0, 6);
      
      const projectsWithProgress = await Promise.all(
        projectsData.content.map(async (project: any) => {
          const progress = await taskService.getProgress(project.id);
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            taskCount: progress.totalTasks,
            completedCount: progress.completedTasks,
            progress: progress.progressPercentage,
          };
        })
      );

      setProjects(projectsWithProgress);
    } catch (err) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToProjects = () => {
    navigate('/projects');
  };

  const stats = {
    totalProjects: projects.length,
    totalTasks: projects.reduce((sum: number, p: any) => sum + p.taskCount, 0),
    completedTasks: projects.reduce((sum: number, p: any) => sum + p.completedCount, 0),
  };

  const progressData = [
    { name: 'Completed', value: stats.completedTasks },
    { name: 'Remaining', value: stats.totalTasks - stats.completedTasks },
  ];

  const COLORS = ['#667eea', '#f093fb'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: bgColor,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Navbar */}
      <ProfessionalNavbar showUserMenu={true} />

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 1,
                color: isDark ? '#f1f5f9' : '#0f172a',
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Welcome back, {user?.fullName || user?.email}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.05rem',
                color: isDark ? '#94a3b8' : '#64748b',
                fontWeight: 500,
              }}
            >
              Here's an overview of your projects and task progress
            </Typography>
          </Box>
        </motion.div>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Statistics Section */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {[
                { title: 'Total Projects', value: stats.totalProjects, icon: FolderIcon, iconBg: 'rgba(102, 126, 234, 0.15)', iconColor: '#667eea' },
                { title: 'All Tasks', value: stats.totalTasks, icon: TaskIcon, iconBg: 'rgba(118, 75, 162, 0.15)', iconColor: '#764ba2' },
                { title: 'Completed', value: stats.completedTasks, icon: DoneIcon, iconBg: 'rgba(34, 197, 94, 0.15)', iconColor: '#22c55e' },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      sx={{
                        background: cardBg,
                        border: `1px solid ${borderColor}`,
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        height: '100%',
                      }}
                      elevation={0}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
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
                              {stat.title}
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 900,
                                background: `linear-gradient(135deg, ${stat.iconColor} 0%, ${stat.iconColor}dd 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                              }}
                            >
                              {stat.value}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: '12px',
                              background: stat.iconBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <stat.icon sx={{ color: stat.iconColor, fontSize: 28 }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} md={6}>
                <motion.div
                  custom={3}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    sx={{
                      background: cardBg,
                      border: `1px solid ${borderColor}`,
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      p: 3,
                    }}
                    elevation={0}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 3,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                      }}
                    >
                      Task Status
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  custom={4}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    sx={{
                      background: cardBg,
                      border: `1px solid ${borderColor}`,
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      p: 3,
                    }}
                    elevation={0}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 3,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                      }}
                    >
                      Overall Progress
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: isDark ? '#e2e8f0' : '#1e293b',
                            }}
                          >
                            Completion Rate
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 800,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                            }}
                          >
                            {stats.totalTasks > 0
                              ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                              : 0}
                            %
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
                            animate={{
                              width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`,
                            }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{
                              height: '100%',
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Projects Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                >
                  Recent Projects
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: 20 }} />}
                    onClick={handleNavigateToProjects}
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

              <Grid container spacing={2}>
                {projects.length > 0 ? (
                  projects.map((project: any, index: number) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                      <motion.div
                        custom={index + 5}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        whileHover={{ y: -8 }}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            background: cardBg,
                            border: `1px solid ${borderColor}`,
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              boxShadow: isDark
                                ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                                : '0 20px 40px rgba(0, 0, 0, 0.08)',
                            },
                          }}
                          elevation={0}
                        >
                          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {/* Title and Description - Top Section */}
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 800,
                                  mb: 1,
                                  color: isDark ? '#f1f5f9' : '#0f172a',
                                }}
                              >
                                {project.title}
                              </Typography>
                              {project.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDark ? '#cbd5e1' : '#64748b',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {project.description}
                                </Typography>
                              )}
                            </Box>

                            {/* Divider */}
                            <Box
                              sx={{
                                height: '1px',
                                background: borderColor,
                                mb: 3,
                              }}
                            />

                            {/* Progress and Task Count - Bottom Section */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                              {/* Circular Progress on Left */}
                              <Box>
                                <AdvancedCircularProgress
                                  value={project.completedCount}
                                  total={project.taskCount || 1}
                                  label="Completed"
                                  size={80}
                                />
                              </Box>

                              {/* Task Count on Right */}
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDark ? '#cbd5e1' : '#64748b',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    mb: 0.5,
                                  }}
                                >
                                  Completed Tasks:
                                </Typography>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontSize: '1.5rem',
                                  }}
                                >
                                  {project.completedCount} / {project.taskCount}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
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
                      <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Typography
                          sx={{
                            color: isDark ? '#94a3b8' : '#64748b',
                            fontWeight: 500,
                          }}
                        >
                          No projects yet. Create one to get started!
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};
