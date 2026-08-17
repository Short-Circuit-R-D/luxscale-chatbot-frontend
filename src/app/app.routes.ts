import { Routes } from '@angular/router';

import { Shell } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'newchat', pathMatch: 'full' },
      {
        path: 'newchat',
        loadComponent: () =>
          import('./features/new-chat/new-chat-page/new-chat-page.component').then(
            (m) => m.NewChatPage,
          ),
      },
      {
        path: 'chats',
        loadComponent: () =>
          import('./features/chats/chats-page/chats-page.component').then((m) => m.ChatsPage),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/chat/chat-page/chat-page.component').then((m) => m.ChatPage),
      },
      {
        path: 'chat/:id',
        loadComponent: () =>
          import('./features/chat/chat-page/chat-page.component').then((m) => m.ChatPage),
      },
    ],
  },
  { path: '**', redirectTo: 'newchat' },
];
