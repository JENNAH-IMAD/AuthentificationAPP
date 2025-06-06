export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    expiresAt: string;
  };
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleIds: number[];
  isActive?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleIds?: number[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  errors?: string[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface TokenValidationResponse {
  isValid: boolean;
  message: string;
} 