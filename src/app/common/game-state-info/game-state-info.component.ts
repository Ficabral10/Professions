import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';

@Component({
  selector: 'app-game-state-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game-state-info.component.html',
  styleUrl: './game-state-info.component.scss'
})
export class GameStateInfoComponent {
  
  public gameSessionService = inject(GameSessionService);

  @Input() type: 'score' | 'timer' | null = null;
}
