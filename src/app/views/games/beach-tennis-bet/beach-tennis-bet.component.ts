import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeachTennisBetService } from '../../../services/beach-tennis-bet.service';

@Component({
  selector: 'app-beach-tennis-bet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beach-tennis-bet.component.html',
  styleUrl: './beach-tennis-bet.component.scss'
})
export class BeachTennisBetComponent {
  betService = inject(BeachTennisBetService);

  choose(team: 'Team A' | 'Team B') {
    this.betService.placeBet(team);
  }
}
