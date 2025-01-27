import { Component, Input } from '@angular/core';
import { Metric } from '@core/models/interfaces/metric.interface';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input({ required: true }) metric!: Metric;
}
