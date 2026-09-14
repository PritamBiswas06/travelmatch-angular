import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { DataCacheService } from '../core/data-cache.service';
import { API_BASE_URL } from '../config/api.config';
import { Notification, UnreadCountResponse } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = `${API_BASE_URL}/notifications`;

  // Shared unread count so the sidebar 🔔 badge stays in sync with the
  // notifications page without needing a full page reload. The JWT
  // interceptor + backend always resolve notifications for the logged-in
  // user only, so no userId is ever passed from here.
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient, private cache: DataCacheService) {}

  // GET /api/notifications
  getNotifications() {
    return this.cache.get('notification:list', () => this.http.get<Notification[]>(this.baseUrl));
  }

  // GET /api/notifications/unread-count
  getUnreadCount() {
    return this.cache.get('notification:unread', () => this.http.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`));
  }

  // PUT /api/notifications/{id}/read
  markAsRead(id: number) {
    return this.http.put<Notification>(`${this.baseUrl}/${id}/read`, {}).pipe(tap(() => this.invalidateNotificationCache()));
  }

  // DELETE /api/notifications/{id}
  deleteNotification(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(tap(() => this.invalidateNotificationCache()));
  }

  // PUT /api/notifications/read-all
  markAllAsRead() {
    return this.http.put(`${this.baseUrl}/read-all`, {}).pipe(tap(() => this.invalidateNotificationCache()));
  }

  // Call on layout init and after any read / mark-all-read action so the
  // sidebar badge always reflects the latest unread count.
  refreshUnreadCount(force = false): void {
    if (force) this.cache.invalidate('notification:unread');
    const request$ = this.getUnreadCount();

    request$.subscribe({
      next: (res) => this.unreadCountSubject.next(res.unreadCount),
      error: (err) => console.error('Failed to load unread notification count', err)
    });
  }

  private invalidateNotificationCache(): void {
    this.cache.invalidate('notification:list');
    this.cache.invalidate('notification:unread');
  }
}