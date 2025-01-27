import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { OrderMode } from '@core/models/types';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() displayModeEmiter: EventEmitter<OrderMode> = new EventEmitter<OrderMode>();
  @Input({ required: true }) displayMode!: OrderMode;

  changeDisplayMode = (mode: OrderMode) => {
    this.displayMode = mode;
    this.displayModeEmiter.emit(this.displayMode);
  };
}
