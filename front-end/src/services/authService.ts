import api from './api';

// ========== DTOs (Data Transfer Objects) ==========

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roles?: ('attendee' | 'organizer' | 'admin')[];
  organizationId?: string;
  interestedEventCategories?: string[];
  hostingEventTypes?: string[];
}

export interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface SendVerificationCodeDto {
  email?: string;
  phone?: string;
  type: 'email' | 'phone';
  purpose: 'login' | 'registration' | 'email_verification' | 'phone_verification' | 'password_reset';
}

export interface VerifyCodeDto {
  email?: string;
  phone?: string;
  type: 'email' | 'phone';
  code: string;
}

export interface LoginWithCodeDto {
  email?: string;
  phone?: string;
  type: 'email' | 'phone';
  code: string;
}

// ========== Response Types ==========

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  emailVerified: boolean;
  phoneVerified?: boolean;
  interestedEventCategories?: string[];
  hostingEventTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface MessageResponse {
  message: string;
  expiresIn?: string;
}

export interface VerificationResponse {
  message: string;
  verified: boolean;
  user?: User;
}

class AuthService {
  // ========== Registration & Login ==========

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      this.setAuthData(response.data.token, response.data.user);
    }
    return response.data;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      this.setAuthData(response.data.token, response.data.user);
    }
    return response.data;
  }

  async loginWithCode(data: LoginWithCodeDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login-with-code', data);
    if (response.data.token) {
      this.setAuthData(response.data.token, response.data.user);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearAuthData();
  }

  // ========== Email Verification ==========

  async verifyEmail(data: VerifyEmailDto): Promise<VerificationResponse> {
    const response = await api.post<VerificationResponse>('/auth/verify-email', data);
    // Update user in localStorage if verification successful
    if (response.data.user) {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  }

  async resendVerificationEmail(email: string): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/resend-verification', { email });
    return response.data;
  }

  // ========== Password Reset ==========

  async forgotPassword(data: ForgotPasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/reset-password', data);
    return response.data;
  }

  // ========== Verification Codes ==========

  async sendVerificationCode(data: SendVerificationCodeDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/send-verification-code', data);
    return response.data;
  }

  async verifyCode(data: VerifyCodeDto): Promise<VerificationResponse> {
    const response = await api.post<VerificationResponse>('/auth/verify-code', data);
    return response.data;
  }

  // ========== Helper Methods ==========

  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return user?.emailVerified || false;
  }

  isPhoneVerified(): boolean {
    const user = this.getCurrentUser();
    return user?.phoneVerified || false;
  }
}

export default new AuthService();
