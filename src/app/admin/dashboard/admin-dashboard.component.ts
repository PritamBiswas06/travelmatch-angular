import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  AdminAuditLog,
  AdminDashboard,
  AdminMatchRequest,
  AdminPartner,
  AdminReport,
  AdminReview,
  AdminService,
  AdminTrip,
  AdminUser,
  PageResponse
} from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  dashboardData?: AdminDashboard;

  users: PageResponse<AdminUser> | null = null;
  trips: PageResponse<AdminTrip> | null = null;
  reports: PageResponse<AdminReport> | null = null;
  reviews: PageResponse<AdminReview> | null = null;
  matchRequests: PageResponse<AdminMatchRequest> | null = null;
  partners: PageResponse<AdminPartner> | null = null;
  auditLogs: PageResponse<AdminAuditLog> | null = null;

  loading = false;

  error = '';
  success = '';

  search = '';
  reportStatus = '';

  page = 0;

  readonly size = 15;

  constructor(
    private admin: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentSection();
  }

  // ============================================================
  // CURRENT SECTION
  // ============================================================

  get section(): string {

    const url = this.router.url;

    if (url.includes('/users')) {
      return 'users';
    }

    if (url.includes('/trips')) {
      return 'trips';
    }

    if (url.includes('/reports')) {
      return 'reports';
    }

    if (url.includes('/reviews')) {
      return 'reviews';
    }

    if (url.includes('/match-requests')) {
      return 'match-requests';
    }

    if (url.includes('/partners')) {
      return 'partners';
    }

    if (url.includes('/audit-logs')) {
      return 'audit-logs';
    }

    return 'dashboard';
  }

  // ============================================================
  // LOAD CURRENT SECTION
  // ============================================================

  loadCurrentSection(): void {

    this.loading = true;
    this.error = '';

    const finish = () => {
      this.loading = false;
    };

    // DASHBOARD
    if (this.section === 'dashboard') {

      this.admin.dashboard().subscribe({
        next: (value: AdminDashboard) => {
          this.dashboardData = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // USERS
    else if (this.section === 'users') {

      this.admin.users(
        this.page,
        this.size,
        this.search
      ).subscribe({

        next: (value: PageResponse<AdminUser>) => {
          this.users = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // TRIPS
    else if (this.section === 'trips') {

      this.admin.trips(
        this.page,
        this.size,
        this.search
      ).subscribe({

        next: (value: PageResponse<AdminTrip>) => {
          this.trips = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // REPORTS
    else if (this.section === 'reports') {

      this.admin.reports(
        this.page,
        this.size,
        this.reportStatus
      ).subscribe({

        next: (value: PageResponse<AdminReport>) => {
          this.reports = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // REVIEWS
    else if (this.section === 'reviews') {

      this.admin.reviews(
        this.page,
        this.size
      ).subscribe({

        next: (value: PageResponse<AdminReview>) => {
          this.reviews = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // MATCH REQUESTS
    else if (this.section === 'match-requests') {

      this.admin.matchRequests(
        this.page,
        this.size
      ).subscribe({

        next: (value: PageResponse<AdminMatchRequest>) => {
          this.matchRequests = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // PARTNERS
    else if (this.section === 'partners') {

      this.admin.partners(
        this.page,
        this.size
      ).subscribe({

        next: (value: PageResponse<AdminPartner>) => {
          this.partners = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }

    // AUDIT LOGS
    else {

      this.admin.auditLogs(
        this.page,
        this.size,
        this.search
      ).subscribe({

        next: (value: PageResponse<AdminAuditLog>) => {
          this.auditLogs = value;
        },

        error: (e: any) => {
          this.handleError(e);
        },

        complete: finish
      });

    }
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  navigate(section: string): void {

    this.page = 0;
    this.search = '';
    this.reportStatus = '';

    this.router.navigate([
      '/admin',
      section === 'dashboard'
        ? 'dashboard'
        : section
    ]);
  }

  // ============================================================
  // SEARCH
  // ============================================================

  searchNow(): void {

    this.page = 0;

    this.loadCurrentSection();
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  nextPage(): void {

    const data = this.currentPageData();

    if (
      data &&
      this.page + 1 < data.totalPages
    ) {

      this.page++;

      this.loadCurrentSection();
    }
  }

  previousPage(): void {

    if (this.page > 0) {

      this.page--;

      this.loadCurrentSection();
    }
  }

  currentPageData(): PageResponse<any> | null {

    switch (this.section) {

      case 'users':
        return this.users;

      case 'trips':
        return this.trips;

      case 'reports':
        return this.reports;

      case 'reviews':
        return this.reviews;

      case 'match-requests':
        return this.matchRequests;

      case 'partners':
        return this.partners;

      case 'audit-logs':
        return this.auditLogs;

      default:
        return null;
    }
  }

  // ============================================================
  // USER MODERATION
  // ============================================================

  changeUserStatus(
    user: AdminUser,
    status: string
  ): void {

    if (
      !confirm(
        `Change ${user.name}'s account status to ${status}?`
      )
    ) {
      return;
    }

    this.runAction(
      this.admin.updateUserStatus(
        user.id,
        status
      ),
      'User status updated.'
    );
  }

  // ============================================================
  // USER ROLE
  // ============================================================

  changeUserRole(
    user: AdminUser,
    role: string
  ): void {

    if (
      !confirm(
        `Change ${user.name}'s role to ${role}?`
      )
    ) {
      return;
    }

    this.runAction(
      this.admin.updateUserRole(
        user.id,
        role
      ),
      'User role updated.'
    );
  }

  // ============================================================
  // TRIP MODERATION
  // ============================================================

  changeTripStatus(
    trip: AdminTrip,
    status: string
  ): void {

    if (
      !confirm(
        `Change trip #${trip.id} status to ${status}?`
      )
    ) {
      return;
    }

    this.runAction(
      this.admin.updateTripStatus(
        trip.id,
        status
      ),
      'Trip status updated.'
    );
  }

  // ============================================================
  // REPORT MODERATION
  // ============================================================

  changeReportStatus(
    report: AdminReport,
    status: string
  ): void {

    if (
      !confirm(
        `Mark report #${report.id} as ${status}?`
      )
    ) {
      return;
    }

    this.runAction(
      this.admin.updateReport(
        report.id,
        status
      ),
      'Report updated.'
    );
  }

  // ============================================================
  // REPORT NOTE
  // ============================================================

  addNote(
    report: AdminReport
  ): void {

    const note = prompt(
      'Enter an internal moderation note:'
    );

    if (!note?.trim()) {
      return;
    }

    this.runAction(
      this.admin.addReportNote(
        report.id,
        note.trim()
      ),
      'Moderation note saved.'
    );
  }

  // ============================================================
  // REVIEW MODERATION
  // ============================================================

  removeReview(
    review: AdminReview
  ): void {

    const reason = prompt(
      'Reason for removing this review:'
    );

    if (reason === null) {
      return;
    }

    if (
      !confirm(
        'Remove this review? This action cannot be undone.'
      )
    ) {
      return;
    }

    this.runAction(
      this.admin.removeReview(
        review.id,
        reason.trim()
      ),
      'Review removed.'
    );
  }

  // ============================================================
  // COMMON ACTION HANDLER
  // ============================================================

  private runAction(
    observable: any,
    message: string
  ): void {

    this.loading = true;
    this.error = '';

    observable.subscribe({

      next: () => {

        this.success = message;

        this.loadCurrentSection();

        setTimeout(() => {
          this.success = '';
        }, 3500);
      },

      error: (e: any) => {
        this.handleError(e);
      }

    });
  }

  // ============================================================
  // ERROR HANDLER
  // ============================================================

  private handleError(
    error: any
  ): void {

    this.loading = false;

    this.error =
      error?.status === 403
        ? 'You do not have permission to access the admin panel.'

        : error?.status === 401
          ? 'Your session has expired. Please log in again.'

          : error?.error?.message
            || 'Unable to complete the admin request. Please try again.';
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(
    _: number,
    item: any
  ): number {

    return item.id;
  }
}