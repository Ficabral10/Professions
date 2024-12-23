import { Injectable } from '@angular/core';
import { GameResults, GameService } from './game-session.service';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotTheDifferenceService implements GameService {

  private readonly availableTime = 60;
  public readonly song = 'jazz.mp3';
  private readonly scorePerDifference = 14;

  public readonly imageSets = [
    {
      correctImage: 'assets/images/spot-the-difference/errors-1.jpg',
      wrongImage: 'assets/images/spot-the-difference/errors-2.jpg',
      errors: [
        { x: 302 / 732 * 100, y: 37 / 500 * 100 },
        { x: 478 / 732 * 100, y: 48 / 500 * 100 },
        { x: 644 / 732 * 100, y: 91 / 500 * 100 },
        { x: 145 / 732 * 100, y: 200 / 500 * 100 },
        { x: 337 / 732 * 100, y: 376 / 500 * 100 },
        { x: 644 / 732 * 100, y: 430 / 500 * 100 },
        { x: 537 / 732 * 100, y: 365 / 500 * 100 }
      ]
    },
    {
      correctImage: 'assets/images/spot-the-difference/errors-3.jpg',
      wrongImage: 'assets/images/spot-the-difference/errors-4.jpg',
      errors: [
        { x: 148 / 644 * 100, y: 50 / 500 * 100 },
        { x: 420 / 644 * 100, y: 70 / 500 * 100 },
        { x: 339 / 644 * 100, y: 229 / 500 * 100 },
        { x: 172 / 644 * 100, y: 219 / 500 * 100 },
        { x: 104 / 644 * 100, y: 408 / 500 * 100 },
        { x: 515 / 644 * 100, y: 442 / 500 * 100 },
        { x: 485 / 644 * 100, y: 49 / 500 * 100 },
      ]
    },
    {
      correctImage: 'assets/images/spot-the-difference/errors-5.jpg',
      wrongImage: 'assets/images/spot-the-difference/errors-6.jpg',
      errors: [
        { x: 237 / 642 * 100, y: 103 / 497 * 100 },
        { x: 245 / 642 * 100, y: 300 / 497 * 100 },
        { x: 173 / 642 * 100, y: 426 / 497 * 100 },
        { x: 448 / 642 * 100, y: 447 / 497 * 100 },
        { x: 595 / 642 * 100, y: 445 / 497 * 100 },
        { x: 381 / 642 * 100, y: 378 / 497 * 100 },
        { x: 502 / 642 * 100, y: 156 / 497 * 100 },
      ]
    }
  ];

  private currentImageSetIndex = 0;
  public correctImage = this.imageSets[this.currentImageSetIndex].correctImage;
  public wrongImage = this.imageSets[this.currentImageSetIndex].wrongImage;
  private errors = this.imageSets[this.currentImageSetIndex].errors;

  private _running = new BehaviorSubject(false);
  running$ = this._running.asObservable();

  private _score = new BehaviorSubject(0);
  score$ = this._score.asObservable();

  private _foundErrors = new BehaviorSubject<{ x: number, y: number }[]>([]);
  foundErrors$ = this._foundErrors.asObservable();

  private _remainingTime = new BehaviorSubject(0);
  remainingTime$ = this._remainingTime.asObservable();

  private _finished = new BehaviorSubject<GameResults | false>(false);

  constructor() { }

  gameFinished(): Promise<GameResults> {
    return firstValueFrom(this._finished.asObservable().pipe(filter(result => !!result)));
  }

  selectImageSet() {
    const index = Math.floor(Math.random() * this.imageSets.length);

    if (index >= 0 && index < this.imageSets.length) {
      this.currentImageSetIndex = index;
      this.correctImage = this.imageSets[index].correctImage;
      this.wrongImage = this.imageSets[index].wrongImage;
      this.errors = this.imageSets[index].errors;
    }
  }

  startGame() {
    this.selectImageSet();
    this._running.next(true);
    this._score.next(0);
    this._remainingTime.next(this.availableTime);
    this._foundErrors.next([]);
    this._finished.next(false);
    this.setTimer();
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

  onImageClick(event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageWidth = rect.width;
    const imageHeight = rect.height;
  
    const xPercent = (x / imageWidth) * 100;
    const yPercent = (y / imageHeight) * 100;
  
    for (const error of this.errors) {
      if (Math.abs(error.x - xPercent) < 5 && Math.abs(error.y - yPercent) < 5) {
        const foundErrors = this._foundErrors.value;
  
        if (foundErrors.includes(error)) {
          return;
        }
  
        foundErrors.push(error);
        this._foundErrors.next(foundErrors);
  
        let nextScore = this._score.value + this.scorePerDifference;
        if (nextScore > 90) {
          nextScore = 100;
        }
        this._score.next(nextScore);
  
        this.checkGameFinished();
        break;
      }
    }
  }

  checkGameFinished() {
    if (this._foundErrors.value.length === this.errors.length) {
      this._running.next(false);
      this._finished.next({
        score: this._score.value,
        timeUsed: this.availableTime - this._remainingTime.value,
        timeLeft: this._remainingTime.value
      });
    }
  }
}