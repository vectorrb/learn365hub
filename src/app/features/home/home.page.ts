import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

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

  constructor() {
    this.seoService.updatePage({
      title: 'Learn365Hub | Class 11 and 12 Notes for Physics and Chemistry',
      description: 'Explore curated Physics and Chemistry notes for Class 11 and Class 12 learners, organized subject-wise for faster revision.',
      path: ''
    });
  }
}
