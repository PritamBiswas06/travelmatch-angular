import { Component } from '@angular/core';
import { LoaderService } from '../../core/loader.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports:[NgIf],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  loading = false;
  message = '';

  constructor(private loaderService: LoaderService){

    this.loaderService.loading$.subscribe(v=>{
      this.loading = v;
    });

    this.loaderService.message$.subscribe(m=>{
      this.message = m;
    });

  }

}