import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TravelService } from '../travel.service';
import { MatchService } from '../../match/match.service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/loader.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  matches: any[] = [];
  planId!: number;

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private matchService: MatchService,
    private loader:LoaderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.queryParamMap.get('planId'));
    this.loadMatches();
  }

  loadMatches() {
    this.travelService.getMatches(this.planId).subscribe({
      next: (res: any) => {
        this.matches = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  sendRequest(travelPlanId: number) {
    this.loader.show("Sending travel request...");
    this.matchService.sendMatchRequest(travelPlanId).subscribe({
      next: () => {
        this.loader.hide();
        this.toast.success('Match request sent successfully!');
      },
      error: (err) => {
        this.loader.hide();
        this.toast.error('Request failed or already sent.');
        console.error(err);
      }
    });
  }
}