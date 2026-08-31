import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelCommentsService, TravelComment } from './travel-comments.service';

@Component({
  selector: 'app-travel-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './travel-comments.component.html',
  styleUrls: ['./travel-comments.component.css']
})
export class TravelCommentsComponent implements OnChanges {
  @Input() travelPlanId!: number;
  @Input() initialCount = 0;
  @Output() countChange = new EventEmitter<number>();

  comments: TravelComment[] = [];
  open = false;
  loading = false;
  submitting = false;
  commentText = '';
  error = '';

  constructor(private service: TravelCommentsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['travelPlanId'] && this.travelPlanId && this.open) this.load();
  }

  toggle(): void {
    this.open = !this.open;
    this.error = '';
    if (this.open) this.load();
  }

  load(): void {
    this.loading = true;
    this.service.get(this.travelPlanId).subscribe({
      next: comments => {
        this.comments = comments || [];
        this.countChange.emit(this.comments.length);
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load comments', err);
        this.error = err?.error?.message || 'Could not load comments.';
        this.loading = false;
      }
    });
  }

  addComment(): void {
    const text = this.commentText.trim();
    if (!text || this.submitting) return;
    this.submitting = true;
    this.error = '';
    this.service.add(this.travelPlanId, text).subscribe({
      next: comment => {
        this.comments = [...this.comments, comment];
        this.commentText = '';
        this.submitting = false;
        this.countChange.emit(this.comments.length);
      },
      error: err => {
        this.submitting = false;
        this.error = err?.error?.message || 'Could not add comment.';
      }
    });
  }

  deleteComment(comment: TravelComment): void {
    if (!comment.ownComment) return;
    this.service.delete(comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== comment.id);
        this.countChange.emit(this.comments.length);
      },
      error: err => {
        this.error = err?.error?.message || 'Could not delete comment.';
      }
    });
  }
}
