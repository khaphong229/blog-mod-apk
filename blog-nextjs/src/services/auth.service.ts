import axios from "@/lib/axios";
import { signIn, signOut } from "next-auth/react";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message: string;
}

export interface LoginResponse {
  ok: boolean;
  error?: string;
}

class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await axios.post<RegisterResponse>("/api/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<LoginResponse> {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    return {
      ok: result?.ok || false,
      error: result?.error,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await signOut({ redirect: false });
  }
}

export const authService = new AuthService();
