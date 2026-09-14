import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  /*
   * There are two types of loading operations:
   *
   * 1. manualRequests
   *    Used by existing code such as:
   *    - Sending request
   *    - Creating plan
   *    - Login
   *    - Uploading photo
   *
   * 2. httpRequests
   *    Automatically controlled by loading.interceptor.ts.
   *
   * Both are reference counted.
   *
   * This is important because the application can have multiple API calls
   * running at the same time.
   */

  private manualRequests = 0;
  private httpRequests = 0;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  private messageSubject =
    new BehaviorSubject<string>('Loading...');

  readonly loading$ =
    this.loadingSubject.asObservable();

  readonly message$ =
    this.messageSubject.asObservable();


  // =========================================================
  // MANUAL LOADING
  // =========================================================

  show(message: string = 'Loading...'): void {

    this.manualRequests++;

    this.messageSubject.next(message);

    this.publishState();
  }


  hide(): void {

    if (this.manualRequests > 0) {
      this.manualRequests--;
    }

    this.publishState();
  }


  // =========================================================
  // HTTP LOADING
  // =========================================================

  /**
   * Called automatically by the HTTP interceptor whenever
   * an HttpClient request starts.
   */
  beginHttp(message: string = 'Loading...'): void {

    this.httpRequests++;

    /*
     * Don't replace a more specific message such as:
     *
     * "Creating Plan..."
     * "Sending travel request..."
     *
     * with the generic HTTP message.
     */
    if (this.manualRequests === 0) {
      this.messageSubject.next(message);
    }

    this.publishState();
  }


  /**
   * Called automatically when an HttpClient request finishes.
   *
   * finalize() in the interceptor guarantees this is called
   * for both successful and failed requests.
   */
  endHttp(): void {

    if (this.httpRequests > 0) {
      this.httpRequests--;
    }

    this.publishState();
  }


  // =========================================================
  // RESET
  // =========================================================

  /**
   * Emergency reset.
   *
   * Useful if the application ever needs to force the loader
   * back to a clean state.
   */
  reset(): void {

    this.manualRequests = 0;

    this.httpRequests = 0;

    this.messageSubject.next('Loading...');

    this.publishState();
  }


  // =========================================================
  // STATE
  // =========================================================

  private publishState(): void {

    const shouldShow =
      this.manualRequests > 0 ||
      this.httpRequests > 0;

    this.loadingSubject.next(shouldShow);
  }
}