import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  ProfileService,
  UserProfile,
  ProfileTrip,
  UpdateProfileRequest
} from '../profile.service';

import { MatchService } from '../../match/match.service';
import { LoaderService } from '../../core/loader.service';
import { ModalService } from '../../shared/modal/modal.service';
import { ProfileImageService } from '../../core/profile-image.service';
import { SafetyService } from '../../core/safety.service';
import {
  TravelerReviewService,
  ReviewEligibility
} from '../../reviews/traveler-review.service';

import { ReportDialogComponent } from '../../shared/safety/report-dialog.component';
import { ReviewDialogComponent } from '../../reviews/review-dialog/review-dialog.component';

interface EditModel {
  name: string;
  username: string;
  age: number | null;
  gender: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  budgetPreference: string;
  travelFrequency: string;
  idealTravelPartner: string;
  instagramUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReportDialogComponent,
    ReviewDialogComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  // ==================== SELECT OPTIONS ====================

  readonly travelStyleOptions = [
    'Solo',
    'Couple',
    'Group',
    'Backpacking',
    'Luxury',
    'Budget',
    'Adventure',
    'Relaxation',
    'Road Trip',
    'Cultural',
    'Business + Leisure'
  ];

  readonly travelInterestOptions = [
    'Beaches',
    'Mountains',
    'Trekking',
    'Camping',
    'Food',
    'Photography',
    'History',
    'Culture',
    'Nightlife',
    'Wildlife',
    'Shopping',
    'Road Trips',
    'Adventure Sports'
  ];

  readonly languageOptions = [
    'English',
    'Hindi',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu'
  ];

  readonly budgetOptions = [
    '₹5,000 - ₹10,000',
    '₹10,000 - ₹20,000',
    '₹20,000 - ₹50,000',
    '₹50,000+'
  ];

  readonly frequencyOptions = [
    'Occasionally',
    'Once every few months',
    'Monthly',
    'Frequently',
    'Whenever possible'
  ];

  // ==================== STATE ====================

  userId!: number;

  profile: UserProfile | null = null;

  loading = true;
  error = false;
  notFound = false;

  selectedTrip: ProfileTrip | null = null;

  isEditing = false;
  savingProfile = false;

  editModel: EditModel = this.emptyEditModel();

  editTravelStyle: string[] = [];
  editTravelInterests: string[] = [];
  editLanguages: string[] = [];
  editPreferredDestinations: string[] = [];

  destinationInput = '';

  budgetIsCustom = false;

  // ==================== PROFILE PHOTO ====================

  photoPreviewUrl: string | null = null;
  selectedPhotoFile: File | null = null;
  uploadingPhoto = false;
  photoError: string | null = null;

  // ==================== TOAST ====================

  toastMessage: string | null = null;

  private toastTimeout: any;

  // ==================== ACTIONS ====================

  pendingActionIds = new Set<string>();

  // ==================== SAFETY ====================

  isBlocked = false;
  checkingBlockStatus = false;
  safetyBusy = false;

  showReportDialog = false;

  // ==================== REVIEWS ====================

  showReviewDialog = false;
  reviewEligibility: ReviewEligibility | null = null;
  selectedReviewTripId: number | null = null;

  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private matchService: MatchService,
    private loader: LoaderService,
    private modalService: ModalService,
    private profileImageService: ProfileImageService,
    private safetyService: SafetyService,
    private travelerReviewService: TravelerReviewService
  ) {}

  // ==================== INIT ====================

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      if (!id) {
        this.notFound = true;
        this.loading = false;
        return;
      }

      this.userId = id;
      this.isEditing = false;

      this.resetPhotoSelection();

      this.loadProfile();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    clearTimeout(this.toastTimeout);
  }

  // ==================== LOAD PROFILE ====================

  loadProfile(): void {

    this.loading = true;
    this.error = false;
    this.notFound = false;
    this.selectedTrip = null;

    this.profileService.getProfile(this.userId).subscribe({

      next: (res) => {

        this.profile = res;
        this.loading = false;

        this.isBlocked = false;
        this.reviewEligibility = null;
        this.selectedReviewTripId = null;

        if (!res.isOwnProfile) {
          this.loadSafetyState();
          this.loadReviewEligibility();
        }
      },

      error: (err) => {

        console.error('Could not load profile:', err);

        this.loading = false;

        if (err?.status === 400 || err?.status === 404) {
          this.notFound = true;
        } else {
          this.error = true;
        }
      }
    });
  }

  // ==================== SAFETY ====================

  private loadSafetyState(): void {

    if (
      !this.userId ||
      !this.profile ||
      this.profile.isOwnProfile
    ) {
      return;
    }

    this.checkingBlockStatus = true;

    this.safetyService.isBlocked(this.userId).subscribe({

      next: result => {

        this.isBlocked = !!result?.blocked;
        this.checkingBlockStatus = false;
      },

      error: err => {

        console.error(
          'Could not check block status',
          err
        );

        this.checkingBlockStatus = false;
      }
    });
  }

  async toggleBlockUser(): Promise<void> {

    if (
      !this.profile ||
      this.profile.isOwnProfile ||
      this.safetyBusy
    ) {
      return;
    }

    const blocking = !this.isBlocked;

    const confirmed = await this.modalService.confirm(

      blocking
        ? `You will no longer be able to interact with ${this.profile.name}, and their content will be removed from your discovery experience.`
        : `Unblock ${this.profile.name}? They will be allowed to interact with you again.`,

      blocking
        ? 'Block Traveler?'
        : 'Unblock Traveler?',

      blocking
        ? 'Block User'
        : 'Unblock',

      'Cancel'
    );

    if (!confirmed) {
      return;
    }

    this.safetyBusy = true;

    const request$ = blocking
      ? this.safetyService.blockUser(this.userId)
      : this.safetyService.unblockUser(this.userId);

    request$.subscribe({

      next: () => {

        this.isBlocked = blocking;
        this.safetyBusy = false;

        this.showToast(
          blocking
            ? 'Traveler blocked successfully.'
            : 'Traveler unblocked successfully.'
        );

        if (blocking) {
          this.selectedTrip = null;
        }
      },

      error: err => {

        this.safetyBusy = false;

        console.error(
          'Block/unblock failed:',
          err
        );

        if (err?.status === 401) {

          this.showToast(
            'Please sign in again.'
          );

        } else if (err?.status === 403) {

          this.showToast(
            "You don't have permission to perform this action."
          );

        } else {

          this.showToast(
            err?.error?.message ||
            (
              blocking
                ? 'Could not block this traveler.'
                : 'Could not unblock this traveler.'
            )
          );
        }
      }
    });
  }

  // ==================== REPORT USER ====================

  openReportUser(): void {

    if (
      !this.profile ||
      this.profile.isOwnProfile ||
      this.isBlocked
    ) {
      return;
    }

    this.showReportDialog = true;
  }

  closeReportDialog(): void {
    this.showReportDialog = false;
  }

  // ==================== REVIEWS ====================

  private loadReviewEligibility(): void {

    if (
      !this.profile ||
      this.profile.isOwnProfile
    ) {
      return;
    }

    this.travelerReviewService
      .getEligibility(this.userId)
      .subscribe({

        next: result => {
          this.reviewEligibility = result;
        },

        error: err => {

          console.error(
            'Could not check review eligibility:',
            err
          );

          this.reviewEligibility = null;
        }
      });
  }

  get canLeaveReview(): boolean {

    return !!this.reviewEligibility?.eligible
      && (
        this.reviewEligibility.travelPlanIds?.length ?? 0
      ) > 0
      && !this.isBlocked;
  }

  openReview(tripId?: number): void {

    if (!this.canLeaveReview) {
      return;
    }

    this.selectedReviewTripId =
      tripId ??
      this.reviewEligibility?.travelPlanIds?.[0] ??
      null;

    if (this.selectedReviewTripId) {
      this.showReviewDialog = true;
    }
  }

  closeReviewDialog(): void {

    this.showReviewDialog = false;
    this.selectedReviewTripId = null;
  }

  handleReviewSubmitted(
    review: UserProfile['reviews'][number]
  ): void {

    if (!this.profile) {
      return;
    }

    const existingIndex =
      this.profile.reviews.findIndex(
        item => item.id === review.id
      );

    const reviews = [
      ...this.profile.reviews
    ];

    if (existingIndex >= 0) {

      reviews[existingIndex] = review;

    } else {

      reviews.unshift(review);
    }

    const reviewCount = reviews.length;

    const averageRating = reviewCount
      ? Math.round(
          (
            reviews.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / reviewCount
          ) * 10
        ) / 10
      : 0;

    this.profile = {
      ...this.profile,
      reviews,
      reviewCount,
      averageRating
    };

    this.reviewEligibility = {

      eligible: false,

      travelPlanIds:
        (
          this.reviewEligibility?.travelPlanIds ?? []
        ).filter(
          id => id !== review.travelPlanId
        )
    };

    this.showReviewDialog = false;
    this.selectedReviewTripId = null;
  }

  reviewTagLabel(tag: string): string {

    return tag
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );
  }

  reviewStars(rating: number): string {

    const safe = Math.max(
      0,
      Math.min(
        5,
        Math.round(rating)
      )
    );

    return (
      '★'.repeat(safe) +
      '☆'.repeat(5 - safe)
    );
  }

  // ==================== TRIP MODAL ====================

  openTrip(trip: ProfileTrip): void {
    this.selectedTrip = trip;
  }

  closeTrip(): void {
    this.selectedTrip = null;
  }

  // ==================== DELETE TRIP ====================

  async deleteTrip(
    trip: ProfileTrip
  ): Promise<void> {

    if (!this.profile?.isOwnProfile) {
      return;
    }

    const confirmed =
      await this.modalService.confirm(

        `Delete your trip to ${trip.destination}?\n\nThis action cannot be undone.`,

        'Delete this trip?',

        'Yes, Delete',

        'Keep Trip'
      );

    if (!confirmed) {
      return;
    }

    const key = this.actionKey(
      trip.id,
      'delete'
    );

    if (
      this.pendingActionIds.has(key)
    ) {
      return;
    }

    this.pendingActionIds.add(key);

    this.loader.show(
      'Deleting travel plan...'
    );

    this.profileService
      .deleteTravelPlan(trip.id)
      .subscribe({

        next: () => {

          this.loader.hide();

          this.pendingActionIds.delete(
            key
          );

          if (this.profile) {

            this.profile = {
              ...this.profile,

              upcomingTrips:
                this.profile.upcomingTrips.filter(
                  t => t.id !== trip.id
                )
            };
          }

          if (
            this.selectedTrip?.id === trip.id
          ) {
            this.selectedTrip = null;
          }

          this.showToast(
            'Travel plan deleted successfully.'
          );
        },

        error: err => {

          this.loader.hide();

          this.pendingActionIds.delete(
            key
          );

          console.error(
            'Delete travel plan failed:',
            err
          );

          if (err?.status === 403) {

            this.showToast(
              'You can only delete your own travel plans.'
            );

          } else if (err?.status === 404) {

            this.showToast(
              'Travel plan not found.'
            );

          } else {

            this.showToast(
              err?.error?.message ||
              'Could not delete travel plan.'
            );
          }
        }
      });
  }

  // ==================== MATCH REQUEST ====================

  private actionKey(
    tripId: number,
    action: string
  ): string {

    return `${tripId}:${action}`;
  }

  isPending(
    tripId: number,
    action: string
  ): boolean {

    return this.pendingActionIds.has(
      this.actionKey(tripId, action)
    );
  }

  sendMatchRequest(
    trip: ProfileTrip
  ): void {

    const key = this.actionKey(
      trip.id,
      'match'
    );

    if (
      this.pendingActionIds.has(key)
    ) {
      return;
    }

    if (
      trip.matchRequestStatus === 'PENDING' ||
      trip.matchRequestStatus === 'ACCEPTED'
    ) {
      return;
    }

    this.pendingActionIds.add(key);

    this.loader.show(
      'Sending travel match request...'
    );

    this.matchService
      .sendMatchRequest(trip.id)
      .subscribe({

        next: () => {

          this.loader.hide();

          this.pendingActionIds.delete(
            key
          );

          this.updateTripStatus(
            trip.id,
            'PENDING'
          );
        },

        error: err => {

          this.loader.hide();

          this.pendingActionIds.delete(
            key
          );

          console.error(
            'Match request failed:',
            err
          );

          if (err?.status === 403) {

            this.showToast(
              'You cannot send a match request to this traveler.'
            );

          } else {

            this.showToast(
              err?.error?.message ||
              'Could not send request.'
            );
          }
        }
      });
  }

  private updateTripStatus(
    tripId: number,
    status:
      | 'NONE'
      | 'PENDING'
      | 'ACCEPTED'
      | 'REJECTED'
  ): void {

    if (!this.profile) {
      return;
    }

    this.profile = {

      ...this.profile,

      upcomingTrips:
        this.profile.upcomingTrips.map(
          trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  matchRequestStatus: status
                }
              : trip
        )
    };

    if (
      this.selectedTrip?.id === tripId
    ) {

      this.selectedTrip = {

        ...this.selectedTrip,

        matchRequestStatus: status
      };
    }
  }

  matchButtonLabel(
    trip: ProfileTrip
  ): string {

    switch (
      trip.matchRequestStatus
    ) {

      case 'PENDING':
        return 'Request Sent';

      case 'ACCEPTED':
        return 'Matched ✓';

      case 'REJECTED':
        return 'Send Again';

      default:
        return 'Send Match Request';
    }
  }

  // ==================== EDIT PROFILE ====================

  private emptyEditModel(): EditModel {

    return {

      name: '',
      username: '',
      age: null,
      gender: '',
      city: '',
      state: '',
      country: '',
      bio: '',
      budgetPreference: '',
      travelFrequency: '',
      idealTravelPartner: '',
      instagramUrl: '',
      linkedinUrl: '',
      websiteUrl: ''
    };
  }

  startEditing(): void {

    if (!this.profile) {
      return;
    }

    this.editModel = {

      name: this.profile.name || '',
      username: this.profile.username || '',
      age: this.profile.age,
      gender: this.profile.gender || '',
      city: this.profile.city || '',
      state: this.profile.state || '',
      country: this.profile.country || '',
      bio: this.profile.bio || '',

      budgetPreference:
        this.profile.budgetPreference || '',

      travelFrequency:
        this.profile.travelFrequency || '',

      idealTravelPartner:
        this.profile.idealTravelPartner || '',

      instagramUrl:
        this.profile.instagramUrl || '',

      linkedinUrl:
        this.profile.linkedinUrl || '',

      websiteUrl:
        this.profile.websiteUrl || ''
    };

    this.editTravelStyle =
      [...this.profile.travelStyle];

    this.editTravelInterests =
      [...this.profile.travelInterests];

    this.editLanguages =
      [...this.profile.languages];

    this.editPreferredDestinations =
      [...this.profile.preferredDestinations];

    this.destinationInput = '';

    this.budgetIsCustom =
      !!this.editModel.budgetPreference &&
      !this.budgetOptions.includes(
        this.editModel.budgetPreference
      );

    this.resetPhotoSelection();

    this.isEditing = true;
  }

  cancelEditing(): void {

    this.isEditing = false;

    this.resetPhotoSelection();
  }

  toggleChip(
    list: string[],
    value: string
  ): string[] {

    const idx = list.indexOf(value);

    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(value);
    }

    return list;
  }

  toggleTravelStyle(
    value: string
  ): void {

    this.editTravelStyle =
      this.toggleChip(
        [...this.editTravelStyle],
        value
      );
  }

  toggleTravelInterest(
    value: string
  ): void {

    this.editTravelInterests =
      this.toggleChip(
        [...this.editTravelInterests],
        value
      );
  }

  toggleLanguage(
    value: string
  ): void {

    this.editLanguages =
      this.toggleChip(
        [...this.editLanguages],
        value
      );
  }

  onBudgetSelectChange(
    value: string
  ): void {

    if (value === 'Custom') {

      this.budgetIsCustom = true;
      this.editModel.budgetPreference = '';

    } else {

      this.budgetIsCustom = false;
      this.editModel.budgetPreference = value;
    }
  }

  addDestination(): void {

    const value =
      this.destinationInput.trim();

    if (!value) {
      return;
    }

    const alreadyExists =
      this.editPreferredDestinations.some(
        destination =>
          destination.toLowerCase() ===
          value.toLowerCase()
      );

    if (!alreadyExists) {

      this.editPreferredDestinations = [
        ...this.editPreferredDestinations,
        value
      ];
    }

    this.destinationInput = '';
  }

  removeDestination(
    value: string
  ): void {

    this.editPreferredDestinations =
      this.editPreferredDestinations.filter(
        destination =>
          destination !== value
      );
  }

  saveProfile(): void {

    if (this.savingProfile) {
      return;
    }

    if (!this.editModel.name.trim()) {

      this.showToast(
        'Name cannot be empty.'
      );

      return;
    }

    this.savingProfile = true;

    const payload: UpdateProfileRequest = {

      name: this.editModel.name,
      username: this.editModel.username,
      age: this.editModel.age ?? undefined,
      gender: this.editModel.gender,
      city: this.editModel.city,
      state: this.editModel.state,
      country: this.editModel.country,
      bio: this.editModel.bio,

      budgetPreference:
        this.editModel.budgetPreference,

      travelFrequency:
        this.editModel.travelFrequency,

      idealTravelPartner:
        this.editModel.idealTravelPartner,

      instagramUrl:
        this.editModel.instagramUrl,

      linkedinUrl:
        this.editModel.linkedinUrl,

      websiteUrl:
        this.editModel.websiteUrl,

      travelStyle:
        this.editTravelStyle,

      travelInterests:
        this.editTravelInterests,

      preferredDestinations:
        this.editPreferredDestinations,

      languages:
        this.editLanguages
    };

    this.profileService
      .updateMyProfile(payload)
      .subscribe({

        next: res => {

          this.profile = res;

          this.isEditing = false;
          this.savingProfile = false;

          this.showToast(
            'Profile updated successfully.'
          );
        },

        error: err => {

          console.error(
            'Profile update failed:',
            err
          );

          this.savingProfile = false;

          this.showToast(
            err?.error?.message ||
            'Could not update profile.'
          );
        }
      });
  }

  // ==================== PROFILE PHOTO ====================

  onPhotoSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    // Allow selecting the same file again.
    input.value = '';

    if (!file) {
      return;
    }

    this.photoError = null;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.photoError =
        'Photo must be a JPEG, PNG, or WEBP image.';

      return;
    }

    const maxSizeBytes =
      2 * 1024 * 1024;

    if (file.size > maxSizeBytes) {

      this.photoError =
        'Photo must be smaller than 2MB.';

      return;
    }

    this.selectedPhotoFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.photoPreviewUrl =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  getProfileImage(): string {

    if (!this.profile) {

      return this.profileImageService
        .getProfileImage(null);
    }

    if (this.photoPreviewUrl) {
      return this.photoPreviewUrl;
    }

    return this.profileImageService.getProfileImage({
      gender: this.profile.gender,
      profilePhotoUrl: this.profile.profilePhotoUrl
    });
  }

  onProfileImageError(
    event: Event
  ): void {

    if (!this.profile) {
      return;
    }

    this.profileImageService.handleImageError(
      event,
      {
        gender: this.profile.gender,
        profilePhotoUrl:
          this.profile.profilePhotoUrl
      }
    );
  }

  savePhoto(): void {

    if (
      !this.selectedPhotoFile ||
      this.uploadingPhoto
    ) {
      return;
    }

    this.uploadingPhoto = true;
    this.photoError = null;

    this.profileService
      .uploadProfilePhoto(
        this.selectedPhotoFile
      )
      .subscribe({

        next: res => {

          this.profile = res;

          this.uploadingPhoto = false;

          this.resetPhotoSelection();

          this.showToast(
            'Profile photo updated.'
          );
        },

        error: err => {

          console.error(
            'Photo upload failed:',
            err
          );

          this.uploadingPhoto = false;

          this.photoError =
            err?.error?.message ||
            'Could not upload photo.';
        }
      });
  }

  cancelPhotoSelection(): void {
    this.resetPhotoSelection();
  }

  async removePhoto(): Promise<void> {

    if (this.uploadingPhoto) {
      return;
    }

    const confirmed =
      await this.modalService.confirm(

        'Remove your current profile photo?',

        'Remove profile photo?',

        'Yes, Remove',

        'Keep Photo'
      );

    if (!confirmed) {
      return;
    }

    this.uploadingPhoto = true;

    this.profileService
      .removeProfilePhoto()
      .subscribe({

        next: res => {

          this.profile = res;

          this.uploadingPhoto = false;

          this.resetPhotoSelection();

          this.showToast(
            'Profile photo removed.'
          );
        },

        error: err => {

          console.error(
            'Photo removal failed:',
            err
          );

          this.uploadingPhoto = false;

          this.showToast(
            err?.error?.message ||
            'Could not remove photo.'
          );
        }
      });
  }

  private resetPhotoSelection(): void {

    this.selectedPhotoFile = null;
    this.photoPreviewUrl = null;
    this.photoError = null;
  }

  // ==================== HELPERS ====================

  goToFeed(): void {
    this.router.navigate(['/feed']);
  }

  initials(name: string): string {

    return (name || '?')
      .trim()
      .charAt(0)
      .toUpperCase();
  }

  locationLine(
    profile: UserProfile
  ): string {

    return [
      profile.city,
      profile.state,
      profile.country
    ]
      .filter(value => !!value)
      .join(', ');
  }

  private showToast(
    message: string
  ): void {

    this.toastMessage = message;

    clearTimeout(
      this.toastTimeout
    );

    this.toastTimeout =
      setTimeout(() => {

        this.toastMessage = null;

      }, 2500);
  }

  trackByTripId(
    _index: number,
    trip: ProfileTrip
  ): number {

    return trip.id;
  }
}