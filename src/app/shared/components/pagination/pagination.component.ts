import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalPages: number = 1; // Total de pages
  @Input() currentPage: number = 1; // Page actuelle
  @Input() resultsPerPage: number = 10; // Résultats par page
  @Output() pageChanged = new EventEmitter<number>();

  visiblePages: number[] = []; // Pages à afficher
  maxVisiblePages: number = 5; // Nombre maximum de pages visibles

  ngOnInit(): void {
    this.calculateVisiblePages();
  }

  calculateVisiblePages(): void {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    // Plages autour de la page courante
    const startPage = Math.max(1, current - Math.floor(this.maxVisiblePages / 2));
    const endPage = Math.min(total, startPage + this.maxVisiblePages - 1);

    // Si nécessaire, ajuster les plages pour inclure les limites
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Ajouter "..." si nécessaire
    if (startPage > 1) {
      pages.unshift(-1); // -1 représente "..."
      pages.unshift(1); // Toujours inclure la première page
    }
    if (endPage < total) {
      pages.push(-1); // -1 représente "..."
      pages.push(total); // Toujours inclure la dernière page
    }

    this.visiblePages = pages;
  }

  goToPage(page: number): void {
    if (page === -1 || page === this.currentPage) return; // Ignore les clics sur "..."
    this.currentPage = page;
    this.pageChanged.emit(page);
    this.calculateVisiblePages();
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  updateResultsPerPage(): void {
    // Recalculer le nombre total de pages basé sur le nouveau nombre d'items par page
    const totalItems = this.totalPages * this.resultsPerPage; // Total des items
    this.totalPages = Math.ceil(totalItems / this.resultsPerPage);
  
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  
    // Émettre un événement si nécessaire pour le parent
    this.pageChanged.emit(this.currentPage);
  
    // Recalculer les pages visibles
    this.calculateVisiblePages();
  }
  
}
