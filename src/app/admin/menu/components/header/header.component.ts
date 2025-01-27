import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DishMode } from '@core/models/types';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() displayModeEmiter: EventEmitter<DishMode> = new EventEmitter<DishMode>();
  @Output() openModal: EventEmitter<void> = new EventEmitter<void>();
  @Input({ required: true }) displayMode!: DishMode;

  openAddModal = () => this.openModal.emit();

  changeDisplayMode = (mode: DishMode) => {
    this.displayMode = mode;
    this.displayModeEmiter.emit(this.displayMode);
  };
}
