import { Component, inject, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() title = '';

  previewUrl = '';
  safePreviewUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');

  @Input({ required: true })
  set url(value: string) {
    this.previewUrl = this.toPreviewUrl(value);
    this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl || 'about:blank');
  }

  private toPreviewUrl(url: string): string {
    if (!url) {
      return '';
    }

    const normalizedUrl = url.trim();
    const fileMatch = normalizedUrl.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)/i);

    if (fileMatch?.[1]) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }

    if (/^https?:\/\//i.test(normalizedUrl)) {
      return normalizedUrl
        .replace(/\/(edit|view|preview|pub|export)(\/)?(\?.*)?$/i, '/preview')
        .replace(/\?.*$/i, '');
    }

    return normalizedUrl;
  }
}