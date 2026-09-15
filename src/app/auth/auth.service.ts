import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${API_BASE_URL}/auth`;

  /*
   * TravelMatch remembered-login duration.
   *
   * 10 days × 24 hours × 60 minutes × 60 seconds × 1000 ms
   */
  private readonly TEN_DAYS_MS =
    10 * 24 * 60 * 60 * 1000;


  constructor(private http: HttpClient) {}


  register(data: any) {
    return this.http.post(
      `${this.baseUrl}/register`,
      data,
      { responseType: 'text' }
    );
  }


  login(data: any) {
    return this.http.post(
      `${this.baseUrl}/login`,
      data
    );
  }


  verifyEmail(email: string, code: string) {
    return this.http.post(
      `${this.baseUrl}/verify?email=${email}&code=${code}`,
      {},
      { responseType: 'json' }
    );
  }


  resendOtp(email: string) {
    return this.http.post(
      `${this.baseUrl}/resend-otp?email=${email}`,
      {},
      { responseType: 'json' }
    );
  }


  forgotPassword(email: string) {
    return this.http.post(
      `${this.baseUrl}/forgot-password?email=${email}`,
      {}
    );
  }


  verifyReset(email: string, code: string) {
    return this.http.post(
      `${this.baseUrl}/verify-reset?email=${email}&code=${code}`,
      {}
    );
  }


  resetPassword(email: string, password: string) {
    return this.http.post(
      `${this.baseUrl}/reset-password?email=${email}&password=${password}`,
      {}
    );
  }


  /*
   * Start a new 10-day remembered-login session.
   *
   * This should be called ONLY after the backend login succeeds.
   */
  startRememberedSession(): void {

    const expiresAt =
      Date.now() + this.TEN_DAYS_MS;

    localStorage.setItem(
      'authExpiresAt',
      expiresAt.toString()
    );
  }


  /*
   * Returns true only when:
   *
   * 1. A JWT token exists
   * 2. authExpiresAt exists
   * 3. authExpiresAt is valid
   * 4. The 10-day remembered session has not expired
   */
  isAuthenticated(): boolean {

    const token =
      localStorage.getItem('token');

    const expiresAt =
      localStorage.getItem('authExpiresAt');


    if (!token || !token.trim()) {
      return false;
    }


    if (!expiresAt) {
      return false;
    }


    const expiryTime =
      Number(expiresAt);


    if (
      !Number.isFinite(expiryTime) ||
      Date.now() >= expiryTime
    ) {
      return false;
    }


    return true;
  }


  /*
   * Clear authentication information.
   *
   * API data cache is cleared separately by the caller because
   * AuthService should not depend on DataCacheService.
   */
  clearAuthentication(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('authExpiresAt');
  }


  /*
   * Returns the remaining remembered-login time.
   *
   * Useful if the application needs to display session information.
   */
  getSessionExpiry(): number | null {

    const expiresAt =
      localStorage.getItem('authExpiresAt');


    if (!expiresAt) {
      return null;
    }


    const expiryTime =
      Number(expiresAt);


    if (!Number.isFinite(expiryTime)) {
      return null;
    }


    return expiryTime;
  }
}
