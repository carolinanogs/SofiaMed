import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  navItems: NavItem[] = [
    { label: 'Hoje', icon: '🏠', route: '/hoje' },
    { label: 'Remédios', icon: '💊', route: '/remedios' },
    { label: 'Histórico', icon: '📋', route: '/historico' },
  ];

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
