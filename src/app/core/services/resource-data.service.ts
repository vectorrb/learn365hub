import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { Note } from '../../shared/models/note.model';
import { Subject } from '../../shared/models/subject.model';
import chemistry11Notes from '../../../assets/data/chemistry-11.json';
import chemistry12Notes from '../../../assets/data/chemistry-12.json';
import physics11Notes from '../../../assets/data/physics-11.json';
import physics12Notes from '../../../assets/data/physics-12.json';
import subjectsData from '../../../assets/data/subjects.json';

@Injectable({
  providedIn: 'root'
})
export class ResourceDataService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly subjectsData = subjectsData as Subject[];
  private readonly notesBySubject: Record<string, Note[]> = {
    'chemistry-11': chemistry11Notes as Note[],
    'chemistry-12': chemistry12Notes as Note[],
    'physics-11': physics11Notes as Note[],
    'physics-12': physics12Notes as Note[]
  };

  getSubjects(): Observable<Subject[]> {
    if (isPlatformServer(this.platformId)) {
      return of(this.subjectsData);
    }

    return this.http.get<Subject[]>('assets/data/subjects.json');
  }

  getSubjectById(subjectId: string): Observable<Subject | undefined> {
    return this.getSubjects().pipe(
      map((subjects) => subjects.find((subject) => subject.id === subjectId))
    );
  }

  getNotesBySubject(subjectId: string): Observable<Note[]> {
    if (isPlatformServer(this.platformId)) {
      return of(this.notesBySubject[subjectId] ?? []);
    }

    return this.http.get<Note[]>(`assets/data/${subjectId}.json`);
  }
}
