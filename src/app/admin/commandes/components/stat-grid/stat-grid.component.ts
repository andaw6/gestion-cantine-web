import { Component, OnInit } from '@angular/core';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { Metric } from '@core/models/interfaces/metric.interface';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-grid',
  standalone: true,
  imports: [StatCardComponent, CommonModule],
  templateUrl: './stat-grid.component.html',
  styleUrl: './stat-grid.component.css'
})
export class StatGridComponent implements OnInit {

  metrics$ = new BehaviorSubject<Metric[]>([]);

  ngOnInit(): void {
    this.metrics$.next([
      {
        title: 'Nouvelles Commandes',
        value: 245,
        percentage: 20,
        color: 'blue'
      },
      {
        title: 'Commandes en Attente',
        value: 123,
        percentage: 11,
        color: 'purple'
      },
      {
        title: 'Commandes Livrées',
        value: 150,
        percentage: 18,
        color: 'green'
      },
      {
        title: 'Commandes Annulée',
        value: 150,
        percentage: 18,
        color: 'red'
      }
    ]);
  }

  get metrics(): Metric[] {
    return this.metrics$.getValue();
  }
}
