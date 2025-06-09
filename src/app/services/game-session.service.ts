import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ProcessedGameResults } from './results.service';
import { BeachTennisBetService } from './beach-tennis-bet.service';

interface GameSessionStep {
  id: string;
  title: string;
  isGameStep: boolean;
}

export interface GameResults {
  score: number;
  timeUsed: number;
  timeLeft: number;
}

export interface GameService {
  readonly song: string;
  gameFinished(): Promise<GameResults>
  startGame(): void;
  score$: Observable<number>;
  remainingTime$: Observable<number>;
  running$: Observable<boolean>;
}

interface Game extends GameSessionStep {
  service?: GameService;
  audio?: HTMLAudioElement;
}

export interface GameTransitionParams {
  score: number;
  timeUsed: number;
  nextStepText: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {

  private beachTennisBetService = inject(BeachTennisBetService);

  bipAudio = new Audio();
  finalBipAudio = new Audio();

  userName: string = '';

  games: Game[] = [
    {
      id: 'beach-tennis-bet',
      title: 'Beach Tennis Bet',
      isGameStep: true,
      service: this.beachTennisBetService,
      audio: new Audio()
    },
  ]

  gameResults: {[key: string]: GameResults} = {}

  steps: GameSessionStep[] = [
    {
      id: 'start',
      title: 'Beach Tennis Bet Game',
      isGameStep: false
    },
    {
      id: 'countdown',
      title: 'Get Ready',
      isGameStep: false
    },
    ...this.games,
    {
      id: 'loading-results',
      title: '',
      isGameStep: false
    },
    {
      id: 'final-results',
      title: 'Your Results',
      isGameStep: false
    }
  ]

  private _currentStep = new BehaviorSubject<GameSessionStep>(this.steps[0]);
  currentStep$ = this._currentStep.asObservable();

  currentStepId$ = this.currentStep$.pipe(
    map(step => step?.id)
  );

  currentStepTitle$ = this.currentStep$.pipe(
    map(step => step?.title)
  );

  inGame$ = this.currentStep$.pipe(
    map(step => step?.isGameStep)
  );

  currentTimer$ = this.currentStepId$.pipe(
    switchMap(stepId => {
      const currentGame = this.games.find(game => game.id === stepId);
      return currentGame?.service?.remainingTime$ || new BehaviorSubject(0).asObservable();
    })
  );

  currentScore$ = this.currentStepId$.pipe(
    switchMap(stepId => {
      const currentGame = this.games.find(game => game.id === stepId);
      return currentGame?.service?.score$ || new BehaviorSubject(0).asObservable();
    })
  );

  private _transitionParams = new BehaviorSubject<GameTransitionParams | null>(null);
  transitionParams$ = this._transitionParams.asObservable();

  private _processedResults = new BehaviorSubject<ProcessedGameResults | null>(null);
  processedResults$ = this._processedResults.asObservable();

  currentGame: Game | null = null;

  constructor() {
    this.preloadImages();
    this.preloadAudio();
  }

  startSession() {
    const countdownStep = this.steps.find(step => step.id === 'countdown');
    this._currentStep.next(countdownStep!);

    setTimeout(() => {
      this.nextStep();
    }, 3000);
  }

  preloadImages() {
    const imageUrls = [
      'assets/images/score.png',
      'assets/images/timer.png',
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  preloadAudio() {
    this.bipAudio.src = 'assets/audio/effects/bip.mp3';
    this.bipAudio.load();
    this.finalBipAudio.src = 'assets/audio/effects/bip-final.mp3';
    this.finalBipAudio.load();

    this.games.forEach(game => {
      if (game.service?.song) {
        game.audio!.src = 'assets/audio/songs/' + game.service.song;
        game.audio!.preload = 'auto';
        game.audio!.load();
      }
    });
  }

  resetSession() {
    this.gameResults = {};
    this._currentStep.next(this.steps[0]);
    this._transitionParams.next(null);
    this._processedResults.next(null);
    this.resetAudio();    
  }

  resetAudio() {
    this.bipAudio.pause();
    this.bipAudio.currentTime = 0;
    this.finalBipAudio.pause();
    this.finalBipAudio.currentTime = 0;

    this.games.forEach(game => {
      if (game.audio) {
        game.audio.pause();
        game.audio.currentTime = 0;
        game.audio.src = 'assets/audio/songs/' + game.service!.song;
        game.audio.volume = 1;
        game.audio.load();
      }
    });
  }

  setUserName(userName: string) {
    this.userName = userName;
  }

  playBip() {
    this.bipAudio.load();
    this.bipAudio.play();
  }

  playFinalBip() {
    this.finalBipAudio.load();
    this.finalBipAudio.play();
  }

  nextStep(previousStep?: Game) {
    const currentStepIndex = this.steps.findIndex(step => step.id === this._currentStep.value.id);
    const nextStep = this.steps[currentStepIndex + 1];

    if (previousStep?.isGameStep) {
      let nextStepText;
      if (nextStep.isGameStep) {
        nextStepText = `The next game will be: <strong>${nextStep.title}</strong>!`;
      } else {
        nextStepText = `All games finished! Your results will be processed now.`;
      }

      const transitionParams: GameTransitionParams = {
        score: this.gameResults[previousStep.id].score,
        timeUsed: this.gameResults[previousStep.id].timeUsed,
        nextStepText: nextStepText
      }

      this._transitionParams.next(transitionParams);
      
      this._currentStep.next({
        title: 'Game Finished',
        id: 'game-transition',
        isGameStep: false
      });

      setTimeout(() => {
        this._transitionParams.next(null);
        this._currentStep.next(nextStep);

        if (nextStep.id === 'loading-results') {
          this.loadResults();
        } else {
          this.currentGame = nextStep as Game;
          this.runCurrentGame();
        }
      }, 5000);

      return;
    }

    this._currentStep.next(nextStep);

    if (nextStep.isGameStep) {
      this.currentGame = nextStep as Game;
      this.runCurrentGame();
    }

    if (nextStep.id === 'loading-results') {
      this.loadResults();
    }
  }

  async runCurrentGame() {
    this.currentGame?.service?.startGame();
    setTimeout(() => {
      this.startNewGameSong();
    }, 500);

    const gameResults = await this.currentGame?.service?.gameFinished();
    this.gameResults[this.currentGame!.id] = gameResults!;
    this.stopGameSong();

    this.nextStep(this.currentGame!);
  }
  
  startNewGameSong() {
    this.currentGame!.audio!.src = 'assets/audio/songs/' + this.currentGame!.service!.song;
    this.currentGame!.audio!.load();
    this.currentGame!.audio!.play();
  }
  
  stopGameSong(callback?: () => void) {
    const fadeOutDuration = 4000;
    const fadeOutInterval = 25;
    const fadeOutStep = this.currentGame!.audio!.volume / (fadeOutDuration / fadeOutInterval);
  
    const fadeOut = setInterval(() => {
      if (this.currentGame!.audio!.volume > fadeOutStep) {
        this.currentGame!.audio!.volume -= fadeOutStep;
      } else {
        this.currentGame!.audio!.volume = 0;
        this.currentGame!.audio!.pause();
        this.currentGame!.audio!.currentTime = 0;
        clearInterval(fadeOut);
        if (callback) {
          callback();
        }
      }
    }, fadeOutInterval);
  }

  loadResults() {
    const resultText = this.gameResults['beach-tennis-bet']?.score === 100
      ? 'You won the bet!'
      : 'You lost the bet.';
    this._processedResults.next({
      message: resultText,
      gptSummary: ''
    });
    this.nextStep();
  }
}