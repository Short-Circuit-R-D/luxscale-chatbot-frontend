import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export type ChatRole = 'user' | 'assistant';

export interface SendMessageRequest {
  session_id?: string;
  message: string;
}

export interface SendMessageResponse {
  session_id: string;
  response: string;
  intent: string;
}

export interface ChatTurn {
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface ChatSessionResponse {
  session_id: string;
  messages: ChatTurn[];
}

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
