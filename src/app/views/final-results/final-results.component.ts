import { Component, inject } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-final-results',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './final-results.component.html',
  styleUrl: './final-results.component.scss'
})
export class FinalResultsComponent {

  public gameSessionService = inject(GameSessionService);

  formattedSummary$ = this.gameSessionService.processedResults$.pipe(
    map(results => this.formatSummary(results?.gptSummary || ''))
  );

  formatSummary(summary: string): string {
    return summary
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\\n/g, '<br>');
  }
}
