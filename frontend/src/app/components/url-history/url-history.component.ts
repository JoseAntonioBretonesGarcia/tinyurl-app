// url-history.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ShortUrl {
  originalUrl: string;
  shortUrl: string;
  expiresAt?: Date;
}

@Component({
  selector: 'app-url-history',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './url-history.component.html',
  styleUrls: ['./url-history.component.scss']
})
export class UrlHistoryComponent {
  @Input() urlHistory: ShortUrl[] | null = [];
  @Output() urlCopied = new EventEmitter<string>();

  copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url);
    this.urlCopied.emit('URL copied to clipboard!' as string);
  }
}