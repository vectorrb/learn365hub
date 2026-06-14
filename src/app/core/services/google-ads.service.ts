import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAdsService {
  private readonly document = inject(DOCUMENT);

  initialize(clientId: string): void {
    if (!clientId || this.document.getElementById('learn365hub-adsense-script')) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = 'learn365hub-adsense-script';
    script.async = true;
    script.src =
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = 'anonymous';

    this.document.head.appendChild(script);
  }
}
