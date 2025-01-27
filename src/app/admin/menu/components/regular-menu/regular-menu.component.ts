import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category, Dish } from '@core/models/dishes.model';
import { DishCardComponent } from '../dish-card/dish-card.component';
import { CommonModule } from '@angular/common';
import { DishType } from '@core/models/types';
import { MenuTypeSelectorComponent } from '../menu-type-selector/menu-type-selector.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regular-menu',
  standalone: true,
  imports: [DishCardComponent, CommonModule, MenuTypeSelectorComponent],
  templateUrl: './regular-menu.component.html',
  styleUrl: './regular-menu.component.css'
})
export class RegularMenuComponent implements OnInit {
  @Input() dishes!: Dish[];
  @Input() categories!: Category[];
  selectedDishType: DishType = 'FOOD';
  selectedCategory = 'Tous';
  @Output() onEditDish = new EventEmitter<Dish>();
  @Output() onShowDetail = new EventEmitter<number>();
  @Output() onDeleteDish = new EventEmitter<number>();

  ngOnInit(): void {

    console.log("this is a test from regular menu ")
    console.log(this.categories)
  }

  onSelectedDishType(type: DishType) {
    this.selectedDishType = type;
    this.selectedCategory = "Tous";
  }

  selectCategory(name: string) {
    this.selectedCategory = name;
  }

  get getDishes() {
    return this.dishes.filter(dish => {
      return this.selectedCategory === 'Tous' ?
        dish.category.type === this.selectedDishType :
        dish.category.type === this.selectedDishType &&
        dish.category.name === this.selectedCategory
        ;
    });
  }

}
