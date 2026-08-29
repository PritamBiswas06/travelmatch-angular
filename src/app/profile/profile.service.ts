import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

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
  upcomingTrips: ProfileTrip[];

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

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}/profile`);
  }

  deleteTravelPlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/travel/${planId}`);
  }

  updateMyProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/me/profile`, data);
  }

  uploadProfilePhoto(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);
    // No explicit Content-Type header here — the browser sets the
    // multipart boundary automatically when the body is a FormData.
    return this.http.post<UserProfile>(
      `${this.baseUrl}/me/profile/photo`,
      formData,
    );
  }

  removeProfilePhoto(): Observable<UserProfile> {
    return this.http.delete<UserProfile>(`${this.baseUrl}/me/profile/photo`);
  }
}

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
