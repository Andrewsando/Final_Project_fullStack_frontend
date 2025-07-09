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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface ErrorResponse {
  error: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  createUser(userData: CreateUserRequest): Promise<User>;
  logout(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
}

export interface JWTPayload {
  user_id: number;
  exp: number;
  iat: number;
  token_type: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  state: string;
  user: number;
  priority?: string;
  assignee?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  state: string;
  user: number;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface HttpResponseEvent {
  type: number;
  status: number;
  body: any;
  url?: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}