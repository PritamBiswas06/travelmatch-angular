import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface TravelMemory {
  id: number;
  userId: number;
  travelPlanId: number;
  destination: string;
  fromLocation: string;
  caption: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TravelMemoryService {
  private baseUrl = `${API_BASE_URL}/travel-memories`;
  constructor(private http: HttpClient) {}

  getForUser(userId: number): Observable<TravelMemory[]> { return this.http.get<TravelMemory[]>(`${this.baseUrl}/user/${userId}`); }

  create(travelPlanId: number, caption: string, file: File): Observable<TravelMemory> {
    const form = new FormData();
    form.append('travelPlanId', String(travelPlanId));
    if (caption.trim()) form.append('caption', caption.trim());
    form.append('file', file);
    return this.http.post<TravelMemory>(this.baseUrl, form);
  }

  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
