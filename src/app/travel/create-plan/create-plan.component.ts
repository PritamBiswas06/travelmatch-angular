import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TravelService } from '../travel.service';
import { LoaderService } from '../../core/loader.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements AfterViewInit, OnDestroy {

  planData = {
    fromLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: null,
    travelType: ''
  };

  private map!: L.Map;
  private fromMarker?: L.Marker;
  private destMarker?: L.Marker;

  private routeLine?: L.Polyline;
  private airplaneMarker?: L.Marker;
  private flightTrail?: L.Polyline;
  private animationFrameId?: number;

  distance = '0';
  travelTime = '0';

  fromSuggestions: any[] = [];
  destSuggestions: any[] = [];

  travelOptions: any = {};
  nearbyPlaces: any[] = [];
  aiTips: any = {};

  private searchTimeout: any;

  private customIcon = L.divIcon({
    html: `<div class="map-marker"></div>`,
    className: '',
    iconSize: [20, 20]
  });

  constructor(
    private travelService: TravelService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', { 
      zoomControl: false,
      attributionControl: false 
    }).setView([22.97, 78.65], 5);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    ).addTo(this.map);
    
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
  }

  fetchSuggestions(query: string, type: 'from' | 'dest') {
    if (!query || query.trim().length < 3) {
      type === 'from' ? this.fromSuggestions = [] : this.destSuggestions = [];
      return;
    }

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );
        const data = await res.json();
        type === 'from' ? (this.fromSuggestions = data) : (this.destSuggestions = data);
      } catch (err) {
        console.error('Suggestion error:', err);
      }
    }, 300);
  }

  selectSuggestion(item: any, type: 'from' | 'dest') {
    const latlng = L.latLng(+item.lat, +item.lon);
    const city = item.display_name.split(',')[0];

    if (type === 'from') {
      this.planData.fromLocation = city;
      if (this.fromMarker) this.map.removeLayer(this.fromMarker);

      this.fromMarker = L.marker(latlng, { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup(`<b>🛫 Start:</b> ${city}`);
    } else {
      this.planData.destination = city;
      if (this.destMarker) this.map.removeLayer(this.destMarker);

      this.destMarker = L.marker(latlng, { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup(`<b>🛬 Destination:</b> ${city}`);
    }

    this.fromSuggestions = [];
    this.destSuggestions = [];

    this.map.flyTo(latlng, 10, { duration: 1.5 });
    this.tryDrawRoute();
  }

  private tryDrawRoute() {
    if (this.fromMarker && this.destMarker) {
      this.drawRoute(
        this.fromMarker.getLatLng(),
        this.destMarker.getLatLng()
      );
    }
  }

  private async drawRoute(start: L.LatLng, end: L.LatLng) {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.routeLine) this.map.removeLayer(this.routeLine);
    if (this.airplaneMarker) this.map.removeLayer(this.airplaneMarker);
    if (this.flightTrail) this.map.removeLayer(this.flightTrail);

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      
      if (!data.routes || data.routes.length === 0) return;

      const route = data.routes[0];
      const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);

      this.routeLine = L.polyline(coords, {
        color: '#94a3b8',
        weight: 3,
        dashArray: '6, 10',
        opacity: 0.7
      }).addTo(this.map);

      this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });

      const planeIcon = L.divIcon({
        html: `<div class="plane-wrapper"><span class="plane-icon">✈️</span></div>`,
        className: 'leaflet-plane-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      this.airplaneMarker = L.marker(coords[0], { icon: planeIcon }).addTo(this.map);

      this.flightTrail = L.polyline([], {
        color: '#4f46e5',
        weight: 4,
        opacity: 0.9
      }).addTo(this.map);

      let i = 0;
      let speed = 2;

      const animate = () => {
        if (i >= coords.length - 1) {
          this.airplaneMarker!.setLatLng(coords[coords.length - 1]);
          return;
        }

        const current = coords[i];
        const next = coords[i + 1];

        this.airplaneMarker!.setLatLng(current);

        const angle = Math.atan2(next[0] - current[0], next[1] - current[1]) * (180 / Math.PI);
        const calibratedAngle = angle - 45;

        const el = this.airplaneMarker!.getElement();
        if (el) {
          const plane = el.querySelector('.plane-icon') as HTMLElement;
          if (plane) {
            plane.style.transform = `rotate(${calibratedAngle}deg)`;
          }
        }

        this.flightTrail!.addLatLng(current);

        if (i < coords.length * 0.3) speed += 0.2;
        else if (i > coords.length * 0.7) speed = Math.max(1, speed - 0.15);

        i += Math.floor(speed);

        if (i >= coords.length) i = coords.length - 1;

        this.animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      this.distance = (route.distance / 1000).toFixed(1);
      this.travelTime = (route.duration / 3600).toFixed(1);

      this.calculateTravelOptions();
      this.generateAITips();
      this.getNearbyPlaces(end.lat, end.lng);

    } catch (error) {
      console.error('Routing failed:', error);
    }
  }

  private calculateTravelOptions() {
    const dist = Number(this.distance);
    this.travelOptions = {
      car: this.travelTime,
      train: (dist / 80).toFixed(1),
      flight: (dist / 600).toFixed(1)
    };
  }

  private generateAITips() {
    const dist = Number(this.distance);
    this.aiTips = {
      bestTime: dist > 500 ? 'Early Flight / Train' : 'Road Trip',
      budget: dist > 800 ? 'Book flights 3 weeks early' : 'Rail passes offer high savings',
      weather: 'Optimal for travel ☀️'
    };
  }

  private async getNearbyPlaces(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hotel&limit=4&viewbox=${lng - 0.1},${lat + 0.1},${lng + 0.1},${lat - 0.1}`
      );
      this.nearbyPlaces = await res.json();
    } catch (err) {
      console.error('Nearby API Error:', err);
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-field')) {
      this.fromSuggestions = [];
      this.destSuggestions = [];
    }
  }

  onSubmit() {
    this.loader.show('Creating Plan...');
    this.travelService.createPlan(this.planData).subscribe({
      next: () => {
        this.loader.hide();
        this.router.navigate(['/dashboard']);
      },
      error: () => this.loader.hide()
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.map) this.map.remove();
  }
}