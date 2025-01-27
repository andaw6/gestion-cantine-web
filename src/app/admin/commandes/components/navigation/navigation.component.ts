import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderStatus } from '@core/models/types';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  @Input({ required: true }) orderStatus!: OrderStatus;
  @Output() onOrderStatusChange = new EventEmitter<OrderStatus>();

  changeStatus(value: OrderStatus) {
    this.orderStatus = value;
    this.onOrderStatusChange.emit(value);
  }
}
