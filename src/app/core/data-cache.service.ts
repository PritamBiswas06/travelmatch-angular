import { Injectable } from '@angular/core';
import { Observable, defer, of, shareReplay, tap, catchError, throwError } from 'rxjs';

interface CacheEntry<T> {
  value?: T;
  expiresAt: number;
  request$?: Observable<T>;
}

/**
 * In-memory GET cache for the authenticated SPA session.
 *
 * Route navigation destroys child components, but this singleton survives.
 * Once a GET succeeds, navigating away and back returns the cached value
 * synchronously, so the global HTTP loader is not shown again.
 *
 * Mutating services explicitly invalidate affected keys. Logout clears all
 * entries so data can never leak between accounts in the same browser tab.
 */
@Injectable({ providedIn: 'root' })
export class DataCacheService {
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string, requestFactory: () => Observable<T>, ttlMs = 0): Observable<T> {
    const now = Date.now();
    const existing = this.cache.get(key) as CacheEntry<T> | undefined;

    if (existing && existing.value !== undefined && (ttlMs === 0 || existing.expiresAt > now)) {
      return of(existing.value);
    }

    if (existing?.request$) {
      return existing.request$;
    }

    const entry: CacheEntry<T> = { expiresAt: ttlMs > 0 ? now + ttlMs : 0 };

    const request$ = defer(requestFactory).pipe(
      tap(value => {
        entry.value = value;
        entry.expiresAt = ttlMs > 0 ? Date.now() + ttlMs : 0;
        entry.request$ = undefined;
        this.cache.set(key, entry as CacheEntry<unknown>);
      }),
      catchError(error => {
        this.cache.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    entry.request$ = request$;
    this.cache.set(key, entry as CacheEntry<unknown>);
    return request$;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) this.cache.delete(key);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
