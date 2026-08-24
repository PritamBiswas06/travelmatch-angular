import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading = new BehaviorSubject<boolean>(false);
  private message = new BehaviorSubject<string>('Loading...');

  loading$ = this.loading.asObservable();
  message$ = this.message.asObservable();

  show(msg: string = 'Loading...'){
    this.message.next(msg);
    this.loading.next(true);
  }

  hide(){
    this.loading.next(false);
  }

}