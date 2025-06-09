import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { GameResults, GameService } from './game-session.service';

@Injectable({
  providedIn: 'root'
})
export class BeachTennisBetService implements GameService {
  readonly song = 'edm.mp3';

  private _running = new BehaviorSubject(false);
  running$ = this._running.asObservable();

  private _score = new BehaviorSubject(0);
  score$ = this._score.asObservable();

  private _remainingTime = new BehaviorSubject(0);
  remainingTime$ = this._remainingTime.asObservable();

  private _finished = new BehaviorSubject<GameResults | false>(false);

  private bet: 'Team A' | 'Team B' | null = null;
  private winner: 'Team A' | 'Team B' | null = null;

  constructor() { }

  gameFinished(): Promise<GameResults> {
    return firstValueFrom(this._finished.asObservable().pipe(filter(r => !!r)));
  }

  startGame() {
    this._running.next(true);
    this._score.next(0);
    this._remainingTime.next(0);
    this._finished.next(false);
    this.bet = null;
    this.winner = null;
  }

  placeBet(team: 'Team A' | 'Team B') {
    if (!this._running.value) {
      return;
    }
    this.bet = team;
    this.winner = Math.random() < 0.5 ? 'Team A' : 'Team B';
    if (this.bet === this.winner) {
      this._score.next(100);
    } else {
      this._score.next(0);
    }
    this.finishGame();
  }

  private finishGame() {
    this._running.next(false);
    this._finished.next({
      score: this._score.value,
      timeUsed: 0,
      timeLeft: 0
    });
  }

  get currentWinner(): 'Team A' | 'Team B' | null {
    return this.winner;
  }
}
