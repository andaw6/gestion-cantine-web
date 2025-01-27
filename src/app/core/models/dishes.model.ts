import { DishMode, DishType, VegetarianStatus } from "./types";

export interface Category {  
    id: number;                       
    name: string;                     
    type?: DishType;        
}  


export interface Dish {  
    id  : number;
    name: string;                      
    description: string;                 
    price: number;                       
    category: Category;    
    status: DishMode;              
    ingredients: string[];   
    allergens?: string[];    
    available: boolean;      
    imageUrl?: string;     
    type?: VegetarianStatus;  
    date?: Date; 
}

