import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  PremiumService,
  PremiumStatus,
  SubscriptionResponse,
} from './premium.service';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.css'],
})
export class PremiumComponent implements OnInit {

  status: PremiumStatus | null = null;

  subscription: SubscriptionResponse | null = null;

  views: any[] = [];
  showViews = false;

  loading = true;
  paying = false;

  error = '';
  success = '';

  constructor(private p: PremiumService) {}

  ngOnInit(): void {
    this.load();
  }

  // ==================== PREMIUM STATUS ====================

  load(): void {
    this.loading = true;
    this.error = '';

    this.p.status().subscribe({
      next: (s) => {
        this.status = s;
        this.loading = false;
      },

      error: (e) => {
        console.error('Unable to load Premium status:', e);

        this.error =
          e?.error?.message ||
          'Unable to load Premium status';

        this.loading = false;
      },
    });
  }

  // ==================== PROFILE VIEWS ====================

  loadViews(): void {

    // Prevent unnecessary calls when already opened
    if (this.showViews) {
      this.showViews = false;
      return;
    }

    /*
     * IMPORTANT:
     * This requires PremiumService to contain a method for
     * retrieving profile views.
     *
     * Example:
     * this.p.getProfileViews()
     *
     * If your service uses a different method name, use that
     * existing method here rather than creating a new API.
     */

    const service = this.p as any;

    if (typeof service.getProfileViews !== 'function') {
      this.error =
        'Profile visitors service is not available yet.';
      return;
    }

    this.error = '';

    service.getProfileViews().subscribe({
      next: (result: any[]) => {
        this.views = result || [];
        this.showViews = true;
      },

      error: (e: any) => {
        console.error('Unable to load profile visitors:', e);

        this.error =
          e?.error?.message ||
          'Unable to load profile visitors.';

        this.showViews = false;
      },
    });
  }

  // ==================== SUBSCRIBE ====================

  subscribe(): void {

    if (this.paying) {
      return;
    }

    this.paying = true;
    this.error = '';
    this.success = '';

    this.p.createPremiumOrder().subscribe({

      next: (o) => {
        this.open(o);
      },

      error: (e) => {

        console.error('Unable to create payment order:', e);

        this.error =
          e?.error?.message ||
          'Unable to create payment order';

        this.paying = false;
      },
    });
  }

  // ==================== RAZORPAY ====================

  private open(o: any): void {

    if (!window.Razorpay) {

      this.script()
        .then(() => this.open(o))
        .catch(() => {

          this.error =
            'Razorpay could not be loaded.';

          this.paying = false;
        });

      return;
    }

    const rp = new window.Razorpay({

      key: o.keyId,

      amount: o.amount,

      currency: o.currency,

      name: 'TravelMatch',

      description: 'TravelMatch Premium - 30 days',

      order_id: o.orderId,

      handler: (r: any) => this.verify(r),

      modal: {
        ondismiss: () => {
          this.paying = false;
        },
      },
    });

    rp.on('payment.failed', (r: any) => {

      this.error =
        r?.error?.description ||
        'Payment failed';

      this.paying = false;
    });

    rp.open();
  }

  // ==================== VERIFY PAYMENT ====================

  private verify(r: any): void {

    this.p.verifyPremium({

      orderId: r.razorpay_order_id,

      paymentId: r.razorpay_payment_id,

      signature: r.razorpay_signature,

    }).subscribe({

      next: (s) => {

        this.subscription = s;

        this.success =
          'Premium activated successfully.';

        this.paying = false;

        this.load();
      },

      error: (e) => {

        console.error(
          'Payment verification failed:',
          e
        );

        this.error =
          e?.error?.message ||
          'Payment verification failed';

        this.paying = false;
      },
    });
  }

  // ==================== CANCEL PREMIUM ====================

  cancel(): void {

    if (!confirm('Cancel your Premium subscription?')) {
      return;
    }

    this.p.cancelPremium().subscribe({

      next: (s) => {

        this.subscription = s;

        this.success =
          'Premium subscription cancelled.';

        this.load();
      },

      error: (e) => {

        console.error(
          'Unable to cancel subscription:',
          e
        );

        this.error =
          e?.error?.message ||
          'Unable to cancel subscription';
      },
    });
  }

  // ==================== RAZORPAY SCRIPT ====================

  private script(): Promise<void> {

    return new Promise((resolve, reject) => {

      // Avoid adding the script twice
      const existing =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existing) {
        resolve();
        return;
      }

      const s =
        document.createElement('script');

      s.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      s.onload = () => resolve();

      s.onerror = () => reject();

      document.body.appendChild(s);
    });
  }
}