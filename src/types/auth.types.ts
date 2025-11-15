export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'receptionist' | 'manager';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

