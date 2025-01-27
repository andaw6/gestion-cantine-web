import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserInfo } from '@core/models/user-info.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  appLogo: string = "assets/images/logo.jpg";
  appName: string = 'Kaayleek';
  entrepriseName: string = "Orange Sonatel"
  currentYear = new Date().getFullYear();
  userName: string = "Elage Ciss"
  isSidebarOpen = false;
  userLogo?: string;

  

  user: UserInfo = {
    name: "Elage Ciss",
    email: "elage.ciss@orange.sn",
    avatar: 'assets/images/profil-admin.jpeg'
  };


  navItems = [
    { name: "Menu", icon: "restaurant_menu", active: true, link: "/admin/menu" },
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
