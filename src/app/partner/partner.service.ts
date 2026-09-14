import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { DataCacheService } from '../core/data-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private baseUrl= `${API_BASE_URL}/partner`;

  constructor(private http: HttpClient, private cache: DataCacheService) {}

  getMyPartners() {
    return this.cache.get('partner:my', () => this.http.get(`${this.baseUrl}/my`));
  }
}