import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DataCacheService } from '../core/data-cache.service';
import { API_BASE_URL } from '../config/api.config';

export interface TravelComment {
  id: number;
  userId: number;
  userName: string;
  userCity: string | null;
  comment: string;
  createdAt: string;
  ownComment: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TravelCommentsService {

  private readonly baseUrl =
    `${API_BASE_URL}/travel-plans`;

  constructor(
    private readonly http: HttpClient,
    private readonly cache: DataCacheService
  ) {}

  /**
   * Get all comments for a travel post.
   */
  get(
    travelPlanId: number
  ): Observable<TravelComment[]> {

    return this.cache.get(`comments:${travelPlanId}`, () => this.http.get<TravelComment[]>(`${this.baseUrl}/${travelPlanId}/comments`));
  }

  /**
   * Add a comment to a travel post.
   */
  add(
    travelPlanId: number,
    comment: string
  ): Observable<TravelComment> {

    return this.http.post<TravelComment>(
      `${this.baseUrl}/${travelPlanId}/comments`,
      {
        comment: comment.trim()
      }
    ).pipe(tap(() => this.cache.invalidate(`comments:${travelPlanId}`)));
  }

  /**
   * Delete the current user's comment.
   */
  delete(
    commentId: number
  ): Observable<void> {

    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`).pipe(tap(() => this.cache.invalidatePrefix('comments:')));
  }
}