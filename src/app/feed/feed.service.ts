import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface CompatibilityFactor {
  label: string;
  rating: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
}

export interface FeedPost {
  id: number;

  userId: number;
  userName: string;
  userCity: string | null;

  // Profile image information
  userGender: string | null;
  profilePhotoUrl: string | null;

  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  status: string;
  createdAt: string;

  matchScore: number | null;
  matchFactors: CompatibilityFactor[];

  likeCount: number;
  dislikeCount: number;
  shareCount: number;

  currentUserReaction: 'LIKE' | 'DISLIKE' | null;
  currentUserSaved: boolean;
  commentCount: number;
  premiumUser: boolean; boosted: boolean; boostMultiplier: number | null;

  matchRequestStatus:
    | 'NONE'
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED';
}

export interface FeedFilters {
  destination?: string;
  fromLocation?: string;
  minBudget?: number | null;
  maxBudget?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  travelType?: string;
  minMatchScore?: number | null;
  minAge?: number | null; maxAge?: number | null; travelStyle?: string; travelInterest?: string; language?: string; country?: string; city?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private baseUrl = `${API_BASE_URL}/travel`;

  constructor(private http: HttpClient) {}

  getFeed(
    sort: 'latest' | 'popular' | 'match' = 'latest',
    filters?: FeedFilters
  ): Observable<FeedPost[]> {

    let params = new HttpParams()
      .set('sort', sort);

    if (filters) {

      if (filters.destination) {
        params = params.set(
          'destination',
          filters.destination
        );
      }

      if (filters.fromLocation) {
        params = params.set(
          'fromLocation',
          filters.fromLocation
        );
      }

      if (filters.minBudget != null) {
        params = params.set(
          'minBudget',
          filters.minBudget
        );
      }

      if (filters.maxBudget != null) {
        params = params.set(
          'maxBudget',
          filters.maxBudget
        );
      }

      if (filters.startDate) {
        params = params.set(
          'startDate',
          filters.startDate
        );
      }

      if (filters.endDate) {
        params = params.set(
          'endDate',
          filters.endDate
        );
      }

      if (filters.travelType) {
        params = params.set(
          'travelType',
          filters.travelType
        );
      }

      if (filters.minMatchScore != null) {
        params = params.set(
          'minMatchScore',
          filters.minMatchScore
        );
      }
      const keys: (keyof FeedFilters)[]=['minAge','maxAge','travelStyle','travelInterest','language','country','city'];
      for(const key of keys){const v=filters[key];if(v!==undefined&&v!==null&&v!=='')params=params.set(key as string,String(v));}
    }

    return this.http.get<FeedPost[]>(
      `${this.baseUrl}/feed`,
      { params }
    );
  }

  like(planId: number): Observable<FeedPost> {
    return this.http.post<FeedPost>(
      `${this.baseUrl}/${planId}/like`,
      {}
    );
  }

  dislike(planId: number): Observable<FeedPost> {
    return this.http.post<FeedPost>(
      `${this.baseUrl}/${planId}/dislike`,
      {}
    );
  }

  share(planId: number): Observable<FeedPost> {
    return this.http.post<FeedPost>(
      `${this.baseUrl}/${planId}/share`,
      {}
    );
  }
}