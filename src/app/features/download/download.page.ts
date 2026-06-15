import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AdSlotComponent } from '../../shared/components/ad-slot/ad-slot.component';
import { PdfViewerModule } from '../../shared/components/pdf-viewer/pdf-viewer.module';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-view-pdf-page',
  standalone: true,
  imports: [MatIconModule, AdSlotComponent, PdfViewerModule],
  templateUrl: './download.page.html',
  styleUrl: './download.page.scss'
})
export class ViewPdfPage implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private countdownIntervalId?: number;
  private readonly countdownDuration = 15;
  readonly ringRadius = 42;
  readonly ringCircumference = 2 * Math.PI * this.ringRadius;

  @ViewChild('countdownBox', { static: true }) countdownBoxRef?: ElementRef<HTMLDivElement>;
  @ViewChild('viewerReady', { static: true }) viewerReadyRef?: ElementRef<HTMLDivElement>;
  @ViewChild('countdownNumber', { static: true }) countdownNumberRef?: ElementRef<HTMLSpanElement>;
  @ViewChild('countdownStrong', { static: true }) countdownStrongRef?: ElementRef<HTMLElement>;
  @ViewChild('timerProgress', { static: true }) timerProgressRef?: ElementRef<SVGCircleElement>;

  title = '';
  description = '';
  resourceType = '';
  rawUrl = '';
  isComingSoon = false;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.title = params.get('title') ?? '';
    this.description = params.get('desc') ?? '';
    this.resourceType = params.get('type') ?? 'Notes';
    const normalizedUrl = (params.get('url') ?? '').trim();
    this.rawUrl = normalizedUrl;
    this.isComingSoon = normalizedUrl.length === 0 || normalizedUrl === 'null' || normalizedUrl === 'undefined';

    this.seoService.updatePage({
      title: this.title ? `${this.title} View PDF | Learn365Hub` : 'View PDF | Learn365Hub',
      description: this.description || 'View educational PDF notes on Learn365Hub.',
      path: 'view-pdf',
      robots: 'noindex, nofollow'
    });

    if (!isPlatformBrowser(this.platformId) || this.isComingSoon) {
      return;
    }

    this.updateCountdownDisplay(this.countdownDuration);

    let remaining = this.countdownDuration;
    this.countdownIntervalId = window.setInterval(() => {
      remaining -= 1;
      this.updateCountdownDisplay(remaining);

      if (remaining === 0) {
        this.clearCountdownInterval();
        this.showDownloadState();
      }
    }, 1000);
  }

  private updateCountdownDisplay(remaining: number): void {
    const safeRemaining = Math.max(remaining, 0);
    const progress = (safeRemaining / this.countdownDuration) * 100;
    const ringOffset = this.ringCircumference * (1 - progress / 100);

    if (this.countdownNumberRef) {
      this.countdownNumberRef.nativeElement.textContent = String(safeRemaining);
    }

    if (this.countdownStrongRef) {
      this.countdownStrongRef.nativeElement.textContent = `${safeRemaining} second${safeRemaining !== 1 ? 's' : ''}`;
    }

    if (this.timerProgressRef) {
      this.timerProgressRef.nativeElement.setAttribute('stroke-dashoffset', String(ringOffset));
    }
  }

  private showDownloadState(): void {
    if (!this.countdownBoxRef || !this.viewerReadyRef) {
      return;
    }

    this.countdownBoxRef.nativeElement.hidden = true;
    this.viewerReadyRef.nativeElement.hidden = false;
  }

  private clearCountdownInterval(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearCountdownInterval();
  }

  @HostListener('document:contextmenu', ['$event'])
  @HostListener('document:copy', ['$event'])
  @HostListener('document:cut', ['$event'])
  @HostListener('document:paste', ['$event'])
  @HostListener('document:dragstart', ['$event'])
  @HostListener('document:selectstart', ['$event'])
  blockInteraction(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const key = event.key.toLowerCase();
    const isModifierPressed = event.ctrlKey || event.metaKey;
    const blockedShortcutKeys = new Set(['c', 'x', 'v', 's', 'p', 'u']);

    if (event.key === 'PrintScreen' || (isModifierPressed && blockedShortcutKeys.has(key)) || (event.shiftKey && key === 'insert')) {
      event.preventDefault();
    }
  }
}
