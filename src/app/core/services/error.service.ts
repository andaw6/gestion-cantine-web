import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorMessage: string | null = null;

  constructor(private router: Router) { } // Changez ici Route en Router

  setError(message: string) {
    this.errorMessage = message;
  }

  getError() {
    return this.errorMessage;
  }

  clearError() {
    this.errorMessage = null;
  }

  goPage(path: string) {
    this.router.navigate(['/error', path]); // Ceci fonctionnera maintenant correctement
  }
}