import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateUrlRequest {
  originalUrl: string;
  customAlias?: string | null;
  expiresAt?: string | null;
  allowDuplicates?: boolean;
}

export interface CreateUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt: string | null;
}

export interface UrlStats {
  short_code: string;
  original_url: string;
  created_at: string;
  expires_at: string | null;
  total_hits: number;
  last_hit_at: string | null;
}

@Injectable({ providedIn: 'root' })
export class UrlService {
  private readonly apiBase = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createShortUrl(body: CreateUrlRequest): Observable<CreateUrlResponse> {
    return this.http.post<CreateUrlResponse>(`${this.apiBase}/api/urls`, body);
  }

  getStats(shortCode: string): Observable<UrlStats> {
    return this.http.get<UrlStats>(`${this.apiBase}/api/urls/${encodeURIComponent(shortCode)}/stats`);
  }
}
