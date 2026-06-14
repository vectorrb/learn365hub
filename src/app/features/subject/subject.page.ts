import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { map, switchMap } from 'rxjs';

import { ResourceDataService } from '../../core/services/resource-data.service';
import { NotesListComponent } from '../notes/notes-list.component';
import { AdSlotComponent } from '../../shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-subject-page',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, RouterLink, NotesListComponent, AdSlotComponent],
  templateUrl: './subject.page.html',
  styleUrl: './subject.page.scss'
})
export class SubjectPage {
  private readonly route = inject(ActivatedRoute);
  private readonly resourceDataService = inject(ResourceDataService);

  readonly subjectId$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? '')
  );

  readonly subject$ = this.subjectId$.pipe(
    switchMap((subjectId) => this.resourceDataService.getSubjectById(subjectId))
  );

  readonly notes$ = this.subjectId$.pipe(
    switchMap((subjectId) => this.resourceDataService.getNotesBySubject(subjectId))
  );
}
