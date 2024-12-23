import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SpotTheDifferenceService } from '../../../services/spot-the-difference.service';

@Component({
  selector: 'app-spot-the-difference',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './spot-the-difference.component.html',
  styleUrl: './spot-the-difference.component.scss'
})
export class SpotTheDifferenceComponent {

  public spotTheDifferenceService = inject(SpotTheDifferenceService);
}