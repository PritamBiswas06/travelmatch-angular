import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
export interface TravelerReview {
  id: number;
  reviewerId: number;
  reviewerName: string;
  travelPlanId: number;
  destination: string;
  rating: number;
  tags: string[];
  comment: string | null;
  createdAt: string;
}


export interface TravelerReviewRequest {
  reviewedUserId: number;
  travelPlanId: number;
  rating: number;
  tags: string[];
  comment?: string;
}

export interface ReviewSummary {
  averageRating: number;
  reviewCount: number;
}

export interface ReviewEligibility {
  eligible: boolean;
  travelPlanIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TravelerReviewService {
  private readonly baseUrl = `${API_BASE_URL}/reviews`;

  constructor(private http: HttpClient) {}

  create(request: TravelerReviewRequest): Observable<TravelerReview> {
    return this.http.post<TravelerReview>(this.baseUrl, request);
  }

  getReviews(userId: number): Observable<TravelerReview[]> {
    return this.http.get<TravelerReview[]>(
      `${this.baseUrl}/user/${userId}`
    );
  }

  getSummary(userId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(
      `${this.baseUrl}/user/${userId}/summary`
    );
  }

  getEligibility(userId: number): Observable<ReviewEligibility> {
    return this.http.get<ReviewEligibility>(
      `${this.baseUrl}/user/${userId}/eligibility`
    );
  }
}
