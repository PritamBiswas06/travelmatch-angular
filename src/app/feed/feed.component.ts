import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedService, FeedPost } from './feed.service';
import { MatchService } from '../match/match.service';
import { LoaderService } from '../core/loader.service';

type SortOption = 'latest' | 'popular' | 'match';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  posts: FeedPost[] = [];
  filteredPosts: FeedPost[] = [];

  loading = true;
  error = false;

  searchTerm = '';
  sortBy: SortOption = 'latest';

  selectedPost: FeedPost | null = null; // powers the "View Trip" modal

  toastMessage: string | null = null;
  private toastTimeout: any;

  // ids currently mid-flight for a reaction/request, so buttons can show a busy state
  pendingActionIds = new Set<string>();

  constructor(
    private feedService: FeedService,
    private matchService: MatchService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.loading = true;
    this.error = false;

    this.feedService.getFeed(this.sortBy).subscribe({
      next: (res) => {
        this.posts = res || [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortBy = value;
    this.loadFeed();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredPosts = this.posts;
      return;
    }

    this.filteredPosts = this.posts.filter(p =>
      p.destination.toLowerCase().includes(term) ||
      p.fromLocation.toLowerCase().includes(term)
    );
  }

  goToCreatePlan(): void {
    this.router.navigate(['/create-plan']);
  }

  // ==================== REACTIONS ====================

  private actionKey(planId: number, action: string): string {
    return `${planId}:${action}`;
  }

  isPending(planId: number, action: string): boolean {
    return this.pendingActionIds.has(this.actionKey(planId, action));
  }

  toggleLike(post: FeedPost): void {
    const key = this.actionKey(post.id, 'like');
    if (this.pendingActionIds.has(key)) return;
    this.pendingActionIds.add(key);

    this.feedService.like(post.id).subscribe({
      next: (updated) => {
        this.mergePost(updated);
        this.pendingActionIds.delete(key);
      },
      error: (err) => {
        console.error(err);
        this.pendingActionIds.delete(key);
      }
    });
  }

  toggleDislike(post: FeedPost): void {
    const key = this.actionKey(post.id, 'dislike');
    if (this.pendingActionIds.has(key)) return;
    this.pendingActionIds.add(key);

    this.feedService.dislike(post.id).subscribe({
      next: (updated) => {
        this.mergePost(updated);
        this.pendingActionIds.delete(key);
      },
      error: (err) => {
        console.error(err);
        this.pendingActionIds.delete(key);
      }
    });
  }

  private mergePost(updated: FeedPost): void {
    const apply = (arr: FeedPost[]) => {
      const idx = arr.findIndex(p => p.id === updated.id);
      if (idx > -1) arr[idx] = updated;
    };
    apply(this.posts);
    apply(this.filteredPosts);

    if (this.selectedPost?.id === updated.id) {
      this.selectedPost = updated;
    }
  }

  // ==================== SHARE ====================

  share(post: FeedPost): void {
    const url = `${window.location.origin}/feed?trip=${post.id}`;

    this.feedService.share(post.id).subscribe({
      next: (updated) => this.mergePost(updated),
      error: (err) => console.error(err)
    });

    if (navigator.share) {
      navigator.share({
        title: `${post.fromLocation} → ${post.destination} on TravelMatch`,
        text: `Check out this trip to ${post.destination}!`,
        url
      }).catch(() => {
        // user cancelled the native share sheet — no-op
      });
      return;
    }

    navigator.clipboard.writeText(url).then(
      () => this.showToast('Trip link copied!'),
      () => this.showToast('Could not copy link')
    );
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => (this.toastMessage = null), 2500);
  }

  // ==================== VIEW TRIP MODAL ====================

  openTrip(post: FeedPost): void {
    this.selectedPost = post;
  }

  closeTrip(): void {
    this.selectedPost = null;
  }

  // ==================== VIEW PROFILE ====================

  viewProfile(post: FeedPost): void {
    this.router.navigate(['/profile', post.userId]);
  }

  // ==================== MATCH REQUEST ====================

  sendMatchRequest(post: FeedPost): void {
    const key = this.actionKey(post.id, 'match');
    if (this.pendingActionIds.has(key)) return;
    if (post.matchRequestStatus === 'PENDING' || post.matchRequestStatus === 'ACCEPTED') return;

    this.pendingActionIds.add(key);
    this.loader.show('Sending travel match request...');

    this.matchService.sendMatchRequest(post.id).subscribe({
      next: () => {
        this.loader.hide();
        this.pendingActionIds.delete(key);
        this.mergePost({ ...post, matchRequestStatus: 'PENDING' });
      },
      error: (err) => {
        this.loader.hide();
        this.pendingActionIds.delete(key);
        console.error(err);
        this.showToast(err?.error?.message || 'Could not send request');
      }
    });
  }

  matchButtonLabel(post: FeedPost): string {
    switch (post.matchRequestStatus) {
      case 'PENDING':
        return 'Request Sent';
      case 'ACCEPTED':
        return 'Matched ✓';
      case 'REJECTED':
        return 'Send Again';
      default:
        return 'Send Travel Match Request';
    }
  }

  // ==================== HELPERS ====================

  initials(name: string): string {
    return (name || '?').trim().charAt(0).toUpperCase();
  }

  trackByPostId(_index: number, post: FeedPost): number {
    return post.id;
  }
}
