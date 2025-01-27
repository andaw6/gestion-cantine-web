import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles']; // Liste des rôles requis

    const { role } = { role: "" };

    // Vérifiez si le rôle est défini
    if (!role) {
      this.router.navigate(['/login']);
      return of(false); // Retourne false si le rôle n'est pas défini
    }

    // Vérifiez si l'utilisateur a l'un des rôles requis
    if (requiredRoles.includes(role)) {
      return of(true); // L'utilisateur a un rôle requis
    }

    // Redirigez l'utilisateur et retournez false
    this.router.navigate(['/login']);
    return of(false);
  }
}
