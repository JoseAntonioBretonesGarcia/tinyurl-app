// app.component.ts
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, delay, finalize, Observable } from 'rxjs';
import { UrlService } from './services/url.service';
import { UrlHistoryService } from './services/url-history.service';
import { ShortUrl, UrlHistoryComponent } from './components/url-history/url-history.component';
import { FooterComponent } from './components/footer/footer.component';
import { UrlShortenerFormComponent } from './components/url-shortener-form/url-shortener-form.component';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FooterComponent,
    UrlHistoryComponent,
    UrlShortenerFormComponent,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  loading = signal(false);
  urlHistory$ : Observable<ShortUrl[]> | undefined; 
  urlHistory: BehaviorSubject<ShortUrl[]> = new BehaviorSubject<ShortUrl[]>([]);
  showToast = signal(false);
  isErrorToast = signal(false);
  toastMessage = signal('');
  private toastTimeout: any = null;


  constructor(
    private urlService: UrlService,
    private historyService: UrlHistoryService,
  ) {}

  ngOnInit(): void {
    // Load initial history
    this.urlHistory$ = this.historyService.urls$;
    this.historyService.loadHistory();
    this.urlHistory$.subscribe((urls) => {
      this.urlHistory.next(urls);
    });
  }

  onUrlShortened(formData: any): void {
    this.loading.set(true);
    this.urlService.createShortUrl({
      originalUrl: formData.originalUrl,
      customAlias: formData.customAlias || undefined,
      expiresAt: formData.expiresAt || undefined,
      allowDuplicates: formData.allowDuplicates
    }).pipe(
        delay(1500),
        finalize(() => this.loading.set(false)) // This will run when the observable completes or errors
      ).subscribe({
      next: (res: any) => {
        this.historyService.addUrl({
          originalUrl: formData.originalUrl,
          shortUrl: res.shortUrl,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
        });
        this.loading.set(false);
        this.showSuccess('URL shortened successfully!');
      },
      error: (err) => {
        this.loading.set(false);
        this.showError(err?.error?.message || 'Failed to shorten URL');
      },complete: () => {
        this.loading.set(false);
      }
    });
  }

  onUrlCopied(message: string): void {
    this.showSuccess(message);
  }

private showSuccess(message: string): void {
  this.isErrorToast.set(false);
  this.toastMessage.set(message);
  this.showToast.set(true);
  this.autoHideToast();
}

private showError(message: string): void {
  this.isErrorToast.set(true);
  this.toastMessage.set(message);
  this.showToast.set(true);
  this.autoHideToast();
}

hideToast(): void {
  this.showToast.set(false);
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
    this.toastTimeout = null;
  }
}

private autoHideToast(): void {
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
  }
  this.toastTimeout = setTimeout(() => {
    this.hideToast();
  }, 5000); // 5 seconds
}
}