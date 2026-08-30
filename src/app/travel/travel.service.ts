import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private baseUrl = `${API_BASE_URL}/travel`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    
    // Safety check: Don't send a "null" string to the backend
    if (!token || token === 'undefined') {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getMyPlans(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my`, { headers: this.getHeaders() });
  }

  createPlan(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, { headers: this.getHeaders() });
  }

  getMatches(planId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${planId}/matches`, { headers: this.getHeaders() });
  }

  deletePlan(planId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${planId}`, { headers: this.getHeaders() });
  }
}