import { Component, inject, OnInit } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent implements OnInit {

  public gameSessionService = inject(GameSessionService);

  number = 3;

  ngOnInit(): void {
    this.gameSessionService.playBip();

    const interval = setInterval(() => {
      if (this.number === 1) {
        clearInterval(interval);
        this.gameSessionService.playFinalBip();
        return;
      }

      this.number--;
      this.gameSessionService.playBip();
    }, 1000);
  }

}
