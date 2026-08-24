import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private baseUrl= `${API_BASE_URL}/match`;
  // private baseUrl = 'http://localhost:8080/api/match';
  // private baseUrl = 'https://travelmatch1.up.railway.app/api/match';

  constructor(private http: HttpClient) {}

  // Send Match Request
  sendMatchRequest(travelPlanId: number) {
    return this.http.post(
      `${this.baseUrl}/send/${travelPlanId}`,
      {}
    );
  }

  // Get My Incoming Requests
  getMyRequests() {
    return this.http.get(`${this.baseUrl}/my`);
  }

  // Accept Request
  acceptRequest(requestId: number) {
    return this.http.put(
      `${this.baseUrl}/${requestId}/accept`,
      {}
    );
  }

  // Reject Request
  rejectRequest(requestId: number) {
    return this.http.put(
      `${this.baseUrl}/${requestId}/reject`,
      {}
    );
  }
}