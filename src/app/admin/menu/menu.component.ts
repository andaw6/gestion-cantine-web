
import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { DishMode } from '@core/models/types';
import { DailyDishesComponent } from './components/daily-dishes/daily-dishes.component';
import { RegularMenuComponent } from './components/regular-menu/regular-menu.component';
import { CommonModule } from '@angular/common';
import { DisheFormComponent } from './components/dishe-form/dishe-form.component';
import { Category, Dish } from '@core/models/dishes.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { DishesService } from '@core/services/dishes.service';
import { Router } from '@angular/router';
import { LoadDataComponent } from '@shared/components/load-data/load-data.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    HeaderComponent,
    DailyDishesComponent,
    RegularMenuComponent,
    DisheFormComponent,
    LoadDataComponent,
    CommonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  displayMode: DishMode = (() => {
    if (typeof window !== 'undefined') {
      const displayMode = localStorage.getItem("displayMode") as DishMode;
      if (displayMode) {
        return displayMode;
      }
    }
    return "DAILY";
  })();
  isModalOpen: boolean = false;
  today = new Date();
  dishes$ = new BehaviorSubject<Dish[]>([]);
  categories$ = new BehaviorSubject<Category[]>([]);
  loading: boolean = true;
  @ViewChild(DisheFormComponent) dishForm!: DisheFormComponent;

  constructor(
    private dishService: DishesService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadDishes();
    this.loadCategories();
  }

  private loadDishes(): void {
    this.loading = true;
    this.dishService.getPlats().subscribe({
      next: (data) => {
        this.dishes$.next(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dishes:', error);
        this.loading = false;
      }
    });
  }

  private loadCategories(): void {
    this.dishService.getCategory().subscribe({
      next: (data) => this.categories$.next(data),
      error: (error) => console.error('Error fetching categories:', error),
    });
  }

  private deleteDish(id: number): void {
    this.dishService.deleteDish(id).subscribe({
      next: () => {
        const updatedDishes = this.dishes$.getValue().filter(dish => dish.id !== id);
        this.dishes$.next(updatedDishes); // Mise à jour des plats après suppression
        console.log('Dish deleted successfully');
      },
      error: (error) => console.error('Error deleting dish:', error),
    });
  }

  openConfirmationDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer ce plat ?', title: 'Supprimer un plat' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDish(id);
      }
    });
  }

  setDisplayMode(value: DishMode) {
    this.displayMode = value;
    localStorage.setItem("displayMode", value);
  }

  closeModal = () => this.dishForm.closeModal();

  
  upsertDish(dish: Dish): void {
    this.dishForm.startLoader();
    this.dishService.createOrUpdateDish(dish).subscribe({
      next: (savedDish) => {
        const currentDishes = this.dishes$.getValue();
        if (dish.id !== 0) {
          const updatedDishes = currentDishes.map(d => 
            d.id === savedDish.id ? dish : d
          );
          this.dishes$.next(updatedDishes);
        } else {
          const updatedDishes = [savedDish, ...currentDishes];
          this.dishes$.next(updatedDishes);
        }
        this.dishForm.stopLoader(true, 1000);
        this.dishForm.closeModal();
      },
      error: (error) => {
        console.error('Error saving dish:', error);
        this.dishForm.stopLoader(false, 2000);
        this.dishForm.closeModal();
      }
    });
  }
  
  

  getFilteredDishes(status?: DishMode): Dish[] {
    status ??= this.displayMode;
    return this.dishes$.getValue().filter(dish => dish.status === status);
  }

  getCategories(): Category[] {
    return this.categories$.getValue();
  }

  showDetailDish(id: number): void {
    this.router.navigate(['/admin/menu', id]);
  }
}
