import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

export interface ApiGameResult {
  timeToComplete: number;
  timeUsed: number;
  percentageOfHits: number;
  musicGenre: string;
}

export interface ProcessGameResultsParams {
  user: string;
  memoryGameResult: ApiGameResult;
  reactionGameResult: ApiGameResult;
  spotTheDifferenceGameResult: ApiGameResult;
}

export interface ProcessedGameResults {
  gptSummary: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://us-central1-professions-ai-dev.cloudfunctions.net';

  constructor() { }

  processGameResults(gameResults: ProcessGameResultsParams): Observable<ProcessedGameResults> {
    return this.http.post<ProcessedGameResults>(`${this.baseUrl}/processGameResult`, gameResults);
  }
}
