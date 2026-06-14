import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE_CONFIG } from './site.config';

interface SeoPageConfig {
  title: string;
  description: string;
  path: string;
  robots?: string;
  type?: 'website' | 'article';
  imagePath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  updatePage(config: SeoPageConfig): void {
    const absoluteUrl = this.buildAbsoluteUrl(config.path);
    const absoluteImageUrl = this.buildAbsoluteUrl(config.imagePath ?? SITE_CONFIG.defaultOgImagePath);
    const robots = config.robots ?? 'index, follow';
    const type = config.type ?? 'website';

    this.title.setTitle(config.title);
    this.updateTag('name', 'description', config.description);
    this.updateTag('name', 'robots', robots);
    this.updateTag('property', 'og:title', config.title);
    this.updateTag('property', 'og:description', config.description);
    this.updateTag('property', 'og:type', type);
    this.updateTag('property', 'og:url', absoluteUrl);
    this.updateTag('property', 'og:site_name', SITE_CONFIG.siteName);
    this.updateTag('property', 'og:image', absoluteImageUrl);
    this.updateTag('name', 'twitter:card', 'summary_large_image');
    this.updateTag('name', 'twitter:title', config.title);
    this.updateTag('name', 'twitter:description', config.description);
    this.updateTag('name', 'twitter:image', absoluteImageUrl);
    this.setCanonicalUrl(absoluteUrl);
  }

  private updateTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
    this.meta.updateTag({ [attributeName]: attributeValue, content });
  }

  private setCanonicalUrl(url: string): void {
    let canonicalLink = this.document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', url);
  }

  private buildAbsoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '/';
    return `${SITE_CONFIG.siteUrl}${normalizedPath}`;
  }
}