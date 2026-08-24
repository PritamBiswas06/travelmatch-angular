import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  message = '';
  messages: any[] = [];

  isOpen = true; // 👈 control open/close

  constructor(private bot: ChatbotService) {}

  // ✅ AUTO WELCOME MESSAGE
  ngOnInit() {
    this.showWelcomeMessage();
  }

  showWelcomeMessage() {
    this.messages.push({
      sender: 'bot',
      text: "👋 Hi! I'm your AI Travel Assistant.\nWhere are you planning to travel?"
    });
  }

  // ✅ CLOSE BUTTON
  toggleChat() {
    this.isOpen = !this.isOpen;

    // reopen → show welcome again if empty
    if (this.isOpen && this.messages.length === 0) {
      this.showWelcomeMessage();
    }
  }

  // ✅ SEND MESSAGE
  send() {

    if (!this.message.trim()) return;

    const userMsg = this.message;

    // USER MESSAGE
    this.messages.push({
      sender: 'user',
      text: userMsg
    });

    this.message = '';

    // 🔥 TYPING EFFECT (optional feel)
    this.messages.push({
      sender: 'bot',
      text: "Typing..."
    });

    this.bot.sendMessage(userMsg).subscribe((res: any) => {

      // remove "Typing..."
      this.messages.pop();

      this.messages.push({
        sender: 'bot',
        text: res.response
      });

    });
  }

}