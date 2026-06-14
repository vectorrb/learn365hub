import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'googleDrivePdf',
})
export class GoogleDrivePdfPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) return url;
    // Strip known trailing path segments (edit, view, preview, pub, export) and any query string
    const base = url.replace(/\/(edit|view|preview|pub|export)(\?.*)?$/, '').replace(/\?.*$/, '').replace(/\/$/, '');
    return `${base}/export?format=pdf`;
  }
}
