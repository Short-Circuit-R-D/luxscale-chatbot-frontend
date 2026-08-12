import { InjectionToken } from '@angular/core';

declare global {
  interface Window {
    __APP_ENV__?: {
      BACKEND_BASE_URL?: string;
    };
  }
}

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => {
    const baseUrl = globalThis.window?.__APP_ENV__?.BACKEND_BASE_URL ?? '';
    return baseUrl.trim().replace(/\/+$/, '');
  },
});
