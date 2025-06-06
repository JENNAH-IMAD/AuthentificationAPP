import { 
  LoginCredentials, 
  LoginResponse, 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  ApiResponse,
  TokenValidationResponse 
} from '@/types/auth';

// Configuration de base de l'API (sans slash final pour éviter les doubles slashes)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5232/api';

// Utilitaire pour les requêtes HTTP avec gestion d'erreurs
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Configuration par défaut
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && !config.headers) {
        config.headers = {};
      }
      if (token) {
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, config);
      
      // Vérifier si la réponse est ok
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // Garder le message par défaut si le parsing JSON échoue
        }
        
        const error = new Error(errorMessage) as any;
        error.response = response;
        error.status = response.status;
        throw error;
      }

      // Parser la réponse JSON
      const data = await response.json();
      return data;
    } catch (error: any) {
      // Re-lancer l'erreur pour qu'elle soit gérée par l'appelant
      if (error.response) {
        throw error;
      }
      
      // Erreur de réseau ou autre
      const networkError = new Error('Erreur de connexion au serveur') as any;
      networkError.originalError = error;
      throw networkError;
    }
  }

  // Méthodes HTTP
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Instance du client API
const apiClient = new ApiClient(API_BASE_URL);

// Services d'authentification
export const authApi = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Validation d'un token JWT (route corrigée)
   */
  async validateToken(token: string): Promise<TokenValidationResponse> {
    return apiClient.post<TokenValidationResponse>('/auth/validate', { token });
  },

  /**
   * Test de l'API
   */
  async test(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>('/auth/test');
  },
};

// Services de gestion des utilisateurs
export const userApi = {
  /**
   * Récupérer tous les utilisateurs
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>('/users');
  },

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  },

  /**
   * Créer un nouvel utilisateur
   */
  async createUser(userData: CreateUserDto): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/users', userData);
  },

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(id: number, userData: UpdateUserDto): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
  },

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/users/${id}`);
  },

  /**
   * Vérifier si un email existe
   */
  async checkEmailExists(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    return apiClient.get<ApiResponse<{ exists: boolean }>>(`/users/check-email/${encodeURIComponent(email)}`);
  },

  /**
   * Vérifier si un nom d'utilisateur existe
   */
  async checkUsernameExists(username: string): Promise<ApiResponse<{ exists: boolean }>> {
    return apiClient.get<ApiResponse<{ exists: boolean }>>(`/users/check-username/${encodeURIComponent(username)}`);
  },
};

// Utilitaires
export const apiUtils = {
  /**
   * Vérifier la santé de l'API
   */
  async healthCheck(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>('/health', { 
      headers: { 'Authorization': '' } // Pas besoin d'auth pour health check
    });
  },

  /**
   * Obtenir les informations de l'API
   */
  async getApiInfo(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>('/', { 
      headers: { 'Authorization': '' } // Pas besoin d'auth pour info
    });
  },
};

// Export de l'instance client pour usage avancé
export { apiClient }; 