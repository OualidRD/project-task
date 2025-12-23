import api from './api';

export interface ProjectDTO {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface ProjectsResponse {
  content: ProjectDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const projectService = {
  createProject: async (data: CreateProjectRequest): Promise<ProjectDTO> => {
    const response = await api.post<ProjectDTO>('/projects', data);
    return response.data;
  },

  getProjects: async (page = 0, size = 10): Promise<any> => {
    const response = await api.get('/projects', {
      params: { page, size },
    });
    return response.data;
  },

  getProject: async (projectId: number): Promise<ProjectDTO> => {
    const response = await api.get<ProjectDTO>(`/projects/${projectId}`);
    return response.data;
  },

  updateProject: async (projectId: number, data: CreateProjectRequest): Promise<ProjectDTO> => {
    const response = await api.put<ProjectDTO>(`/projects/${projectId}`, data);
    return response.data;
  },

  deleteProject: async (projectId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },
};

export default projectService;
