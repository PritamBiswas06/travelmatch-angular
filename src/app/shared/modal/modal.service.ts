import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirmation';

export interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
}

interface ModalState extends ModalConfig {
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private stateSubject = new BehaviorSubject<ModalState | null>(null);
  readonly state$ = this.stateSubject.asObservable();

  confirm(message: string, title = 'Are you sure?', confirmText = 'Continue', cancelText = 'Cancel'): Promise<boolean> {
    return this.open({ type: 'confirmation', title, message, confirmText, cancelText });
  }

  alert(message: string, type: Exclude<ModalType, 'confirmation'> = 'info', title?: string, confirmText = 'Got it'): Promise<boolean> {
    return this.open({
      type,
      title: title || this.defaultTitle(type),
      message,
      confirmText
    });
  }

  close(result = false): void {
    const current = this.stateSubject.value;
    if (!current) return;
    this.stateSubject.next(null);
    current.resolve(result);
  }

  private open(config: ModalConfig): Promise<boolean> {
    const previous = this.stateSubject.value;
    if (previous) {
      previous.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      this.stateSubject.next({ ...config, resolve });
    });
  }

  private defaultTitle(type: Exclude<ModalType, 'confirmation'>): string {
    switch (type) {
      case 'success': return 'Success!';
      case 'error': return 'Oops!';
      case 'warning': return 'Please check';
      default: return 'Information';
    }
  }
}