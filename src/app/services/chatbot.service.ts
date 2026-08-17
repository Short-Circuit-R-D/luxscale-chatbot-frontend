import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ChatSessionResponse } from '../dtos/chat-session-response.dto';
import { SendMessageRequest } from '../dtos/send-message-request.dto';
import { SendMessageResponse } from '../dtos/send-message-response.dto';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  sendMessage(request: SendMessageRequest): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(`${this.baseUrl}/api/v1/chat/message`, request);
  }

  getChat(sessionId: string): Observable<ChatSessionResponse> {
    const encodedSessionId = encodeURIComponent(sessionId);
    return this.http.get<ChatSessionResponse>(`${this.baseUrl}/api/v1/chat/${encodedSessionId}`);
  }
}
