import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification.model';
import { LoaderService } from '../../core/loader.service';

// Notification types that relate to Travel Match Requests. Clicking one of
// these takes the user to the existing Match Requests page.
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

  constructor(
    private notificationService: NotificationService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Clicking an unread notification marks it as read (backend verifies
  // ownership by JWT user - no id from here can touch another user's data),
  // refreshes the unread badge, then navigates to wherever that notification
  // type points, reusing existing pages/routes rather than building new ones.
  openNotification(notification: Notification) {
    if (notification.read) {
      this.navigateForNotification(notification);
      return;
    }

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.notificationService.refreshUnreadCount();
        this.navigateForNotification(notification);
      },
      error: (err) => console.error(err)
    });
  }

  private navigateForNotification(notification: Notification) {
    if (MATCH_REQUEST_TYPES.includes(notification.type)) {
      this.router.navigate(['/requests']);
      return;
    }

    if (notification.type === 'PROFILE_VIEW' && notification.relatedEntityId) {
      // relatedEntityId holds the viewer's user id - reuse the existing
      // profile route to show the viewer's profile.
      this.router.navigate(['/profile', notification.relatedEntityId]);
      return;
    }

    if (notification.type === 'NEW_MESSAGE' && notification.relatedEntityId) {
      // relatedEntityId holds the message sender's user id - reuse the
      // existing chat route to open that conversation.
      this.router.navigate(['/chat', notification.relatedEntityId]);
      return;
    }

    if (notification.type === 'POST_LIKE') {
      // Opening the exact liked post isn't supported by the existing feed
      // route, so - per scope - we just take the user to the existing Feed
      // page rather than building new deep-linking infrastructure.
      this.router.navigate(['/feed']);
    }
  }

  markAllAsRead() {
    if (!this.hasUnread) return;

    this.loader.show('Marking all as read...');
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.loader.hide();
        this.notifications.forEach(n => n.read = true);
        this.notificationService.refreshUnreadCount();
      },
      error: () => {
        this.loader.hide();
        alert('Failed to mark all as read');
      }
    });
  }

  typeLabel(type: string): string {
    return type.replace(/_/g, ' ');
  }

  get hasUnread(): boolean {
    return this.notifications.some(n => !n.read);
  }
}