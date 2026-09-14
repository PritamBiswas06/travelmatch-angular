import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';

import {
  NgIf
} from '@angular/common';

import {
  Subscription
} from 'rxjs';

import {
  LoaderService
} from './core/loader.service';

import {
  LoaderComponent
} from './shared/loader/loader.component';

import {
  ModalComponent
} from './shared/modal/modal.component';

import {
  ToastComponent
} from './shared/toast/toast.component';


@Component({

  selector: 'app-root',

  imports: [
    RouterOutlet,
    LoaderComponent,
    ModalComponent,
    ToastComponent,
    NgIf
  ],

  templateUrl: './app.component.html',

  styleUrl: './app.component.css'

})
export class AppComponent
  implements OnDestroy {


  title = 'travelmatch';


  /*
   * Controls the global loader component.
   */
  loading = false;


  /*
   * Subscriptions remain active for the lifetime of the
   * root application component.
   */
  private routerSubscription: Subscription;

  private loaderSubscription: Subscription;


  /*
   * Keeps navigation loading separate from HTTP loading.
   *
   * This is important because a page can finish Angular
   * navigation while its API calls are still running.
   */
  private navigationLoading = false;


  constructor(

    private loaderService: LoaderService,

    private router: Router

  ) {


    // =====================================================
    // GLOBAL LOADER STATE
    // =====================================================

    this.loaderSubscription =
      this.loaderService.loading$
        .subscribe(value => {

          this.loading = value;

        });


    // =====================================================
    // ROUTE NAVIGATION LOADER
    // =====================================================

    this.routerSubscription =
      this.router.events.subscribe(event => {


        // -------------------------------------------------
        // NAVIGATION START
        // -------------------------------------------------

        if (event instanceof NavigationStart) {

          /*
           * Prevent duplicate navigation loader calls.
           */
          if (!this.navigationLoading) {

            this.navigationLoading = true;

            this.loaderService.show(
              'Loading page...'
            );

          }

          return;
        }


        // -------------------------------------------------
        // NAVIGATION FINISHED
        // -------------------------------------------------

        if (

          event instanceof NavigationEnd ||

          event instanceof NavigationCancel ||

          event instanceof NavigationError

        ) {

          if (this.navigationLoading) {

            this.navigationLoading = false;

            this.loaderService.hide();

          }

        }

      });

  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.routerSubscription.unsubscribe();

    this.loaderSubscription.unsubscribe();

  }

}