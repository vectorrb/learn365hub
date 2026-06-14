import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLink } from '@angular/router';

import { GoogleAdsService } from './core/services/google-ads.service';
import { AdSlotComponent } from './shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, RouterOutlet, RouterLink, AdSlotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly googleAdsService = inject(GoogleAdsService);

  constructor() {
    this.googleAdsService.initialize('ca-pub-XXXXXXXXXXXXXXXX');
  }
}
