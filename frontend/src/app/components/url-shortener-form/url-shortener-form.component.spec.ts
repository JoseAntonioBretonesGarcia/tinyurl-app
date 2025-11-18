import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlShortenerFormComponent } from './url-shortener-form.component';

describe('UrlShortenerFormComponent', () => {
  let component: UrlShortenerFormComponent;
  let fixture: ComponentFixture<UrlShortenerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlShortenerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlShortenerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
