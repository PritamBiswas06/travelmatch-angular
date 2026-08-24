import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification.model';
import { LoaderService } from '../../core/loader.service';

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
    private loader: LoaderService
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
  // ownership by JWT user - no id from here can touch another user's data).
  openNotification(notification: Notification) {
    if (notification.read) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.notificationService.refreshUnreadCount();
      },
      error: (err) => console.error(err)
    });
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