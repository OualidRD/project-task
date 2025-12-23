import api from './api';

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthLoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    fullName: string;
    createdAt: string;
  };
}

export const authService = {
  login: async (credentials: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: AuthRegisterRequest): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>('/auth/register', data);    return response.data;
  },
};

export default authService;