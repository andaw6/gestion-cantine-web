// header.component.ts
import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserInfo } from '@core/models/user-info.model'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class HeaderComponent {
  showProfileMenu: boolean = false;
  showMobileMenu: boolean = false;
  searchQuery: string = '';
  nbMsg:number = 0;
  nbNotif: number = 0;
  @Input() appName!: string;
  @Input() user!: UserInfo;

  toggleProfileMenu = () => this.showProfileMenu = !this.showProfileMenu;

  toggleMobileMenu = () => this.showMobileMenu = !this.showMobileMenu;

  onSearch() {
    // Implémentez la logique de recherche ici
    console.log('Recherche:', this.searchQuery);
  }
}