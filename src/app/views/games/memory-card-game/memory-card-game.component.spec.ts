import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryCardGameComponent } from './memory-card-game.component';

describe('MemoryCardGameComponent', () => {
  let component: MemoryCardGameComponent;
  let fixture: ComponentFixture<MemoryCardGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryCardGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryCardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
