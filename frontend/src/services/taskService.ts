import api from './api';

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface ProgressDTO {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export const taskService = {
  createTask: async (projectId: number, data: CreateTaskRequest): Promise<TaskDTO> => {
    const response = await api.post<TaskDTO>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  getTasks: async (projectId: number, page = 0, size = 20): Promise<any> => {
    const response = await api.get(`/projects/${projectId}/tasks`, {
      params: { page, size },
    });
    return response.data;
  },

  searchTasks: async (projectId: number, searchTerm: string, page = 0, size = 20): Promise<any> => {
    const response = await api.get(`/projects/${projectId}/tasks/search`, {
      params: { searchTerm, page, size },
    });
    return response.data;
  },

  getTask: async (projectId: number, taskId: number): Promise<TaskDTO> => {
    const response = await api.get<TaskDTO>(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (projectId: number, taskId: number, data: CreateTaskRequest): Promise<TaskDTO> => {
    const response = await api.put<TaskDTO>(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  },

  completeTask: async (projectId: number, taskId: number): Promise<TaskDTO> => {
    const response = await api.put<TaskDTO>(`/projects/${projectId}/tasks/${taskId}/complete`);
    return response.data;
  },

  deleteTask: async (projectId: number, taskId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  },

  getProgress: async (projectId: number): Promise<ProgressDTO> => {
    const response = await api.get<ProgressDTO>(`/projects/${projectId}/tasks/progress`);
    return response.data;
  },
};

export default taskService;
