import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { ChatService } from '../chat/chat.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGuard implements CanActivate {

  constructor(private chatService: ChatService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = Number(route.paramMap.get('id'));

    return this.chatService.getConversation(id).pipe(
      map(() => true),
      catchError(() => {
        this.router.navigate(['/dashboard']);
        return of(false);
      })
    );
  }
}
