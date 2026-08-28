import { Component, OnInit } from '@angular/core';
import { TravelService } from '../travel.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../match/match.service';
import { PartnerService } from '../../partner/partner.service';
import { NotificationService } from '../../notifications/notification.service';
import { Notification } from '../../notifications/notification.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  plans: any[] = [];
  partners: any[] = [];
  requests: any[] = [];
  recentNotifications: Notification[] = [];
  userName = '';
  sortType = 'latest';
  loading = true;
  requestsLoaded = false;
  partnersLoaded = false;
  notificationsLoaded = false;

  constructor(
    private travelService: TravelService,
    private matchService: MatchService,
    private partnerService: PartnerService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('name') || 'Guest';
    this.loadPlans();
    this.loadPartners();
    this.loadRequests();
    this.loadNotifications();
  }

  loadPlans(): void {
    this.travelService.getMyPlans().subscribe({
      next: (res: any) => {
        this.plans = Array.isArray(res) ? res : [];
        this.sortPlans();
        this.updateLoadingState();
      },
      error: (err) => {
        console.error('Failed to load travel plans', err);
        this.plans = [];
        this.updateLoadingState();
      }
    });
  }

  loadPartners(): void {
    this.partnerService.getMyPartners().subscribe({
      next: (res: any) => {
        this.partners = Array.isArray(res) ? res : [];
        this.partnersLoaded = true;
        this.updateLoadingState();
      },
      error: (err) => {
        console.error('Failed to load partners', err);
        this.partners = [];
        this.partnersLoaded = true;
        this.updateLoadingState();
      }
    });
  }

  loadRequests(): void {
    this.matchService.getMyRequests().subscribe({
      next: (res: any) => {
        this.requests = Array.isArray(res) ? res : [];
        this.requestsLoaded = true;
        this.updateLoadingState();
      },
      error: (err) => {
        console.error('Failed to load requests', err);
        this.requests = [];
        this.requestsLoaded = true;
        this.updateLoadingState();
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res: Notification[]) => {
        this.recentNotifications = (res || []).slice(0, 5);
        this.notificationsLoaded = true;
        this.updateLoadingState();
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
        this.recentNotifications = [];
        this.notificationsLoaded = true;
        this.updateLoadingState();
      }
    });
  }

  private updateLoadingState(): void {
    this.loading = !this.partnersLoaded || !this.requestsLoaded || !this.notificationsLoaded;
  }

  sortPlans(): void {
    if (this.sortType === 'latest') {
      this.plans.sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    }

    if (this.sortType === 'budget') {
      this.plans.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
    }

    if (this.sortType === 'date') {
      this.plans.sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    }
  }

  onSortChange(event: Event): void {
    this.sortType = (event.target as HTMLSelectElement).value;
    this.sortPlans();
  }

  goToCreatePlan(): void {
    this.router.navigate(['/create-plan']);
  }

  goToMatches(planId: number): void {
    this.router.navigate(['/matches'], { queryParams: { planId } });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  get unreadNotifications(): number {
    return this.recentNotifications.filter(n => !n.read).length;
  }

  get pendingRequests(): number {
    return this.requests.length;
  }

  get destinationSummary(): { name: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const plan of this.plans) {
      const destination = String(plan.destination || '').trim();
      if (!destination) continue;
      counts.set(destination, (counts.get(destination) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }

  partnerName(partner: any): string {
    const currentUserId = Number(localStorage.getItem('userId'));
    return partner?.userOne?.id === currentUserId
      ? partner?.userTwo?.name || 'Travel Partner'
      : partner?.userOne?.name || 'Travel Partner';
  }

  partnerId(partner: any): number | null {
    const currentUserId = Number(localStorage.getItem('userId'));
    if (partner?.userOne?.id === currentUserId) return partner?.userTwo?.id || null;
    return partner?.userOne?.id || null;
  }

  partnerLocation(partner: any): string {
    const currentUserId = Number(localStorage.getItem('userId'));
    const user = partner?.userOne?.id === currentUserId ? partner?.userTwo : partner?.userOne;
    return [user?.city, user?.country].filter(Boolean).join(', ') || 'TravelMatch partner';
  }

  notificationIcon(type: string): string {
    switch (type) {
      case 'POST_LIKE': return '❤️';
      case 'PROFILE_VIEW': return '👀';
      case 'MATCH_REQUEST_RECEIVED': return '🤝';
      case 'MATCH_REQUEST_ACCEPTED': return '✅';
      case 'MATCH_REQUEST_REJECTED': return '↩️';
      case 'NEW_MESSAGE': return '💬';
      default: return '🔔';
    }
  }

  notificationText(notification: Notification): string {
    return notification.message.replace(/^\S+\s*/, '');
  }

  trackByPlanId(_index: number, plan: any): number {
    return plan.id;
  }

  trackByNotificationId(_index: number, notification: Notification): number {
    return notification.id;
  }
}