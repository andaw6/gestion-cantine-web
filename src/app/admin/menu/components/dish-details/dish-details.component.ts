import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Dish } from '@core/models/dishes.model';
import { DishesService } from '@core/services/dishes.service';

@Component({
  selector: 'app-dish-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './dish-details.component.html',
  styleUrl: './dish-details.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DishDetailsComponent implements OnInit {
  dish!: Dish | null;


  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }


  constructor(private route: ActivatedRoute, private dishesService: DishesService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.dishesService.getDishById(id).subscribe(dish => this.dish = dish);
  }
}