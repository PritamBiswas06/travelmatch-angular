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

export const routes: Routes = [

  // 🌍 Public Pages
  { path: '', component: LandingComponent, pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'about',
    component: AboutComponent
  },

  // Email verification
  { path: 'verify-email', component: VerifyEmailComponent },

  // 🔑 Forgot password flow
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-reset', component: VerifyResetComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // 🔐 Protected Layout Wrapper
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard', component: DashboardComponent },

      { path: 'create-plan', component: CreatePlanComponent },

      { path: 'matches', component: MatchesComponent },

      { path: 'feed', component: FeedComponent },

      { path: 'profile/:id', component: UserProfileComponent },

      { path: 'requests', component: RequestsComponent },

      { path: 'partners', component: PartnersComponent },

      { path: 'notifications', component: NotificationPanelComponent },

      // 🔒 Chat protected with extra guard
      {
        path: 'chat/:id',
        component: ChatRoomComponent,
        canActivate: [ChatGuard]
      }

    ]
  },

  // ❌ fallback
  { path: '**', redirectTo: '' }

];