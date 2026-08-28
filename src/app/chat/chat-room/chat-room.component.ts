import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { NotificationService } from '../../notifications/notification.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  userId!: number; // The ID of the partner you are chatting with
  myId: number = Number(localStorage.getItem('userId')); // Your own ID from storage
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Get the partner's ID from the URL parameters
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.userId || this.userId <= 0) {
      this.toast.error("Invalid user ID");
      return;
    }

    this.loadMessages();
  }

  // This ensures the chat scrolls to the bottom whenever the view updates
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    this.chatService.getConversation(this.userId).subscribe({
      next: (res: any) => {
        this.messages = res;

        // Opening this conversation clears any unread "new message"
        // notifications from this partner on the backend - refresh the
        // sidebar badge so it reflects that immediately.
        this.notificationService.refreshUnreadCount();
      },
      error: (err) => console.error("Could not load messages", err)
    });
  }

  /**
   * FIX: The missing method that determines if a message was sent by you
   */
  isMyMessage(msg: any): boolean {
    return msg.sender.id === this.myId;
  }

  send() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.userId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error: (err) => this.toast.error("Failed to send message")
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}