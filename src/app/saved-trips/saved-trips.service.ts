import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface SavedTrip {
  id: number;
  travelPlanId: number;
  ownerId: number;
  ownerName: string;
  ownerCity: string | null;
  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SavedTripsService {
  private baseUrl = `${API_BASE_URL}/saved-trips`;
  constructor(private http: HttpClient) {}

  getMine(): Observable<SavedTrip[]> { return this.http.get<SavedTrip[]>(this.baseUrl); }
  save(travelPlanId: number): Observable<SavedTrip> { return this.http.post<SavedTrip>(`${this.baseUrl}/${travelPlanId}`, {}); }
  unsave(travelPlanId: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${travelPlanId}`); }
  check(travelPlanId: number): Observable<{ saved: boolean }> { return this.http.get<{ saved: boolean }>(`${this.baseUrl}/check/${travelPlanId}`); }
}
