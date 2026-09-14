import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { DataCacheService } from '../core/data-cache.service';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private baseUrl = `${API_BASE_URL}/match`;

  constructor(private http: HttpClient, private cache: DataCacheService) {}

  sendMatchRequest(travelPlanId: number) {
    return this.http.post(`${this.baseUrl}/send/${travelPlanId}`, {}).pipe(
      tap(() => {
        this.invalidateMatchData();
        this.cache.invalidatePrefix('feed:');
        this.cache.invalidatePrefix('travel:matches:');
      })
    );
  }

  getMyRequests() {
    return this.cache.get('match:my', () => this.http.get(`${this.baseUrl}/my`));
  }

  acceptRequest(requestId: number) {
    return this.http.put(`${this.baseUrl}/${requestId}/accept`, {}).pipe(
      tap(() => this.invalidateMatchData())
    );
  }

  rejectRequest(requestId: number) {
    return this.http.put(`${this.baseUrl}/${requestId}/reject`, {}).pipe(
      tap(() => this.invalidateMatchData())
    );
  }

  private invalidateMatchData(): void {
    this.cache.invalidate('match:my');
    this.cache.invalidate('partner:my');
    this.cache.invalidate('notification:list');
    this.cache.invalidate('notification:unread');
  }
}
