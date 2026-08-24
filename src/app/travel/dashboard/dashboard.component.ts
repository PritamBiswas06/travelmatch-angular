import { Component, OnInit } from '@angular/core';
import { TravelService } from '../travel.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  plans: any[] = [];
  userName: string = '';
  sortType: string = 'latest';

  constructor(
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedName = localStorage.getItem('name');
    this.userName = storedName ? storedName : 'Guest';
    this.loadPlans();
  }

  loadPlans() {
    this.travelService.getMyPlans().subscribe({
      next: (res: any) => {
        this.plans = res;
        this.sortPlans();
      },
      error: (err) => console.error(err)
    });
  }

  sortPlans() {
    if (this.sortType === 'latest') {
      this.plans.sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    }

    if (this.sortType === 'budget') {
      this.plans.sort((a, b) => b.budget - a.budget);
    }

    if (this.sortType === 'date') {
      this.plans.sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    }
  }

  onSortChange(event: any) {
    this.sortType = event.target.value;
    this.sortPlans();
  }

  goToCreatePlan() {
    this.router.navigate(['/create-plan']);
  }

  goToMatches(planId: number) {
    this.router.navigate(['/matches'], { queryParams: { planId } });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}