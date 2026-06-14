import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

import { ResourceDataService } from '../../core/services/resource-data.service';
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
  readonly subjects$ = this.resourceDataService.getSubjects();
}
