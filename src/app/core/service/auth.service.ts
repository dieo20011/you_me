import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../api-respone.model';
import { LoginRequest } from '../../login/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7220';

  constructor(private readonly http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<ApiResponse<never>>(`${this.apiUrl}/api/auth/login`, data);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
