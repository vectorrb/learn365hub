import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLink } from '@angular/router';

import { GoogleAdsService } from './core/services/google-ads.service';
import { HeaderNavClass, ResourceDataService } from './core/services/resource-data.service';
import { AdSlotComponent } from './shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, RouterOutlet, RouterLink, AdSlotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly googleAdsService = inject(GoogleAdsService);
  private readonly resourceDataService = inject(ResourceDataService);
  readonly navClasses = toSignal(this.resourceDataService.getHeaderNavigation(), { initialValue: [] });
  isMobileNavOpen = false;

  constructor() {
    this.googleAdsService.initialize('ca-pub-XXXXXXXXXXXXXXXX');
  }

  trackClass = (_: number, item: HeaderNavClass): number => item.classNumber;

  toggleMobileNav(event: MouseEvent): void {
    event.stopPropagation();
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeNavMenusOnOutsideClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    const host = this.hostElement.nativeElement;
    const nav = host.querySelector('.top-nav');
    const navToggle = host.querySelector('.nav-toggle');
    if (!nav || nav.contains(target) || navToggle?.contains(target)) {
      return;
    }

    const openMenus = host.querySelectorAll('.top-nav details[open]') as NodeListOf<HTMLDetailsElement>;
    openMenus.forEach((menu: HTMLDetailsElement) => menu.removeAttribute('open'));
    this.closeMobileNav();
  }
}
