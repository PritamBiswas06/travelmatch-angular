import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private baseUrl= `${API_BASE_URL}/partner`;

  constructor(private http: HttpClient) {}

  getMyPartners() {
    return this.http.get(`${this.baseUrl}/my`);
  }
}