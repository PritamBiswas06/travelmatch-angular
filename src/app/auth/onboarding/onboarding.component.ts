import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { PushNotificationService } from '../../notifications/push-notification.service';
import { ToastService } from '../../shared/toast/toast.service';

type OnboardingStep = 'terms' | 'notifications';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  step: OnboardingStep = 'terms';
  termsAccepted = false;
  processing = false;
  notificationStatus: 'unknown' | 'enabled' | 'skipped' | 'unsupported' | 'denied' = 'unknown';

  constructor(
    private authService: AuthService,
    private pushService: PushNotificationService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isOnboardingRequired()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Resume correctly if the browser was refreshed after Terms acceptance.
    this.authService.getOnboardingStatus().subscribe({
      next: (status) => {
        if (!status.requiresOnboarding) {
          this.authService.setOnboardingRequired(false);
          this.router.navigate(['/dashboard']);
          return;
        }

        if (status.termsAccepted) {
          this.step = 'notifications';
        }
      },
      error: (err) => {
        console.error('Unable to load onboarding status', err);
      }
    });
  }

  acceptTerms(): void {
    if (!this.termsAccepted || this.processing) {
      return;
    }

    this.processing = true;

    this.authService.acceptTerms().subscribe({
      next: () => {
        this.processing = false;
        this.step = 'notifications';
      },
      error: (err) => {
        this.processing = false;
        this.toast.error(
          err?.error?.message ||
          'We could not save your acceptance. Please try again.'
        );
      }
    });
  }

  async allowNotifications(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    try {
      const status = await this.pushService.enable();

      if (status === 'subscribed') {
        this.notificationStatus = 'enabled';
        this.toast.success('Push notifications enabled');
      } else if (status === 'unsupported') {
        this.notificationStatus = 'unsupported';
      } else if (status === 'denied') {
        this.notificationStatus = 'denied';
      } else {
        this.notificationStatus = 'skipped';
      }

      await this.finishOnboarding();
    } catch (err) {
      console.error('Notification onboarding failed', err);
      this.notificationStatus = 'skipped';
      await this.finishOnboarding();
    }
  }

  async skipNotifications(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;
    this.notificationStatus = 'skipped';

    await this.finishOnboarding();
  }

  private async finishOnboarding(): Promise<void> {
    try {
      await firstValueFrom(this.authService.completeOnboarding());
      this.authService.setOnboardingRequired(false);
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.processing = false;
      this.toast.error(
        err?.error?.message ||
        'We could not finish setup. Please try again.'
      );
    }
  }
}
