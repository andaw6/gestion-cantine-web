import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DishType } from '@core/models/types';

@Component({
  selector: 'app-menu-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-type-selector.component.html',
  styleUrl: './menu-type-selector.component.css'
})
export class MenuTypeSelectorComponent {
  @Input({ required: true }) dishType!: DishType;

  @Output() dishTypeEmiter: EventEmitter<DishType> = new EventEmitter<DishType>();

  changeDishType(type: DishType) {
    this.dishType = type;
    this.dishTypeEmiter.emit(this.dishType);
  }
}
