import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private subject = new BehaviorSubject<ToastItem[]>([]);
  readonly toasts$ = this.subject.asObservable();

  show(message: string, type: ToastType = 'info', duration = 3200): void {
    const toast: ToastItem = { id: this.nextId++, message, type, duration };
    this.subject.next([...this.subject.value, toast]);
    window.setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(message: string, duration = 3200): void { this.show(message, 'success', duration); }
  error(message: string, duration = 3800): void { this.show(message, 'error', duration); }
  warning(message: string, duration = 3600): void { this.show(message, 'warning', duration); }
  info(message: string, duration = 3200): void { this.show(message, 'info', duration); }

  dismiss(id: number): void {
    this.subject.next(this.subject.value.filter(toast => toast.id !== id));
  }
}