import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MemoryCardComponent } from './memory-card/memory-card.component';
import { MemoryCardGameService } from '../../../services/memory-card-game.service';

@Component({
  selector: 'app-memory-card-game',
  standalone: true,
  imports: [
    CommonModule,
    MemoryCardComponent
  ],
  templateUrl: './memory-card-game.component.html',
  styleUrl: './memory-card-game.component.scss'
})
export class MemoryCardGameComponent{

  public memoryCardGameService = inject(MemoryCardGameService);

}
