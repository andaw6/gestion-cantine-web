import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dish } from '@core/models/dishes.model';

@Component({
  selector: 'app-dish-img-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dish-img-card.component.html',
  styleUrl: './dish-img-card.component.css'
})
export class DishImgCardComponent {
  @Input({ required: true }) dish!: Dish;

  @Output() edit = new EventEmitter<Dish>();
  @Output() delete = new EventEmitter<void>();
  @Output() toggleDaily = new EventEmitter<number>();   
}
