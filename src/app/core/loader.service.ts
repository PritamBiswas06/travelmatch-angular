import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type LoaderToken = number;

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  /*
   * The loader has two independent sources:
   *
   * - manual operations: explicit actions such as creating a plan,
   *   sending a request, login, etc.
   * - HTTP operations: every real HttpClient request, tracked by the
   *   loading interceptor.
   *
   * Tokens are used instead of only counters. This makes cleanup
   * idempotent and, importantly, prevents an old request that finishes
   * after reset() from decrementing a newer session's loader state.
   */
  private nextToken = 0;
  private readonly manualRequests = new Set<LoaderToken>();
  private readonly httpRequests = new Set<LoaderToken>();

  private readonly loadingSubject =
    new BehaviorSubject<boolean>(false);

  private readonly messageSubject =
    new BehaviorSubject<string>('Loading...');

  readonly loading$ =
    this.loadingSubject.asObservable();

  readonly message$ =
    this.messageSubject.asObservable();


  // =========================================================
  // MANUAL LOADING
  // =========================================================

  show(message: string = 'Loading...'): LoaderToken {
    const token = ++this.nextToken;

    this.manualRequests.add(token);
    this.messageSubject.next(message);
    this.publishState();

    return token;
  }


  hide(token?: LoaderToken): void {
    if (token !== undefined) {
      this.manualRequests.delete(token);
    } else {
      const first = this.manualRequests.values().next();

      if (!first.done) {
        this.manualRequests.delete(first.value);
      }
    }

    this.publishState();
  }


  // =========================================================
  // HTTP LOADING
  // =========================================================

  beginHttp(message: string = 'Loading...'): LoaderToken {
    const token = ++this.nextToken;

    this.httpRequests.add(token);

    /*
     * A specific manual operation message has priority while that
     * operation is active.
     */
    if (this.manualRequests.size === 0) {
      this.messageSubject.next(message);
    }

    this.publishState();

    return token;
  }


  endHttp(token?: LoaderToken): void {
    if (token !== undefined) {
      this.httpRequests.delete(token);
    } else {
      const first = this.httpRequests.values().next();

      if (!first.done) {
        this.httpRequests.delete(first.value);
      }
    }

    this.publishState();
  }


  // =========================================================
  // RESET
  // =========================================================

  /**
   * Clears all currently tracked operations.
   *
   * Existing finalize() callbacks can still run after a reset, but their
   * tokens no longer exist in the sets, so they cannot affect a newer
   * session's loader state.
   */
  reset(): void {
    this.manualRequests.clear();
    this.httpRequests.clear();

    this.messageSubject.next('Loading...');
    this.publishState();
  }


  // =========================================================
  // STATE
  // =========================================================

  private publishState(): void {
    this.loadingSubject.next(
      this.manualRequests.size > 0 ||
      this.httpRequests.size > 0
    );
  }
}