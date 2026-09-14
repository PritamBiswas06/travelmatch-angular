import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests: any[] = [];
  loading = true;

  constructor(private matchService: MatchService,
    private router: Router,
    private loader: LoaderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.matchService.getMyRequests().subscribe({
      next: (res: any) => {
        this.requests = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.requests = [];
        this.loading = false;
      }
    });
  }

  // accept(id: number) {
  //   this.matchService.acceptRequest(id).subscribe({
  //     next: () => {
  //       alert('Request Accepted!');
  //       this.loadRequests();
  //     },
  //     error: () => {
  //       this.toast.error('Failed to accept request');
  //     }
  //   });
  // }

//   constructor(
//   private matchService: MatchService,
//   private router: Router
// ) {}

accept(id: number) {
  this.loader.show("Connecting to partner...");
  this.matchService.acceptRequest(id).subscribe({
    next: (res: any) => {
      this.loader.hide();

      const accepted = this.requests.find(r => r.id === id);
      if (accepted) accepted.status = 'ACCEPTED';

      // alert('Request Accepted!');

      // 🔥 OPTION 1 — Go to Partners page
      this.router.navigate(['/partners']);

      // 🔥 OPTION 2 — Direct open chat (Better UX)
      // this.router.navigate(['/chat', res.partnerId]);

    },
    error: () => {
      this.loader.hide();
      this.toast.error('Failed to accept request');
    }
  });
}

  reject(id: number) {
    this.loader.show("Rejecting Request...");
    this.matchService.rejectRequest(id).subscribe({
      next: () => {
        this.loader.hide();
        const rejected = this.requests.find(r => r.id === id);
        if (rejected) rejected.status = 'REJECTED';
        this.toast.success('Request Rejected!');
      },
      error: () => {
        this.loader.hide();
        this.toast.error('Failed to reject request');
      }
    });
  }
}