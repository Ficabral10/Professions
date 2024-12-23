import { Component, inject, Input } from '@angular/core';
import { Card, MemoryCardGameService } from '../../../../services/memory-card-game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memory-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './memory-card.component.html',
  styleUrl: './memory-card.component.scss'
})
export class MemoryCardComponent {

  private memoryCardGameService = inject(MemoryCardGameService);

  @Input() card: Card | null = null;

  flipCard() {
    this.memoryCardGameService.flipCard(this.card!.id);
  }
}
