import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private baseUrl = 'http://localhost:8080/api/auth';

//   constructor(private http: HttpClient) {}

//   register(data: any) {
//   return this.http.post(
//     `${this.baseUrl}/register`,
//     data,
//     { responseType: 'text' }   // IMPORTANT
//   );
// }

//   login(data: any) {
//   return this.http.post(
//     `${this.baseUrl}/login`,
//     data,
//     { responseType: 'text' }   // VERY IMPORTANT
//   );
// }

// login(data: any) {
//   return this.http.post(`${this.baseUrl}/login`, data);
// }
// }


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl= `${API_BASE_URL}/auth`;
  // private baseUrl = 'http://localhost:8080/api/auth';
  // private baseUrl = 'https://travelmatch1.up.railway.app/api/auth';

  constructor(private http: HttpClient) {}

  // register(data: any) {
  //   return this.http.post(`${this.baseUrl}/register`, data);
  // }

  register(data: any) {
  return this.http.post(
    `${this.baseUrl}/register`,
    data,
    { responseType: 'text' }   // ⭐ IMPORTANT
  );
}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
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
  return this.http.post(`${this.baseUrl}/forgot-password?email=${email}`, {});
}

verifyReset(email: string, code: string) {
  return this.http.post(`${this.baseUrl}/verify-reset?email=${email}&code=${code}`, {});
}

resetPassword(email: string, password: string) {
  return this.http.post(`${this.baseUrl}/reset-password?email=${email}&password=${password}`, {});
}
}