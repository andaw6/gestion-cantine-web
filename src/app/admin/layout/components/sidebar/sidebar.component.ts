import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { UserInfo } from '@core/models/user-info.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() appName!: string;
  @Input() appLogo!: string;
  @Input() user!: UserInfo;

  isSidebarOpen = false;

  navItems = [
    { name: "Menu", icon: "restaurant_menu", active: true, link: "/admin" },
    { name: 'Tableau de Bord', icon: 'dashboard', active: false, link: "/admin/dashboard" },
    { name: 'Commandes', icon: 'shopping_cart', active: false, link: "/admin/commandes" },
    { name: 'Employers', icon: 'people', active: false, link: "/admin/users" },
    { name: 'Rapports', icon: 'assessment', active: false, link: "/admin/rapport" },
    { name: 'Paramètre', icon: 'settings', active: false, link: "/admin/setting" },
  ];


  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveLink(event.urlAfterRedirects);
      }
    });
  }

  setActive(item: any) {
    console.log("item click", item);

    this.navItems.forEach(navItem => navItem.active = false);
    item.active = true;
  }

  private updateActiveLink(url: string) {
    this.navItems.forEach(navItem => {
      navItem.active = url.includes(navItem.link);
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
