import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dish } from '@core/models/dishes.model';
import { DishImgCardComponent } from '@shared/components/dish-img-card/dish-img-card.component';

@Component({
  selector: 'app-daily-dish-card',
  standalone: true,
  imports: [CommonModule, DishImgCardComponent],
  templateUrl: './daily-dish-card.component.html',
  styleUrl: './daily-dish-card.component.css'
})
export class DailyDishCardComponent {
  @Input({ required: true }) dish!: Dish;

  @Output() edit = new EventEmitter<Dish>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleDaily = new EventEmitter<number>();   
  
  
  deleteDish(){
    this.delete.emit(this.dish.id);
  }
}
