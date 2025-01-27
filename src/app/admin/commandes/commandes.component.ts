import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { OrderMode, OrderStatus } from '@core/models/types';
import { NavigationComponent } from './components/navigation/navigation.component';
import { StatGridComponent } from './components/stat-grid/stat-grid.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderService } from '@core/services/order.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    HeaderComponent,
    NavigationComponent,
    StatGridComponent,
    PaginationComponent,
    OrderListComponent
  ],
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.css'
})
export class CommandesComponent implements OnInit {

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders({ details: true }).subscribe({
      next: (orders) => {
        console.log("tous les commandes avec leurs détails");
        console.log(orders);
      },
      error: console.error
    });
  }

  displayMode: OrderMode = (() => {
    if (typeof window !== 'undefined') {
      const displayMode = localStorage.getItem("orderMode") as OrderMode;
      if (displayMode) {
        return displayMode;
      }
    }
    return "DAILY";
  })();

  orderStatus: OrderStatus = 'ALL';

  setDisplayMode(value: OrderMode) {
    this.displayMode = value;
    localStorage.setItem("orderMode", value);
  }

  setOrderStatus(value: OrderStatus) {
    this.orderStatus = value;
  }
}
