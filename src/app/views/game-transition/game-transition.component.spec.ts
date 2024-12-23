import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTransitionComponent } from './game-transition.component';

describe('GameTransitionComponent', () => {
  let component: GameTransitionComponent;
  let fixture: ComponentFixture<GameTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTransitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
