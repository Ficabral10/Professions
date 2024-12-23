import { Component, inject } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-transition',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game-transition.component.html',
  styleUrl: './game-transition.component.scss'
})
export class GameTransitionComponent {

  public gameSessionService = inject(GameSessionService);
}
