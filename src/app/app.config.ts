import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  provideServiceWorker
} from '@angular/service-worker';

import { routes } from './app.routes';

import {
  jwtInterceptor
} from './core/jwt-interceptor.service';

import {
  loadingInterceptor
} from './core/loading.interceptor';


export const appConfig: ApplicationConfig = {

  providers: [

    // =====================================================
    // CHANGE DETECTION
    // =====================================================

    provideZoneChangeDetection({
      eventCoalescing: true
    }),


    // =====================================================
    // ROUTER
    // =====================================================

    provideRouter(routes),


    // =====================================================
    // HTTP
    // =====================================================

    /*
     * Both interceptors now run for every HttpClient request.
     *
     * jwtInterceptor
     *      ↓
     * adds JWT Authorization header
     *
     * loadingInterceptor
     *      ↓
     * starts/stops global loading indicator
     */
    provideHttpClient(

      withInterceptors([

        jwtInterceptor,

        loadingInterceptor

      ])

    ),


    // =====================================================
    // SERVICE WORKER
    // =====================================================

    provideServiceWorker(
      'ngsw-worker.js',
      {
        enabled: !isDevMode(),

        registrationStrategy:
          'registerWhenStable:30000'
      }
    )

  ]

};