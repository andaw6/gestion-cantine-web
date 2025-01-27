import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IParams } from '@core/models/interfaces/http-options.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { Order } from '@core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService  extends ApiService {

  getOrders(params?: IParams): Observable<Order[]> {
    // Corriger l'affectation incorrexcte. Utiliser une opération conditionnelle correcte.
    const url = params && params["details"] === true ? "/order/details" : "/order"; 
    return this.get<Order[]>(url, params).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError((error) => {
        console.error("Erreur de récupération des plats test", error);
        return of([]);
      })
    );
  }
  
}
