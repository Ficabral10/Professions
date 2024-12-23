import { Component, inject } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start-session',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './start-session.component.html',
  styleUrl: './start-session.component.scss'
})
export class StartSessionComponent {

  public gameSessionService = inject(GameSessionService);
  userName: string = '';

  startSession() {
    this.gameSessionService.setUserName(this.userName);
    this.gameSessionService.startSession();
  }

}
