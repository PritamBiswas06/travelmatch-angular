import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { DataCacheService } from '../core/data-cache.service';
import { tap } from 'rxjs';
import { TravelMemory } from '../travel-memories/travel-memory.service';
import { TravelerReview } from '../reviews/traveler-review.service';
// import type { TravelerReview } from '../reviews/traveler-review.service';

export interface ProfileTrip {
  id: number;
  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  status: string;
  matchRequestStatus: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  createdAt: string | null;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  currentUserReaction: 'LIKE' | 'DISLIKE' | null;
  currentUserSaved: boolean;
}

export interface UserProfile {
  userId: number;
  name: string;
  username: string | null;

  age: number | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  country: string | null;

  verified: boolean;

  bio: string | null;
  profilePhotoUrl: string | null;

  travelStyle: string[];
  travelInterests: string[];
  preferredDestinations: string[];
  budgetPreference: string | null;
  travelFrequency: string | null;
  languages: string[];
  idealTravelPartner: string | null;

  instagramUrl: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;

  isOwnProfile: boolean;
  premiumUser: boolean;
  upcomingTrips: ProfileTrip[];
  posts: ProfileTrip[];
  travelMemories: TravelMemory[];

  averageRating: number;
  reviewCount: number;
  reviews: TravelerReview[];
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  travelStyle?: string[];
  travelInterests?: string[];
  preferredDestinations?: string[];
  budgetPreference?: string;
  travelFrequency?: string;
  languages?: string[];
  idealTravelPartner?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = `${API_BASE_URL}/users`;

  constructor(private http: HttpClient, private cache: DataCacheService) {}

  getProfile(userId: number): Observable<UserProfile> {
    return this.cache.get(`profile:${userId}`, () => this.http.get<UserProfile>(`${this.baseUrl}/${userId}/profile`));
  }

  deleteTravelPlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/travel/${planId}`).pipe(tap(() => { this.cache.invalidatePrefix('profile:'); this.cache.invalidate('travel:my'); this.cache.invalidatePrefix('feed:'); }));
  }

  likeTravelPlan(planId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/travel/${planId}/like`, {}).pipe(tap(() => this.cache.invalidatePrefix('profile:')));
  }

  dislikeTravelPlan(planId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/travel/${planId}/dislike`, {}).pipe(tap(() => this.cache.invalidatePrefix('profile:')));
  }

  updateMyProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/me/profile`, data).pipe(tap(() => this.cache.invalidatePrefix('profile:')));
  }

  uploadProfilePhoto(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);
    // No explicit Content-Type header here — the browser sets the
    // multipart boundary automatically when the body is a FormData.
    return this.http.post<UserProfile>(
      `${this.baseUrl}/me/profile/photo`,
      formData,
    ).pipe(tap(() => this.cache.invalidatePrefix('profile:')));
  }

  removeProfilePhoto(): Observable<UserProfile> {
    return this.http.delete<UserProfile>(`${this.baseUrl}/me/profile/photo`).pipe(tap(() => this.cache.invalidatePrefix('profile:')));
  }
}
