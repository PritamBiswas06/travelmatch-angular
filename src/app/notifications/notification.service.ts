import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  // GET /api/notifications
  getNotifications() {
    return this.http.get<Notification[]>(this.baseUrl);
  }

  // GET /api/notifications/unread-count
  getUnreadCount() {
    return this.http.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`);
  }

  // PUT /api/notifications/{id}/read
  markAsRead(id: number) {
    return this.http.put<Notification>(`${this.baseUrl}/${id}/read`, {});
  }

  // DELETE /api/notifications/{id}
  deleteNotification(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // PUT /api/notifications/read-all
  markAllAsRead() {
    return this.http.put(`${this.baseUrl}/read-all`, {});
  }

  // Call on layout init and after any read / mark-all-read action so the
  // sidebar badge always reflects the latest unread count.
  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (res) => this.unreadCountSubject.next(res.unreadCount),
      error: (err) => console.error('Failed to load unread notification count', err)
    });
  }
}