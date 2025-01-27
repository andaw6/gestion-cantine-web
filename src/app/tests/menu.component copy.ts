// import { Component, OnInit, ViewChild } from '@angular/core';
// import { HeaderComponent } from '../admin/menu/components/header/header.component';
// import { DishMode } from '@core/models/types';
// import { DailyDishesComponent } from '../admin/menu/components/daily-dishes/daily-dishes.component';
// import { RegularMenuComponent } from '../admin/menu/components/regular-menu/regular-menu.component';
// import { CommonModule } from '@angular/common';
// import { DisheFormComponent } from '../admin/menu/components/dishe-form/dishe-form.component';
// import { Category, Dish } from '@core/models/dishes.model';
// import { map, Observable } from 'rxjs';
// import { DishesService } from '@core/services/dishes.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   imports: [HeaderComponent, DailyDishesComponent, RegularMenuComponent, DisheFormComponent, CommonModule,],
//   templateUrl: './menu.component.html',
//   styleUrl: './menu.component.css'
// })
// export class MenuComponent implements OnInit {
//   displayMode: DishMode = (() => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const displayMode = localStorage.getItem("displayMode") as DishMode;
//       if (displayMode) {
//         return displayMode;
//       }
//     }
//     return "DAILY";
//   })();
//   isModalOpen: boolean = false;
//   today = new Date();
//   dishes$: Observable<Dish[]>;
//   categories$: Observable<Category[]>;
//   @ViewChild(DisheFormComponent) dishForm!: DisheFormComponent;

//   constructor(
//     private dishService: DishesService,
//     private router: Router
//   ) {
//     this.dishes$ = this.dishService.getDishes();
//     this.categories$ = this.dishService.getCategories();
//   }

//   ngOnInit(): void {
//   }

//   init(): DishMode {
//     const displayMode = localStorage.getItem("displayMode") as DishMode;
//     if (displayMode) {
//       return displayMode;
//     }
//     return "DAILY";
//   }

//   setDisplayMode(value: DishMode) {
//     this.displayMode = value;
//     localStorage.setItem("displayMode", value);
//   }

//   closeModal() {
//     this.dishForm.closeModal();
//   }

//   createDish(dish: Dish) {
//     let result = this.dishService.createDish(dish);
//     if (result) {
//       this.dishForm.closeModal();
      
//     }
//     else {
//       console.log("Une erreur est survenue");
//     }
//   }

//   getDailyDishes(): Dish[] {
//     let dailyDishes: Dish[] = [];
//     this.dishes$.subscribe(dishes => {
//       dailyDishes = dishes.filter(dish => dish.status === 'DAILY');
//     });
//     return dailyDishes;
//   }

//   getRegularDishes(): Dish[] {
//     let regularDishes: Dish[] = [];
//     this.dishes$.subscribe(dishes => {
//       regularDishes = dishes.filter(dish => dish.status === 'REGULAR');
//     });
//     return regularDishes;
//   }

//   getCategorie(): Category[] {
//     let categories: Category[] = [];
//     this.categories$.subscribe(categorys => {
//       categories = categorys;
//     });
//     return categories;
//   }


//   goToDishDetail(id: number): void {
//     this.router.navigate(['/admin/menu', id]);
//   }
// }
