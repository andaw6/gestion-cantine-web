import { Dish } from "./dishes.model";
import { OrderStatus } from "./types";


interface DishWithQuantity {
    dish: Dish;
    quantity: number;
}

interface OrderDish {
    id: number;
    quantity: number;
}

export interface Order {
    id: number;
    clientId: number;
    date: Date;
    status: OrderStatus;
    amount: number;
    dishes: DishWithQuantity[] | OrderDish[];
}