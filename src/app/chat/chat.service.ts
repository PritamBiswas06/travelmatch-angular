import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { DataCacheService } from '../core/data-cache.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl= `${API_BASE_URL}/chat`;

  constructor(private http: HttpClient, private cache: DataCacheService) {}

  // Get conversation with user
  getConversation(userId: number) {
    return this.cache.get(`chat:${userId}`, () => this.http.get(`${this.baseUrl}/${userId}`));
  }

  // Send message (raw string body)
  sendMessage(receiverId: number, content: string) {
    return this.http.post(`${this.baseUrl}/send/${receiverId}`, content, { headers: { 'Content-Type': 'text/plain' } }).pipe(tap(() => this.cache.invalidate(`chat:${receiverId}`)));
  }
}