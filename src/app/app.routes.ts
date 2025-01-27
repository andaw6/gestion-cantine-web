import { Routes } from '@angular/router';
import { MenuComponent } from '@admin/menu/menu.component';
import { LayoutComponent as AdminLayoutComponent } from '@admin/layout/layout.component';
import { DishDetailsComponent } from '@admin/menu/components/dish-details/dish-details.component';
import { ErrorComponent } from '@error/error/error.component';
import { CommandesComponent } from '@admin/commandes/commandes.component';

export const routes: Routes = [

    // Les routes pour la partie admin
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: 'menu', component: MenuComponent },
            { path: 'menu/:id', component: DishDetailsComponent },
            { path: 'commandes', component: CommandesComponent },
            { path: '**', redirectTo: 'menu' },
        ]
    },
    // Les routes pour afficher les pages d'erreurs
    {
        path: 'error',
        children: [
            { path: '', component: ErrorComponent },
            { path: '**', redirectTo: '' },
        ]
    },

    // Pour tous les autres routes on le redirige vers la page d'accueil
    { path: '**', redirectTo: 'admin' },
];
