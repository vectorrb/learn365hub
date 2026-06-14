import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Note } from '../../shared/models/note.model';
import { Subject } from '../../shared/models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceDataService {
  private readonly http = inject(HttpClient);

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>('assets/data/subjects.json');
  }

  getSubjectById(subjectId: string): Observable<Subject | undefined> {
    return this.getSubjects().pipe(
      map((subjects) => subjects.find((subject) => subject.id === subjectId))
    );
  }

  getNotesBySubject(subjectId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`assets/data/${subjectId}.json`);
  }
}
