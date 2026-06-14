import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ad-slot',
  templateUrl: './ad-slot.component.html',
  styleUrl: './ad-slot.component.scss'
})
export class AdSlotComponent implements OnInit {
  @Input() adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
  @Input() adSlot = '1234567890';
  @Input() adFormat = 'auto';
  @Input() fullWidthResponsive = 'true';

  ngOnInit(): void {
    ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({});
  }
}
