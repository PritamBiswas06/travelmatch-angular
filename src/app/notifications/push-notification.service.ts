import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export type PushPermissionState = 'unsupported' | 'not-subscribed' | 'subscribed' | 'denied';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {

  private baseUrl = `${API_BASE_URL}/push`;

  constructor(private http: HttpClient, private swPush: SwPush) {}

  get isSupported(): boolean {
    return this.swPush.isEnabled;
  }

  async getStatus(): Promise<PushPermissionState> {
    if (!this.isSupported) return 'unsupported';
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return 'denied';
    const subscription = await firstValueFrom(this.swPush.subscription);
    return subscription ? 'subscribed' : 'not-subscribed';
  }

  async enable(): Promise<PushPermissionState> {
    if (!this.isSupported) return 'unsupported';
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return 'denied';

    try {
      const { publicKey } = await firstValueFrom(
        this.http.get<{ publicKey: string }>(`${this.baseUrl}/public-key`)
      );

      const subscription = await this.swPush.requestSubscription({ serverPublicKey: publicKey });

      await firstValueFrom(this.http.post(`${this.baseUrl}/subscribe`, subscription.toJSON()));

      return 'subscribed';
    } catch (err) {
      console.error('Failed to enable push notifications', err);
      return (typeof Notification !== 'undefined' && Notification.permission === 'denied')
        ? 'denied' : 'not-subscribed';
    }
  }

  async disable(): Promise<void> {
    const subscription = await firstValueFrom(this.swPush.subscription);
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    await this.swPush.unsubscribe();
    await firstValueFrom(this.http.post(`${this.baseUrl}/unsubscribe`, { endpoint }));
  }
}