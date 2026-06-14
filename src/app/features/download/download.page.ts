import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AdSlotComponent } from '../../shared/components/ad-slot/ad-slot.component';
import { GoogleDrivePdfPipe } from '../../shared/pipes/google-drive-pdf.pipe';

@Component({
  selector: 'app-download-page',
  imports: [MatButtonModule, MatIconModule, AdSlotComponent],
  templateUrl: './download.page.html',
  styleUrl: './download.page.scss'
})
export class DownloadPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly pipe = new GoogleDrivePdfPipe();
  private countdownIntervalId?: number;
  private readonly countdownDuration = 15;
  readonly ringRadius = 42;
  readonly ringCircumference = 2 * Math.PI * this.ringRadius;

  @ViewChild('countdownBox', { static: true }) countdownBoxRef?: ElementRef<HTMLDivElement>;
  @ViewChild('downloadReady', { static: true }) downloadReadyRef?: ElementRef<HTMLDivElement>;
  @ViewChild('countdownNumber', { static: true }) countdownNumberRef?: ElementRef<HTMLSpanElement>;
  @ViewChild('countdownStrong', { static: true }) countdownStrongRef?: ElementRef<HTMLElement>;
  @ViewChild('timerProgress', { static: true }) timerProgressRef?: ElementRef<SVGCircleElement>;

  title = '';
  description = '';
  rawUrl = '';
  pdfUrl = '';

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.title = params.get('title') ?? '';
    this.description = params.get('desc') ?? '';
    this.rawUrl = params.get('url') ?? '';
    this.pdfUrl = this.pipe.transform(this.rawUrl);

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
    if (!this.countdownBoxRef || !this.downloadReadyRef) {
      return;
    }

    this.countdownBoxRef.nativeElement.hidden = true;
    this.downloadReadyRef.nativeElement.hidden = false;
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
}
