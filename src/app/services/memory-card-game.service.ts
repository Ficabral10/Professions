import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { GameResults, GameService } from './game-session.service';

interface CardModel {
  id: string;
  image: string;
}

export interface Card {
  id: string;
  image: string;
  flipped: boolean;
  matched: boolean;
}

const cardModels: CardModel[] = [
  {
    id: 'grape',
    image: '🍇'
  },
  {
    id: 'orange',
    image: '🍊'
  },
  {
    id: 'apple',
    image: '🍎'
  },
  {
    id: 'pear',
    image: '🍐'
  },
  {
    id: 'cherries',
    image: '🍒'
  },
  {
    id: 'strawberry',
    image: '🍓'
  },
];

@Injectable({
  providedIn: 'root'
})
export class MemoryCardGameService implements GameService {

  private readonly availableTime = 60;
  private readonly flipAnimationTime = 1000;
  private readonly scorePerMatch = 18;
  public readonly song = 'classic.mp3';

  private _running = new BehaviorSubject(false);
  running$ = this._running.asObservable();

  private _cards = new BehaviorSubject<Card[]>([]);
  cards$ = this._cards.asObservable();

  private _score = new BehaviorSubject(0);
  score$ = this._score.asObservable();

  private _remainingTime = new BehaviorSubject(0);
  remainingTime$ = this._remainingTime.asObservable();

  private _finished = new BehaviorSubject<GameResults | false>(false);

  constructor() { }

  gameFinished(): Promise<GameResults> {
    return firstValueFrom(this._finished.asObservable().pipe(filter(result => !!result)));
  }

  startGame() {
    this._cards.next(this.generateCards());
    this._running.next(true);
    this._score.next(0);
    this._remainingTime.next(this.availableTime);
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

  generateCards(): Card[] {
    let cards = cardModels.map(model => {
      return {
        id: model.id + '_1',
        image: model.image,
        flipped: false,
        matched: false
      };
    });

    cards = cards.concat(cardModels.map(model => {
      return {
        id: model.id + '_2',
        image: model.image,
        flipped: false,
        matched: false
      };
    }));

    return this.shuffle(cards);
  }

  shuffle(cards: Card[]): Card[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    return cards;
  }

  flipCard(cardId: string) {
    const cards = this._cards.value;
    const flippedCards = cards.filter(card => card.flipped && !card.matched);

    if (flippedCards.length === 2) {
      return;
    }

    const cardIndex = cards.findIndex(card => card.id === cardId);
    cards[cardIndex].flipped = true;
    this._cards.next(cards);

    if (flippedCards.length === 0) {
      return;
    }

    const flippedCard = flippedCards[0];
    const flippedCardIndex = cards.findIndex(card => card.id === flippedCard.id);

    setTimeout(() => {
      if (flippedCard.id.split('_')[0] === cardId.split('_')[0]) {
        this.onCardMatched(cardIndex, flippedCardIndex);
      } 
      else {
        this.onCardNotMatched(cardIndex, flippedCardIndex);
      }
    }, this.flipAnimationTime);
  }

  onCardMatched(firstCardIndex: number, secondCardIndex: number) {
    const cards = this._cards.value;
    this._score.next(this._score.value + this.scorePerMatch);

    if (this._score.value > 90) {
      this._score.next(100);
    }

    cards[firstCardIndex].matched = true;
    cards[secondCardIndex].matched = true;
    this._cards.next(cards);
    this.checkGameFinished();
  }

  onCardNotMatched(firstCardIndex: number, secondCardIndex: number) {
    const cards = this._cards.value;
    cards[firstCardIndex].flipped = false;
    cards[secondCardIndex].flipped = false;
    this._cards.next(cards);
  }

  checkGameFinished() {
    const allMatched = this._cards.value.every(card => card.matched);
    if (!allMatched) {
      return;
    }

    this._running.next(false);
    this._finished.next({
      score: this._score.value,
      timeUsed: this.availableTime - this._remainingTime.value,
      timeLeft: this._remainingTime.value
    });
  }
}
