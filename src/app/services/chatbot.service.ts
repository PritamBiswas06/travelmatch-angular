import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {

  return this.http.post(
    `${API_BASE_URL}/chat/chatbot`,
    // 'http://localhost:8080/api/chat/chatbot',
    // 'https://travelmatch1.up.railway.app/api/chat/chatbot',
    { message: message }
  );

}

}