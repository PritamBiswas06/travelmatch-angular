import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl= `${API_BASE_URL}/chat`;
  // private baseUrl = 'http://localhost:8080/api/chat'; 
  // private baseUrl = 'https://travelmatch1.up.railway.app/api/chat';

  constructor(private http: HttpClient) {}

  // Get conversation with user
  getConversation(userId: number) {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  // Send message (raw string body)
  sendMessage(receiverId: number, content: string) {
    return this.http.post(
      `${this.baseUrl}/send/${receiverId}`,
      content,
      { headers: { 'Content-Type': 'text/plain' } }
    );
  }
}