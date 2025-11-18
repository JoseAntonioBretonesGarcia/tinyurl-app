import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlHistoryComponent } from './url-history.component';

describe('UrlHistoryComponent', () => {
  let component: UrlHistoryComponent;
  let fixture: ComponentFixture<UrlHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
