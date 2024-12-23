import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingResultsComponent } from './loading-results.component';

describe('LoadingResultsComponent', () => {
  let component: LoadingResultsComponent;
  let fixture: ComponentFixture<LoadingResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
