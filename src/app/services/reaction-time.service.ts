import { Injectable } from '@angular/core';
import { GameResults, GameService } from './game-session.service';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactionTimeService implements GameService {
  private readonly availableTime = 60;
  private readonly minScore = 2;
  public readonly song = 'edm.mp3';

  private _running = new BehaviorSubject(false);
  running$ = this._running.asObservable();

  private _score = new BehaviorSubject(0);
  score$ = this._score.asObservable();

  private _remainingTime = new BehaviorSubject(0);
  remainingTime$ = this._remainingTime.asObservable();

  private _finished = new BehaviorSubject<GameResults | false>(false);

  colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink'];

  private _targetColor = new BehaviorSubject<string | null>(null);
  targetColor$ = this._targetColor.asObservable();

  private _currentColor = new BehaviorSubject<string | null>(null);
  currentColor$ = this._currentColor.asObservable();

  private previousColors: string[] = [];

  timestampWhenTargetColorAppeared: number | null = null;

  constructor() { }

  gameFinished(): Promise<GameResults> {
    return firstValueFrom(this._finished.asObservable().pipe(filter(result => !!result)));
  }

  startGame() {
    this._running.next(true);
    this._score.next(0);
    this._remainingTime.next(this.availableTime);
    this._finished.next(false);
  
    this.defineTargetColor();
    this.defineInitialColor();
    this.setupInitialColorChange();
  
    this.setTimer();
  }
  
  setupInitialColorChange() {
    let changeCount = 0;
    const interval = setInterval(() => {
      this.nextRandomColor(this._targetColor.value!);
  
      if (this._currentColor.value !== this._targetColor.value) {
        changeCount++;
      }
  
      if (changeCount >= 6) {
        clearInterval(interval);
        this.setupColorChange();
      }
    }, 300);
  }
  
  setupColorChange() {
    const interval = setInterval(() => {
      this.nextRandomColor();
  
      if (this._currentColor.value === this._targetColor.value) {
        this.timestampWhenTargetColorAppeared = Date.now();
        clearInterval(interval);
      }
    }, 300);
  }

  defineTargetColor() {
    let color;
    do {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    } while (this.previousColors.includes(color));
    
    this.previousColors.push(color);
    if (this.previousColors.length > 3) {
      this.previousColors.shift();
    }

    this._targetColor.next(color);
  }

  defineInitialColor() {
    let color = this._targetColor.value;
    while (color === this._targetColor.value) {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    this._currentColor.next(color);
  }

  nextRandomColor(excludeColor?: string) {
    const currentColor = this._currentColor.value;
    let color = currentColor;
    while (color === currentColor || color === excludeColor) {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    this._currentColor.next(color);
  }

  onColorClick() {
    const currentColor = this._currentColor.value;
    if (currentColor !== this._targetColor.value) {
      this._score.next(this._score.value - 10 < 0 ? 0 : this._score.value - 10);
      return;
    };
  
    const timestampWhenTargetColorWasClicked = Date.now();
    const reactionTime = timestampWhenTargetColorWasClicked - this.timestampWhenTargetColorAppeared!;
    
    let score = (1500 - reactionTime) / 100;
  
    if (score < this.minScore) {
      score = this.minScore;
    }
  
    let newScore = Math.round(this._score.value + score);
    if (newScore > 100) {
      newScore = 100;
    }
  
    this._score.next(newScore);
    this.checkGameFinished();
    this.nextCycle();
  }

  nextCycle() {
    this.defineTargetColor();
    this.defineInitialColor();
    this.setupColorChange();
  }

  setTimer() {
    const interval = setInterval(() => {
      this._remainingTime.next(this._remainingTime.value - 1);
      if (this._remainingTime.value === 0) {
        clearInterval(interval);
        this._running.next(false);
        this._finished.next({
          score: this._score.value,
          timeUsed: this.availableTime - this._remainingTime.value,
          timeLeft: this._remainingTime.value
        });
      }
    }, 1000);
  }

  checkGameFinished() {
    if (this._score.value >= 100) {
      this._running.next(false);
      this._finished.next({
        score: this._score.value,
        timeUsed: this.availableTime - this._remainingTime.value,
        timeLeft: this._remainingTime.value
      });
    }
  }
}