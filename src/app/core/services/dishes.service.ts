import { Injectable } from '@angular/core';
import { Category, Dish } from '@core/models/dishes.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { IParams } from '@core/models/interfaces/http-options.interface';
import internal from 'stream';

@Injectable({
  providedIn: 'root'
})
export class DishesService extends ApiService {


  getPlats(params?: IParams): Observable<Dish[]> {
    return this.get<Dish[]>("/dish", params).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        console.log('Données utilisateur non valides');
        return [];
      }),
      catchError((error) => {
        console.error("Erreur de récupération des plats test", error);
        return of([]);
      })
    );
  }

  getDishById(id: number): Observable<Dish | null> {
    return this.get<Dish | null>(`/dish/${id}`).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return null;
      }),
      catchError((error) => {
        console.error("Erreur de récupération du plat", error);
        return of(null);
      })
    );
  }

  getCategory(params?: IParams): Observable<Category[]> {
    return this.get<Category[]>("/dish/category", params).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        console.log('Données utilisateur non valides');
        return [];
      }),
      catchError((error) => {
        console.error("Erreur de récupération des plats", error);
        // return throwError(() => error);
        return of([]);
      })
    );
  }

  updateDish(dish: Dish): Observable<Dish> {
    return this.put<Dish>(`/dish/${dish.id}`, dish).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return dish;
      }),
      catchError((error) => {
        console.error("Erreur de récupération du plat", error);
        return of(dish);
      })
    );
  }

  addDish(dish: Dish): Observable<Dish> {
    return this.post<Dish>('/dish', dish).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return dish;
      }),
      catchError((error) => {
        console.error("Erreur de récupération du plat", error);
        return of(dish);
      })
    );
  }

  deleteDish(id: number): Observable<Dish | null> {
    return this.delete<Dish | null>(`/dish/${id}`).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return null;
      }),
      catchError((error) => {
        console.error("Erreur de récupération du plat", error);
        return of(null);
      })
    );

  }

  createOrUpdateDish = (dish: Dish): Observable<Dish> => dish.id === 0 ? this.addDish(dish) : this.updateDish(dish);
}
