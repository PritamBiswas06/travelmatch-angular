import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SavedTripsService, SavedTrip } from './saved-trips.service';
import { LoaderService } from '../core/loader.service';

@Component({
  selector: 'app-saved-trips',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './saved-trips.component.html',
  styleUrls: ['./saved-trips.component.css']
})
export class SavedTripsComponent implements OnInit {
  trips: SavedTrip[] = [];
  loading = true;
  error = '';

  constructor(private service: SavedTripsService, private loader: LoaderService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.getMine().subscribe({
      next: trips => { this.trips = trips || []; this.loading = false; },
      error: err => { this.loading = false; this.error = err?.error?.message || 'Could not load saved trips.'; }
    });
  }

  remove(trip: SavedTrip): void {
    this.loader.show('Removing saved trip...');
    this.service.unsave(trip.travelPlanId).subscribe({
      next: () => { this.trips = this.trips.filter(t => t.travelPlanId !== trip.travelPlanId); this.loader.hide(); },
      error: err => { this.loader.hide(); this.error = err?.error?.message || 'Could not remove saved trip.'; }
    });
  }
}
