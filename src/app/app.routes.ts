import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyResetComponent } from './auth/verify-reset/verify-reset.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

import { DashboardComponent } from './travel/dashboard/dashboard.component';
import { CreatePlanComponent } from './travel/create-plan/create-plan.component';
import { MatchesComponent } from './travel/matches/matches.component';

import { RequestsComponent } from './match/requests/requests.component';
import { PartnersComponent } from './partner/partners/partners.component';

import { FeedComponent } from './feed/feed.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';

import { ChatRoomComponent } from './chat/chat-room/chat-room.component';

import { LandingComponent } from './pages/landing/landing.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

import { authGuard } from './core/auth.guard';
import { ChatGuard } from './guards/chat.guard';

import { AboutComponent } from './pages/about/about.component';

import { NotificationPanelComponent } from './notifications/notification-panel/notification-panel.component';

import { adminGuard } from './admin/admin.guard';


export const routes: Routes = [

  // =====================================================
  // PUBLIC
  // =====================================================

  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'about',
    component: AboutComponent
  },

  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },

  {
    path: 'verify-reset',
    component: VerifyResetComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },


  // =====================================================
  // APP LAYOUT
  // =====================================================

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],

    children: [

      // =========================
      // NORMAL USER PAGES
      // =========================

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'create-plan',
        component: CreatePlanComponent
      },

      {
        path: 'matches',
        component: MatchesComponent
      },

      {
        path: 'feed',
        component: FeedComponent
      },

      {
        path: 'profile/:id',
        component: UserProfileComponent
      },

      {
        path: 'requests',
        component: RequestsComponent
      },

      {
        path: 'partners',
        component: PartnersComponent
      },

      {
        path: 'notifications',
        component: NotificationPanelComponent
      },

      {
        path: 'chat/:id',
        component: ChatRoomComponent,
        canActivate: [ChatGuard]
      },


      // =================================================
      // ADMIN
      // =================================================

      {
        path: 'admin',
        canActivate: [adminGuard],

        children: [

          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },

          {
            path: 'dashboard',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'users',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'trips',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'reports',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'reviews',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'match-requests',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'partners',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          },

          {
            path: 'audit-logs',
            loadComponent: () =>
              import('./admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent)
          }

        ]
      }

    ]
  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',
    redirectTo: ''
  }

];