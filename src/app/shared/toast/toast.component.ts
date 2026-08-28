import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  icon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✓';

      case 'error':
        return '!';

      case 'warning':
        return '⚠';

      case 'info':
        return 'i';

      default:
        return 'i';
    }
  }
}