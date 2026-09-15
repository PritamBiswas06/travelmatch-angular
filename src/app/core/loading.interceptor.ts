import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from './loader.service';


/**
 * Global HTTP loading interceptor.
 *
 * Every Angular HttpClient request automatically activates
 * the TravelMatch global loader.
 */
export const loadingInterceptor: HttpInterceptorFn =
  (req, next) => {

    const loader = inject(LoaderService);

    /*
     * Start loading before the request is sent.
     */
    const loadingToken =
      loader.beginHttp('Loading...');


    return next(req).pipe(

      /*
       * finalize() runs for:
       *
       * - successful response
       * - HTTP error
       * - request cancellation
       */
      finalize(() => {

        loader.endHttp(loadingToken);

      })

    );
  };