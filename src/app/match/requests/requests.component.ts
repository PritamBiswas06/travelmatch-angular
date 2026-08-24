import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../../core/loader.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests: any[] = [];

  constructor(private matchService: MatchService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.matchService.getMyRequests().subscribe({
      next: (res: any) => {
        this.requests = res;
      },
      error: (err) => {
        console.error(err);
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
  //       alert('Failed to accept request');
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

      // alert('Request Accepted!');

      // 🔥 OPTION 1 — Go to Partners page
      this.router.navigate(['/partners']);

      // 🔥 OPTION 2 — Direct open chat (Better UX)
      // this.router.navigate(['/chat', res.partnerId]);

    },
    error: () => {
      this.loader.hide();
      alert('Failed to accept request');
    }
  });
}

  reject(id: number) {
    this.loader.show("Rejecting Request...");
    this.matchService.rejectRequest(id).subscribe({
      next: () => {
        this.loader.hide();
        alert('Request Rejected!');
        this.loadRequests();
      },
      error: () => {
        this.loader.hide();
        alert('Failed to reject request');
      }
    });
  }
}