import { Component, inject } from '@angular/core';
import { ReactionTimeService } from '../../../services/reaction-time.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reaction-time',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './reaction-time.component.html',
  styleUrl: './reaction-time.component.scss'
})
export class ReactionTimeComponent {

  public reactionTimeService = inject(ReactionTimeService);
  
}
