import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Observable } from 'rxjs';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  deactivatedUsers: number;
  totalTrips: number;
  activeTrips: number;
  totalReports: number;
  pendingReports: number;
  totalReviews: number;
  totalMatchRequests: number;
  acceptedMatchRequests: number;
  totalPartners: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  username?: string;
  city?: string;
  verified: boolean;
  role: string;
  accountStatus: string;
  createdAt: string;
}

export interface AdminTrip {
  id: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  status: string;
  createdAt: string;
}

export interface AdminReport {
  id: number;
  reporterId?: number;
  reporterName?: string;
  reportedUserId?: number;
  reportedUserName?: string;
  reportedTravelPlanId?: number;
  destination?: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminReview {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewedUserId: number;
  reviewedUserName: string;
  travelPlanId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AdminMatchRequest {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  travelPlanId: number;
  destination: string;
  status: string;
  createdAt: string;
}

export interface AdminPartner {
  id: number;
  userOneId: number;
  userOneName: string;
  userTwoId: number;
  userTwoName: string;
  travelPlanId: number;
  destination: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: number;
  adminId: number;
  adminName: string;
  action: string;
  targetType: string;
  targetId: number;
  description: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${API_BASE_URL}/admin`;

  constructor(private http: HttpClient) {}

  dashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.baseUrl}/dashboard`);
  }

  users(page = 0, size = 20, search = ''): Observable<PageResponse<AdminUser>> {
    return this.http.get<PageResponse<AdminUser>>(`${this.baseUrl}/users`, {
      params: this.pageParams(page, size, search)
    });
  }

  updateUserStatus(id: number, status: string, reason = '') {
    return this.http.patch<AdminUser>(`${this.baseUrl}/users/${id}/status`, { value: status, reason });
  }

  updateUserRole(id: number, role: string, reason = '') {
    return this.http.patch<AdminUser>(`${this.baseUrl}/users/${id}/role`, { value: role, reason });
  }

  trips(page = 0, size = 20, search = ''): Observable<PageResponse<AdminTrip>> {
    return this.http.get<PageResponse<AdminTrip>>(`${this.baseUrl}/trips`, {
      params: this.pageParams(page, size, search)
    });
  }

  updateTripStatus(id: number, status: string, reason = '') {
    return this.http.patch<AdminTrip>(`${this.baseUrl}/trips/${id}/status`, { value: status, reason });
  }

  reports(page = 0, size = 20, status = ''): Observable<PageResponse<AdminReport>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<AdminReport>>(`${this.baseUrl}/reports`, { params });
  }

  updateReport(id: number, status: string, reason = '') {
    return this.http.patch<AdminReport>(`${this.baseUrl}/reports/${id}`, { value: status, reason });
  }

  addReportNote(id: number, note: string) {
    return this.http.patch<AdminReport>(`${this.baseUrl}/reports/${id}/note`, { value: 'NOTE', reason: note });
  }

  reviews(page = 0, size = 20): Observable<PageResponse<AdminReview>> {
    return this.http.get<PageResponse<AdminReview>>(`${this.baseUrl}/reviews`, {
      params: this.pageParams(page, size)
    });
  }

  removeReview(id: number, reason = '') {
    return this.http.delete(`${this.baseUrl}/reviews/${id}`, {
      body: { value: 'REMOVE', reason }
    });
  }

  matchRequests(page = 0, size = 20): Observable<PageResponse<AdminMatchRequest>> {
    return this.http.get<PageResponse<AdminMatchRequest>>(`${this.baseUrl}/match-requests`, {
      params: this.pageParams(page, size)
    });
  }

  partners(page = 0, size = 20): Observable<PageResponse<AdminPartner>> {
    return this.http.get<PageResponse<AdminPartner>>(`${this.baseUrl}/partners`, {
      params: this.pageParams(page, size)
    });
  }

  auditLogs(page = 0, size = 20, search = ''): Observable<PageResponse<AdminAuditLog>> {
    return this.http.get<PageResponse<AdminAuditLog>>(`${this.baseUrl}/audit-logs`, {
      params: this.pageParams(page, size, search)
    });
  }

  private pageParams(page: number, size: number, search = ''): HttpParams {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search.trim()) params = params.set('search', search.trim());
    return params;
  }
}
