import { Component, HostListener, OnInit } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SwPush } from '@angular/service-worker';

import { ChatbotComponent } from '../../travel/chatbot/chatbot.component';
import { NotificationService } from '../../notifications/notification.service';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ChatbotComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
})
export class AppLayoutComponent implements OnInit {

  sidebarOpen = window.innerWidth > 768;
  showChatbot = false;
  private sidebarHovering = false;

  unreadCount$!: Observable<number>;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private swPush: SwPush,
    private modalService: ModalService
  ) {}

  get myUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  ngOnInit(): void {
    this.unreadCount$ = this.notificationService.unreadCount$;
    this.notificationService.refreshUnreadCount();

    if (this.swPush.isEnabled) {
      this.swPush.messages.subscribe({
        next: () => this.notificationService.refreshUnreadCount(),
        error: (err) => console.error('Service Worker push message error:', err)
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarAfterNavigation(): void {
    if (window.innerWidth <= 768 || this.sidebarHovering) {
      this.sidebarOpen = false;
      this.sidebarHovering = false;
      return;
    }

    // Keep desktop navigation compact after a selection, matching the
    // collapsed navigation style while still allowing hover expansion.
    this.sidebarOpen = false;
  }

  onSidebarEnter(): void {
    if (window.innerWidth > 768 && !this.sidebarOpen) {
      this.sidebarHovering = true;
      this.sidebarOpen = true;
    }
  }

  onSidebarLeave(): void {
    if (window.innerWidth > 768 && this.sidebarHovering) {
      this.sidebarHovering = false;
      this.sidebarOpen = false;
    }
  }

  closeSidebarOnBackdrop(): void {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
  }

  async logout(): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Are you sure you want to logout?',
      'Ready to leave?',
      'Yes, Logout',
      'Stay Here'
    );

    if (!confirmed) return;

    localStorage.clear();
    await this.router.navigate(['/']);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768) {
      this.sidebarOpen = false;
      this.sidebarHovering = false;
    } else {
      this.sidebarOpen = false;
      this.sidebarHovering = false;
    }
  }
}