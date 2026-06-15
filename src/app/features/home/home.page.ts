import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

import { ResourceDataService } from '../../core/services/resource-data.service';
import { SeoService } from '../../core/seo/seo.service';
import { SubjectCardComponent } from '../../shared/components/subject-card/subject-card.component';
import { AdSlotComponent } from '../../shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, MatIconModule, SubjectCardComponent, AdSlotComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  private readonly resourceDataService = inject(ResourceDataService);
  private readonly seoService = inject(SeoService);
  readonly subjects$ = this.resourceDataService.getSubjects();
  readonly currentQuote$ = this.resourceDataService.getQuotes().pipe(
    map((quotes) => {
      if (quotes.length === 0) {
        return undefined;
      }

      const quoteIndex = this.getDailyQuoteIndex(quotes.length);
      return quotes[quoteIndex];
    })
  );

  constructor() {
    this.seoService.updatePage({
      title: 'Learn365Hub | Class 11 and 12 Notes for Physics and Chemistry',
      description: 'Explore curated Physics and Chemistry notes for Class 11 and Class 12 learners, organized subject-wise for faster revision.',
      path: ''
    });
  }

  private getDailyQuoteIndex(totalQuotes: number): number {
    const now = new Date();
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayNumber = Math.floor(localMidnight.getTime() / 86400000);

    return dayNumber % totalQuotes;
  }
}
