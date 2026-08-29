import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafetyService, ReportReason } from '../../core/safety.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent {
  @Input({ required: true }) targetType: 'user' | 'post' = 'user';
  @Input({ required: true }) targetId!: number;
  @Input() targetName = 'this traveler';
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  readonly reasons: { value: ReportReason; label: string }[] = [
    { value: 'SPAM', label: 'Spam' },
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'FAKE_PROFILE', label: 'Fake Profile' },
    { value: 'INAPPROPRIATE', label: 'Inappropriate' },
    { value: 'SCAM', label: 'Scam' },
    { value: 'OTHER', label: 'Other' }
  ];

  reason: ReportReason | '' = '';
  description = '';
  submitting = false;

  constructor(
    private safetyService: SafetyService,
    private toast: ToastService
  ) {}

  submit(): void {
    if (!this.reason || this.submitting || !this.targetId) return;

    this.submitting = true;

    const request = {
      reason: this.reason as ReportReason,
      ...(this.description.trim()
        ? { description: this.description.trim() }
        : {})
    };

    const request$ = this.targetType === 'user'
      ? this.safetyService.reportUser(this.targetId, request)
      : this.safetyService.reportPost(this.targetId, request);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.toast.success(
          'Report submitted. Thank you for helping keep TravelMatch safe.'
        );
        this.submitted.emit();
        this.closed.emit();
      },
      error: (err) => {
        this.submitting = false;
        const message = err?.error?.message;

        if (err?.status === 409) {
          this.toast.warning(message || 'You have already submitted this report.');
        } else if (err?.status === 401) {
          this.toast.error('Please sign in again to submit a report.');
        } else if (err?.status === 404) {
          this.toast.error('The item you are trying to report was not found.');
        } else {
          this.toast.error(message || 'Unable to submit the report. Please try again.');
        }
      }
    });
  }

  close(): void {
    if (!this.submitting) {
      this.closed.emit();
    }
  }
}
