import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelerReview, TravelerReviewService } from '../traveler-review.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent {
  @Input({ required: true }) reviewedUserId!: number;
  @Input({ required: true }) travelPlanId!: number;
  @Input() travelerName = 'this traveler';

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<TravelerReview>();

  rating = 0;
  tags: string[] = [];
  comment = '';
  submitting = false;

  readonly tagOptions = [
    { value: 'FRIENDLY', label: 'Friendly' },
    { value: 'RELIABLE', label: 'Reliable' },
    { value: 'GOOD_PLANNER', label: 'Good Planner' },
    { value: 'PUNCTUAL', label: 'Punctual' },
    { value: 'FUN_TRAVELER', label: 'Fun Traveler' },
    { value: 'RESPECTFUL', label: 'Respectful' },
    { value: 'EASY_TO_TRAVEL_WITH', label: 'Easy to Travel With' }
  ];

  constructor(
    private reviewService: TravelerReviewService,
    private toast: ToastService
  ) {}

  setRating(value: number): void {
    if (!this.submitting) this.rating = value;
  }

  toggleTag(value: string): void {
    if (this.submitting) return;

    this.tags = this.tags.includes(value)
      ? this.tags.filter(tag => tag !== value)
      : [...this.tags, value];
  }

  submit(): void {
    if (!this.rating || this.submitting || !this.reviewedUserId || !this.travelPlanId) {
      return;
    }

    this.submitting = true;

    this.reviewService.create({
      reviewedUserId: this.reviewedUserId,
      travelPlanId: this.travelPlanId,
      rating: this.rating,
      tags: this.tags,
      comment: this.comment.trim() || undefined
    }).subscribe({
      next: review => {
        this.submitting = false;
        this.toast.success('Your review has been submitted.');
        this.submitted.emit(review);
        this.closed.emit();
      },
      error: err => {
        this.submitting = false;
        const message = err?.error?.message;

        if (err?.status === 409) {
          this.toast.warning(message || 'You have already reviewed this trip.');
        } else if (err?.status === 401) {
          this.toast.error('Please sign in again.');
        } else if (err?.status === 403) {
          this.toast.error('You are not allowed to review this traveler.');
        } else {
          this.toast.error(
            message || 'Unable to submit the review. Please try again.'
          );
        }
      }
    });
  }

  close(): void {
    if (!this.submitting) this.closed.emit();
  }
}
