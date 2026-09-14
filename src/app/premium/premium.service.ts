import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DataCacheService } from '../core/data-cache.service';
import { API_BASE_URL } from '../config/api.config';

export interface PremiumStatus {
  premium: boolean;
  plan: string;
  status: string;
  price: number;
  boostPrice: number;
  freeRequestLimit: number;
  affiliateEnabled: boolean;
  flightPartnerUrl: string;
  hotelPartnerUrl: string;
  insuranceUrl: string;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  type: string;
  referenceId: number | null;
}

export interface SubscriptionResponse {
  plan: string;
  status: string;
  premium: boolean;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
}

export interface ProfileView {
  userId: number;
  name: string;
  username: string | null;
  profilePhotoUrl: string | null;
  city: string | null;
  viewedAt: string;
}

export interface BoostResponse {
  travelPlanId: number;
  active: boolean;
  multiplier: number;
  startedAt: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class PremiumService {
  private readonly base = `${API_BASE_URL}/monetization`;

  constructor(
    private http: HttpClient,
    private cache: DataCacheService
  ) {}

  status(): Observable<PremiumStatus> {
    return this.cache.get(
      'premium:status',
      () => this.http.get<PremiumStatus>(`${this.base}/status`)
    );
  }

  createPremiumOrder(): Observable<PaymentOrder> {
    return this.http.post<PaymentOrder>(`${this.base}/premium/order`, {});
  }

  verifyPremium(data: { orderId: string; paymentId: string; signature: string }): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.base}/premium/verify`, data).pipe(
      tap(() => this.cache.invalidate('premium:status'))
    );
  }

  cancelPremium(): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.base}/premium/cancel`, {}).pipe(
      tap(() => this.cache.invalidate('premium:status'))
    );
  }

  profileViews(): Observable<ProfileView[]> {
    return this.cache.get(
      'premium:views',
      () => this.http.get<ProfileView[]>(`${this.base}/profile/views`)
    );
  }

  createBoostOrder(id: number): Observable<PaymentOrder> {
    return this.http.post<PaymentOrder>(`${this.base}/boost/${id}/order`, {});
  }

  verifyBoost(id: number, data: { orderId: string; paymentId: string; signature: string }): Observable<BoostResponse> {
    return this.http.post<BoostResponse>(`${this.base}/boost/${id}/verify`, data);
  }
}
