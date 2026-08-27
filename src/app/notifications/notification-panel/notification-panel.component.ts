import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { NotificationService } from '../notification.service';
import { Notification } from '../notification.model';
import { LoaderService } from '../../core/loader.service';
import { PushNotificationService, PushPermissionState } from '../push-notification.service';


// Notification types that relate to Travel Match Requests.
const MATCH_REQUEST_TYPES = [
  'MATCH_REQUEST_RECEIVED',
  'MATCH_REQUEST_ACCEPTED',
  'MATCH_REQUEST_REJECTED'
];

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.css']
})
export class NotificationPanelComponent implements OnInit {

  notifications: Notification[] = [];

  loading = true;

  // ==================== WEB PUSH ====================

  pushStatus: PushPermissionState = 'not-subscribed';
  pushBusy = false;

  constructor(
    private notificationService: NotificationService,
    private pushNotificationService: PushNotificationService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();

    // Check current browser push permission/subscription status.
    this.pushNotificationService.getStatus()
      .then(status => {
        this.pushStatus = status;
      })
      .catch(err => {
        console.error('Unable to determine push notification status:', err);
        this.pushStatus = 'not-subscribed';
      });
  }

  // ==================== NOTIFICATIONS ====================

  loadNotifications(): void {
    this.loading = true;

    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res || [];
        this.loading = false;
      },

      error: (err) => {
        console.error('Failed to load notifications:', err);
        this.loading = false;
      }
    });
  }

  // ==================== WEB PUSH ====================

  enablePush(): void {
    if (this.pushBusy) {
      return;
    }

    this.pushBusy = true;

    this.pushNotificationService.enable()
      .then(status => {
        this.pushStatus = status;
      })
      .catch(err => {
        console.error('Failed to enable push notifications:', err);
        this.pushStatus = 'not-subscribed';
      })
      .finally(() => {
        this.pushBusy = false;
      });
  }

  disablePush(): void {
    if (this.pushBusy) {
      return;
    }

    this.pushBusy = true;

    this.pushNotificationService.disable()
      .then(() => {
        this.pushStatus = 'not-subscribed';
      })
      .catch(err => {
        console.error('Failed to disable push notifications:', err);
      })
      .finally(() => {
        this.pushBusy = false;
      });
  }

  // ==================== OPEN NOTIFICATION ====================

  openNotification(notification: Notification): void {

    // Already read → just navigate.
    if (notification.read) {
      this.navigateForNotification(notification);
      return;
    }

    this.notificationService.markAsRead(notification.id).subscribe({

      next: () => {

        notification.read = true;

        // Refresh sidebar/topbar unread badge.
        this.notificationService.refreshUnreadCount();

        this.navigateForNotification(notification);
      },

      error: (err) => {
        console.error('Failed to mark notification as read:', err);

        // Still allow the user to navigate even if marking as read fails.
        this.navigateForNotification(notification);
      }
    });
  }

  // ==================== NOTIFICATION NAVIGATION ====================

  private navigateForNotification(notification: Notification): void {

    // Match request notifications
    if (MATCH_REQUEST_TYPES.includes(notification.type)) {
      this.router.navigate(['/requests']);
      return;
    }

    // Profile view notification
    if (
      notification.type === 'PROFILE_VIEW' &&
      notification.relatedEntityId
    ) {
      // relatedEntityId contains the viewer's user id.
      this.router.navigate([
        '/profile',
        notification.relatedEntityId
      ]);

      return;
    }

    // New chat message
    if (
      notification.type === 'NEW_MESSAGE' &&
      notification.relatedEntityId
    ) {
      // relatedEntityId contains the message sender's user id.
      this.router.navigate([
        '/chat',
        notification.relatedEntityId
      ]);

      return;
    }

    // Post like
    if (notification.type === 'POST_LIKE') {
      this.router.navigate(['/feed']);
      return;
    }
  }

  // ==================== MARK ALL AS READ ====================

  markAllAsRead(): void {

    if (!this.hasUnread) {
      return;
    }

    this.loader.show('Marking all as read...');

    this.notificationService.markAllAsRead().subscribe({

      next: () => {

        this.loader.hide();

        this.notifications.forEach(notification => {
          notification.read = true;
        });

        this.notificationService.refreshUnreadCount();
      },

      error: (err) => {

        this.loader.hide();

        console.error('Failed to mark all notifications as read:', err);

        alert('Failed to mark all as read');
      }
    });
  }

  // ==================== HELPERS ====================

  typeLabel(type: string): string {
    return type.replace(/_/g, ' ');
  }

  get hasUnread(): boolean {
    return this.notifications.some(
      notification => !notification.read
    );
  }
}