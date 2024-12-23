import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateInfoComponent } from './common/game-state-info/game-state-info.component';
import { GameSessionService } from './services/game-session.service';
import { StartSessionComponent } from './views/start-session/start-session.component';
import { MemoryCardGameComponent } from './views/games/memory-card-game/memory-card-game.component';
import { CountdownComponent } from './views/countdown/countdown.component';
import { LoadingResultsComponent } from './views/loading-results/loading-results.component';
import { SpotTheDifferenceComponent } from './views/games/spot-the-difference/spot-the-difference.component';
import { GameTransitionComponent } from './views/game-transition/game-transition.component';
import { ReactionTimeComponent } from './views/games/reaction-time/reaction-time.component';
import { FinalResultsComponent } from './views/final-results/final-results.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    GameStateInfoComponent,
    StartSessionComponent,
    MemoryCardGameComponent,
    CountdownComponent,
    LoadingResultsComponent,
    SpotTheDifferenceComponent,
    GameTransitionComponent,
    ReactionTimeComponent,
    FinalResultsComponent
  ],
  standalone: true
})
export class AppComponent implements OnInit {

  public gameSessionService = inject(GameSessionService);

  constructor() { }

  ngOnInit() {
  }
}
