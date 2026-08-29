import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  FeedService,
  FeedPost,
  FeedFilters
} from './feed.service';

import { MatchService } from '../match/match.service';
import { LoaderService } from '../core/loader.service';
import { LocationImageService } from './location-image.service';
import { ProfileImageService } from '../core/profile-image.service';

type SortOption = 'latest' | 'popular' | 'match';

interface FilterChip {
  key: keyof FeedFilters;
  label: string;
}

function emptyFilters(): FeedFilters {
  return {
    destination: '',
    fromLocation: '',
    minBudget: null,
    maxBudget: null,
    startDate: null,
    endDate: null,
    travelType: '',
    minMatchScore: null
  };
}

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

  readonly travelTypeOptions = ['Adventure', 'Religious', 'Leisure'];

  showFilterPanel = false;
  filters: FeedFilters = emptyFilters();
  appliedFilters: FeedFilters = emptyFilters();

  selectedPost: FeedPost | null = null;

  toastMessage: string | null = null;
  private toastTimeout: any;

  pendingActionIds = new Set<string>();

  constructor(
  private feedService: FeedService,
  private matchService: MatchService,
  private loader: LoaderService,
  private router: Router,

  public locationImageService: LocationImageService,

  public profileImageService: ProfileImageService
) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.loading = true;
    this.error = false;

    this.feedService.getFeed(this.sortBy, this.appliedFilters).subscribe({
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

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters(): void {
    this.appliedFilters = { ...this.filters };
    this.showFilterPanel = false;
    this.loadFeed();
  }

  clearFilters(): void {
    this.filters = emptyFilters();
    this.appliedFilters = emptyFilters();
    this.loadFeed();
  }

  removeFilter(key: keyof FeedFilters): void {
    const cleared = emptyFilters();
    this.filters = { ...this.filters, [key]: cleared[key] };
    this.applyFilters();
  }

  get activeFilterChips(): FilterChip[] {
    const f = this.appliedFilters;
    const chips: FilterChip[] = [];

    if (f.destination) {
      chips.push({
        key: 'destination',
        label: f.destination
      });
    }

    if (f.fromLocation) {
      chips.push({
        key: 'fromLocation',
        label: `From ${f.fromLocation}`
      });
    }

    if (f.minBudget != null) {
      chips.push({
        key: 'minBudget',
        label: `₹${f.minBudget}+`
      });
    }

    if (f.maxBudget != null) {
      chips.push({
        key: 'maxBudget',
        label: `Up to ₹${f.maxBudget}`
      });
    }

    if (f.startDate) {
      chips.push({
        key: 'startDate',
        label: `From ${f.startDate}`
      });
    }

    if (f.endDate) {
      chips.push({
        key: 'endDate',
        label: `Until ${f.endDate}`
      });
    }

    if (f.travelType) {
      chips.push({
        key: 'travelType',
        label: f.travelType
      });
    }

    if (f.minMatchScore != null) {
      chips.push({
        key: 'minMatchScore',
        label: `${f.minMatchScore}%+ match`
      });
    }

    return chips;
  }

  getProfileImage(post: FeedPost): string {
  return this.profileImageService.getProfileImage({
    gender: post.userGender,
    profilePhotoUrl: post.profilePhotoUrl
  });
}

onProfileImageError(
  event: Event,
  post: FeedPost
): void {

  this.profileImageService.handleImageError(
    event,
    {
      gender: post.userGender,
      profilePhotoUrl: post.profilePhotoUrl
    }
  );
}

  get hasActiveFilters(): boolean {
    return this.activeFilterChips.length > 0;
  }

  private actionKey(planId: number, action: string): string {
    return `${planId}:${action}`;
  }

  isPending(planId: number, action: string): boolean {
    return this.pendingActionIds.has(
      this.actionKey(planId, action)
    );
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
      const idx = arr.findIndex(
        p => p.id === updated.id
      );

      if (idx > -1) {
        arr[idx] = updated;
      }
    };

    apply(this.posts);
    apply(this.filteredPosts);

    if (this.selectedPost?.id === updated.id) {
      this.selectedPost = updated;
    }
  }

  share(post: FeedPost): void {
    const url =
      `${window.location.origin}/feed?trip=${post.id}`;

    this.feedService.share(post.id).subscribe({
      next: (updated) => this.mergePost(updated),
      error: (err) => console.error(err)
    });

    if (navigator.share) {
      navigator.share({
        title:
          `${post.fromLocation} → ${post.destination} on TravelMatch`,
        text:
          `Check out this trip to ${post.destination}!`,
        url
      }).catch(() => {});

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

    this.toastTimeout = setTimeout(
      () => (this.toastMessage = null),
      2500
    );
  }

  openTrip(post: FeedPost): void {
    this.selectedPost = post;
  }

  closeTrip(): void {
    this.selectedPost = null;
  }

  viewProfile(post: FeedPost): void {
    this.router.navigate([
      '/profile',
      post.userId
    ]);
  }

  sendMatchRequest(post: FeedPost): void {
    const key = this.actionKey(post.id, 'match');

    if (this.pendingActionIds.has(key)) return;

    if (
      post.matchRequestStatus === 'PENDING' ||
      post.matchRequestStatus === 'ACCEPTED'
    ) {
      return;
    }

    this.pendingActionIds.add(key);

    this.loader.show(
      'Sending travel match request...'
    );

    this.matchService.sendMatchRequest(post.id).subscribe({
      next: () => {
        this.loader.hide();
        this.pendingActionIds.delete(key);

        this.mergePost({
          ...post,
          matchRequestStatus: 'PENDING'
        });
      },
      error: (err) => {
        this.loader.hide();
        this.pendingActionIds.delete(key);

        console.error(err);

        this.showToast(
          err?.error?.message ||
          'Could not send request'
        );
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

  initials(name: string): string {
    return (name || '?')
      .trim()
      .charAt(0)
      .toUpperCase();
  }

  ratingClass(rating: string): string {
    return 'rating-' +
      rating.toLowerCase().replace(/\s+/g, '-');
  }

  trackByPostId(
    _index: number,
    post: FeedPost
  ): number {
    return post.id;
  }
}