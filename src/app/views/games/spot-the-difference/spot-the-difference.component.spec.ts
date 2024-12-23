import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotTheDifferenceComponent } from './spot-the-difference.component';

describe('SpotTheDifferenceComponent', () => {
  let component: SpotTheDifferenceComponent;
  let fixture: ComponentFixture<SpotTheDifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotTheDifferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotTheDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
