import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { UserRole } from '../models/enums/user-role';

interface DecodedToken {
  role: UserRole | null;
  userId: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private readonly tokenKey = 'token';

  constructor(private authService: AuthService, private router: Router) { }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();

    // Vérifie d'abord si le token est présent et valide côté client
    if (token && !this.isTokenExpired(token)) {
      // Si le token est valide côté client, on fait un appel au backend pour vérifier sa validité côté serveur
      return this.authService.token().pipe(
        map((response: ApiResponse<string>) => {
          if (response && response.data) {
            this.setToken(response.data);
            console.log("User is Authentificated");

            return true;
          }
          console.log("User is not Authentificated");

          // Si le serveur ne valide pas le token, on déconnecte l'utilisateur
          this.logout();
          return false;
        }),
        catchError(() => {
          // En cas d'erreur lors de l'appel au serveur, on déconnecte l'utilisateur
          this.logout();
          return of(false);
        })
      );
    } else {
      // Si le token est absent ou expiré côté client, on déconnecte immédiatement
      this.logout();
      return of(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = payload.exp * 1000;
      return Date.now() > expirationDate;
    } catch (e) {
      return true; // Considère le token comme expiré en cas d'erreur
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.login();
  }

  login() {
    this.router.navigate(['/login']);
  }

  decodeToken(): DecodedToken {
    const token = this.getToken();
    if (!token) return { role: null, userId: null };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || null;
      const userId = payload.userId || null;
      return { role, userId };
    } catch (e) {
      return { role: null, userId: null }; // Retourne null en cas d'erreur de décodage
    }
  }

  decodeTokenTest(): DecodedToken {
    const token = this.getToken();
    console.log(token);
    
    if (!token) return { role: null, userId: null };

    try {
      const payload = JSON.parse(atob(token));
      console.log(payload);
      
      const role = payload.role || null;
      const userId = payload.userId || null;
      return { role, userId };
    } catch (e) {
      console.log(e);
      
      return { role: null, userId: null }; // Retourne null en cas d'erreur de décodage
    }
  }

  // decodeTokenTest() : any {
  //   const token = this.getToken();
  //   if (token) {
  //     try {
  //       const decoded = jwt_decode<any>(token);
  //       console.log(decoded); // Affiche les informations décodées
  //       return decoded;
  //     } catch (error) {
  //       console.error('Erreur lors du décodage du token', error);
  //     }
  //   }
  //   return null;
  // }
}
