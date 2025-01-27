import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dish } from '@core/models/dishes.model';
import { Observable } from 'rxjs';
import { DailyDishCardComponent } from '../daily-dish-card/daily-dish-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-dishes',
  standalone: true,
  imports: [CommonModule, DailyDishCardComponent],
  templateUrl: './daily-dishes.component.html',
  styleUrl: './daily-dishes.component.css'
})
export class DailyDishesComponent {
  @Input() dishes!: Dish[];
  today = new Date();
  @Output() onEditDish = new EventEmitter<Dish>();
  @Output() onShowDetail = new EventEmitter<number>();
  @Output() onDeleteDish = new EventEmitter<number>();
}
