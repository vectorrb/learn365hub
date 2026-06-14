import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-ad-slot',
  templateUrl: './ad-slot.component.html',
  styleUrl: './ad-slot.component.scss'
})
export class AdSlotComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  @Input() adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
  @Input() adSlot = '1234567890';
  @Input() adFormat = 'auto';
  @Input() fullWidthResponsive = 'true';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({});
  }
}
