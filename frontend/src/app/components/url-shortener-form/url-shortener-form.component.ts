// url-shortener-form.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-url-shortener-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './url-shortener-form.component.html',
  styleUrls: ['./url-shortener-form.component.scss']
})
export class UrlShortenerFormComponent {
  @Input() isLoading : boolean = false;
  @Output() urlShortened = new EventEmitter<any>();

  form: FormGroup;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      originalUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      customAlias: ['', [Validators.minLength(5)]],
      expiresAt: [''],
      allowDuplicates: [false]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }
    this.urlShortened.emit(this.form.value);
    this.form.reset();  
    this.form.controls['originalUrl'].setErrors(null);
    this.cdr.detectChanges();
  }
}