import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ChatbotComponent } from '../../travel/chatbot/chatbot.component';
import { NotificationService } from '../../notifications/notification.service';

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

  unreadCount$!: Observable<number>;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  get myUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  ngOnInit(): void {
    this.unreadCount$ = this.notificationService.unreadCount$;
    this.notificationService.refreshUnreadCount();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
  }

  logout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (!confirmLogout) return;

    localStorage.clear();
    this.router.navigate(['/']);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.sidebarOpen = window.innerWidth > 768;
  }
}