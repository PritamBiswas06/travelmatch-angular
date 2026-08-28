import { Component } from '@angular/core';
import { LoaderService } from './core/loader.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ModalComponent } from './shared/modal/modal.component';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, ModalComponent, ToastComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'travelmatch';

  loading = false;

  constructor(private loaderService: LoaderService){

    this.loaderService.loading$.subscribe(v=>{
      this.loading = v;
    });

  }

}

// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { LoaderComponent } from "./shared/loader/loader.component";

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, LoaderComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'travelmatch';
// }