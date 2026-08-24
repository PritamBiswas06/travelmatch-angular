// Mirrors the backend's NotificationResponse DTO exactly
// (com.pvp.travelmatch.dto.NotificationResponse).
export interface Notification {
  id: number;
  senderId: number | null;
  senderName: string | null;
  message: string;
  type: string;
  relatedEntityId: number | null;
  read: boolean;
  createdAt: string;
}

// Mirrors the backend's UnreadCountResponse DTO.
export interface UnreadCountResponse {
  unreadCount: number;
}