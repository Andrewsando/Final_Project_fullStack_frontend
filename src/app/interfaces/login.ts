// User interface
export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response interface
export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

// Error response interface
export interface ErrorResponse {
  error: string;
}

// Create user request interface
export interface CreateUserRequest {
  name: string;
  password: string;
  email: string;
}

// Register response interface
export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth service interface
export interface AuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  createUser(userData: CreateUserRequest): Promise<User>;
  logout(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
}

// JWT Token payload interface
export interface JWTPayload {
  user_id: number;
  exp: number;
  iat: number;
  token_type: string;
}

// Interfaces para proyectos
export interface Project {
  id: number;
  name: string;
  description: string;
  state: string;
  priority?: string;
  assignee?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

// Profile interfaces
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}