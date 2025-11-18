// url-history.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ShortUrl {
  originalUrl: string;
  shortUrl: string;
  expiresAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UrlHistoryService {
  private urlsSubject = new BehaviorSubject<ShortUrl[]>([]);
  urls$ = this.urlsSubject.asObservable();

  constructor() {
    this.loadHistory();
  }

  addUrl(url: ShortUrl): void {
    const current = this.urlsSubject.value;
    this.urlsSubject.next([url, ...current]);
    this.saveToLocalStorage();
  }

  loadHistory(): void {
    const saved = localStorage.getItem('urlHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.urlsSubject.next(parsed);
      } catch (e) {
        console.error('Error loading URL history', e);
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('urlHistory', JSON.stringify(this.urlsSubject.value));
  }

  copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url);
  }
}