import { Component, HostListener } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { LoaderService } from '../../core/loader.service';

import { DataCacheService } from '../../core/data-cache.service';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',

  standalone: true,

  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],

  templateUrl: './admin-layout.component.html',

  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  sidebarOpen = window.innerWidth > 768;

  private sidebarHovering = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private dataCache: DataCacheService,
    private authService: AuthService,
  ) {}

  get adminName(): string {
    return localStorage.getItem('name') || 'Administrator';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
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

  closeSidebarAfterNavigation(): void {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;

      return;
    }

    this.sidebarOpen = false;

    this.sidebarHovering = false;
  }

  closeSidebarOnBackdrop(): void {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  backToTravelMatch(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    /*
     * Stop any global loader state.
     */
    this.loaderService.reset();

    /*
     * Clear all authenticated user's
     * in-memory API data.
     */
    this.dataCache.clear();

    /*
     * Remove token, role, user information
     * and the 10-day expiry timestamp.
     */
    this.authService.clearAuthentication();

    /*
     * Return to public website.
     */
    this.router.navigate(['/']);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.sidebarOpen = false;

    this.sidebarHovering = false;
  }
}
