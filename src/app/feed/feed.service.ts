import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface FeedPost {
  id: number;
  userId: number;
  userName: string;
  userCity: string | null;

  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  status: string;
  createdAt: string;

  matchScore: number | null;

  likeCount: number;
  dislikeCount: number;
  shareCount: number;

  currentUserReaction: 'LIKE' | 'DISLIKE' | null;
  matchRequestStatus: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private baseUrl = `${API_BASE_URL}/travel`;

  constructor(private http: HttpClient) {}

  getFeed(sort: 'latest' | 'popular' | 'match' = 'latest'): Observable<FeedPost[]> {
    return this.http.get<FeedPost[]>(`${this.baseUrl}/feed`, {
      params: { sort }
    });
  }

  like(planId: number): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.baseUrl}/${planId}/like`, {});
  }

  dislike(planId: number): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.baseUrl}/${planId}/dislike`, {});
  }

  share(planId: number): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.baseUrl}/${planId}/share`, {});
  }
}
