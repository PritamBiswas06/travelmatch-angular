import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from "../../travel/chatbot/chatbot.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ChatbotComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
})
export class AppLayoutComponent {
  constructor(private router: Router) {}

  sidebarOpen = window.innerWidth > 768;
  showChatbot = false;

  // Used by the sidebar's "Profile" link to route to the logged-in user's
  // own profile at /profile/:id, reusing the same route Feed's "View
  // Profile" already navigates to.
  get myUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleChatbot() {
    this.showChatbot = !this.showChatbot;
  }

  logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // auto-close sidebar on mobile when resizing down, auto-open on resizing up
  @HostListener('window:resize')
  onResize() {
    this.sidebarOpen = window.innerWidth > 768;
  }
}