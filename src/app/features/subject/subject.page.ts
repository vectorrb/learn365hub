import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { ResourceDataService } from '../../core/services/resource-data.service';
import { SeoService } from '../../core/seo/seo.service';
import { NotesListComponent } from '../notes/notes-list.component';
import { AdSlotComponent } from '../../shared/components/ad-slot/ad-slot.component';
import { Subject } from '../../shared/models/subject.model';

@Component({
  selector: 'app-subject-page',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, RouterLink, NotesListComponent, AdSlotComponent],
  templateUrl: './subject.page.html',
  styleUrl: './subject.page.scss'
})
export class SubjectPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly resourceDataService = inject(ResourceDataService);
  private readonly seoService = inject(SeoService);

  readonly subjectId$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? '')
  );

  readonly subject$ = this.subjectId$.pipe(
    switchMap((subjectId) => this.resourceDataService.getSubjectById(subjectId))
  );

  readonly notes$ = this.subjectId$.pipe(
    switchMap((subjectId) => this.resourceDataService.getNotesBySubject(subjectId))
  );

  constructor() {
    this.subject$.pipe(
      filter((subject): subject is Subject => Boolean(subject)),
      distinctUntilChanged((currentSubject, previousSubject) => currentSubject.id === previousSubject.id),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((subject) => {
      this.seoService.updatePage({
        title: `${subject.title} | Learn365Hub`,
        description: subject.description,
        path: `subject/${subject.id}`
      });
    });
  }
}
