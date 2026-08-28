import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalConfig, ModalService, ModalType } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnDestroy {
  state: (ModalConfig & { resolve: (value: boolean) => void }) | null = null;
  private subscription: Subscription;

  constructor(private modalService: ModalService) {
    this.subscription = this.modalService.state$.subscribe(state => this.state = state);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.modalService.close(false);
  }

  confirm(): void {
    this.modalService.close(true);
  }

  isConfirmation(): boolean {
    return this.state?.type === 'confirmation';
  }

  icon(type: ModalType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '!';
      case 'warning': return '⚠';
      case 'confirmation': return '?';
      default: return 'i';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state) this.close();
  }
}