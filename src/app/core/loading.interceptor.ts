import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from './loader.service';


/**
 * Global HTTP loading interceptor.
 *
 * Every Angular HttpClient request automatically activates
 * the TravelMatch global loader.
 *
 * This prevents pages from displaying misleading empty states
 * while Railway is still returning the API response.
 *
 * Example:
 *
 * GET /api/match/my
 *
 * Instead of:
 *
 * "Your inbox is quiet"
 *
 * appearing for 3 seconds, the user sees:
 *
 * "Loading..."
 *
 * until the API request actually finishes.
 */
export const loadingInterceptor: HttpInterceptorFn =
  (req, next) => {

    const loader = inject(LoaderService);

    /*
     * Start loading before the request is sent.
     */
    loader.beginHttp('Loading...');


    return next(req).pipe(

      /*
       * finalize() runs for:
       *
       * - successful response
       * - HTTP error
       * - request cancellation
       *
       * Therefore the loader cannot remain stuck because
       * of a normal HTTP failure.
       */
      finalize(() => {

        loader.endHttp();

      })

    );
  };