import { Injectable } from '@angular/core';

export interface ProfileImageUser {
  gender?: string | null;
  profilePhotoUrl?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {

  private readonly maleDefault =
    'assets/profile-default-male.svg';

  private readonly femaleDefault =
    'assets/profile-default-female.svg';

  private readonly neutralDefault =
    'assets/profile-default-neutral.svg';

  /**
   * Returns the correct profile image.
   *
   * Priority:
   *
   * 1. Real uploaded photo
   * 2. Male default
   * 3. Female default
   * 4. Neutral default
   */
  getProfileImage(user: ProfileImageUser | null | undefined): string {

    if (user?.profilePhotoUrl) {
      return user.profilePhotoUrl;
    }

    const gender = this.normalizeGender(user?.gender);

    if (gender === 'male') {
      return this.maleDefault;
    }

    if (gender === 'female') {
      return this.femaleDefault;
    }

    return this.neutralDefault;
  }

  /**
   * Returns the appropriate fallback when an uploaded image fails.
   */
  getFallbackImage(
    user: ProfileImageUser | null | undefined
  ): string {

    const gender = this.normalizeGender(user?.gender);

    if (gender === 'male') {
      return this.maleDefault;
    }

    if (gender === 'female') {
      return this.femaleDefault;
    }

    return this.neutralDefault;
  }

  /**
   * Handles image loading errors.
   *
   * The returned URL can be assigned directly to the img element.
   */
  handleImageError(
    event: Event,
    user: ProfileImageUser | null | undefined
  ): void {

    const img = event.target as HTMLImageElement | null;

    if (!img) {
      return;
    }

    const fallback = this.getFallbackImage(user);

    if (img.src.endsWith(fallback)) {
      return;
    }

    img.src = fallback;
  }

  private normalizeGender(
    gender: string | null | undefined
  ): string {

    return (gender || '')
      .trim()
      .toLowerCase();
  }
}