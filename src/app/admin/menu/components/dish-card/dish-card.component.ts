import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Dish } from '@core/models/dishes.model';
import { DishImgCardComponent } from '@shared/components/dish-img-card/dish-img-card.component';

@Component({
  selector: 'app-dish-card',
  standalone: true,
  imports: [CommonModule, DishImgCardComponent],
  templateUrl: './dish-card.component.html',
  styleUrl: './dish-card.component.css'
})
export class DishCardComponent {

  @Input() item!: Dish;
  @Output() edit = new EventEmitter<Dish>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleDaily = new EventEmitter<number>();

  get statusBadgeClasses(): string {
    return this.item.available
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  get typeBadgeClasses(): string {
    return this.item.category.type === 'FOOD'
      ? 'bg-orange-500'
      : 'bg-blue-500';
  }

  deleteDish() {
    this.delete.emit(this.item.id);
  }
}
