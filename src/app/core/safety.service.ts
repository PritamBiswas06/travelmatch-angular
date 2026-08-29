import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export type ReportReason =
  | 'SPAM'
  | 'HARASSMENT'
  | 'FAKE_PROFILE'
  | 'INAPPROPRIATE'
  | 'SCAM'
  | 'OTHER';

export interface ReportRequest {
  reason: ReportReason;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  private readonly baseUrl = API_BASE_URL;

  constructor(
    private http: HttpClient
  ) {}

  blockUser(
    userId: number
  ): Observable<{ message: string }> {

    return this.http.post<{ message: string }>(
      `${this.baseUrl}/users/${userId}/block`,
      {}
    );
  }

  unblockUser(
    userId: number
  ): Observable<{ message: string }> {

    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/users/${userId}/block`
    );
  }

  isBlocked(
    userId: number
  ): Observable<{ blocked: boolean }> {

    return this.http.get<{ blocked: boolean }>(
      `${this.baseUrl}/users/${userId}/block`
    );
  }

  reportUser(
    userId: number,
    request: ReportRequest
  ): Observable<{ message: string }> {

    return this.http.post<{ message: string }>(
      `${this.baseUrl}/reports/user/${userId}`,
      request
    );
  }

  reportPost(
    travelPlanId: number,
    request: ReportRequest
  ): Observable<{ message: string }> {

    return this.http.post<{ message: string }>(
      `${this.baseUrl}/reports/post/${travelPlanId}`,
      request
    );
  }
}