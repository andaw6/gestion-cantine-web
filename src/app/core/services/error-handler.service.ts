import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { Route } from '@angular/router';

@Injectable({
    providedIn: 'root'  // Cette ligne permet de fournir le service globalement dans l'application.
  })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorService: ErrorService) {}

  handleError(error: any): void {
    // Enregistrez l'erreur dans le service d'erreur
    this.errorService.setError(error.message || 'Une erreur inconnue est survenue.');
    // Redirigez vers la page d'erreur
    this.errorService.goPage('');
    // Vous pouvez utiliser le Router pour naviguer vers la page d'erreur
  }
}   