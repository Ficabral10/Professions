import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStateInfoComponent } from './game-state-info.component';

describe('GameStateInfoComponent', () => {
  let component: GameStateInfoComponent;
  let fixture: ComponentFixture<GameStateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStateInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameStateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
