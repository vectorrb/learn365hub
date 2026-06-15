import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { Note } from '../../shared/models/note.model';
import { Quote } from '../../shared/models/quote.model';
import { Subject } from '../../shared/models/subject.model';
import chemistry11Notes from '../../../assets/data/chemistry-11.json';
import chemistry12Notes from '../../../assets/data/chemistry-12.json';
import physics11Notes from '../../../assets/data/physics-11.json';
import physics12Notes from '../../../assets/data/physics-12.json';
import quotesData from '../../../assets/data/quotes.json';
import subjectsData from '../../../assets/data/subjects.json';

export interface HeaderNavChapter {
  id: number;
  title: string;
  subjectId: string;
  queryParams: {
    title: string;
    desc: string;
    type: string;
    url: string;
  };
}

export interface HeaderNavSubject {
  key: string;
  title: string;
  subjectId: string;
  chapters: HeaderNavChapter[];
}

export interface HeaderNavClass {
  classNumber: number;
  title: string;
  subjects: HeaderNavSubject[];
}

@Injectable({
  providedIn: 'root'
})
export class ResourceDataService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly subjectsData = subjectsData as Subject[];
  private readonly quotesData = quotesData as Quote[];
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

  getQuotes(): Observable<Quote[]> {
    if (isPlatformServer(this.platformId)) {
      return of(this.quotesData);
    }

    return this.http.get<Quote[]>('assets/data/quotes.json');
  }

  getHeaderNavigation(): Observable<HeaderNavClass[]> {
    return this.getSubjects().pipe(
      switchMap((subjects) => {
        if (subjects.length === 0) {
          return of([]);
        }

        const noteRequests = subjects.map((subject) =>
          this.getNotesBySubject(subject.id).pipe(
            map((notes) => ({ subjectId: subject.id, notes })),
            catchError(() => of({ subjectId: subject.id, notes: [] as Note[] }))
          )
        );

        return forkJoin(noteRequests).pipe(
          map((subjectNotes) => this.buildHeaderNavigation(subjectNotes))
        );
      })
    );
  }

  private buildHeaderNavigation(subjectNotes: { subjectId: string; notes: Note[] }[]): HeaderNavClass[] {
    const navByClass = new Map<number, Map<string, HeaderNavSubject>>();

    for (const item of subjectNotes) {
      if (item.notes.length === 0) {
        continue;
      }

      const parsed = this.parseSubjectId(item.subjectId);
      if (!parsed) {
        continue;
      }

      const chapters = item.notes.map((note) => {
        const preferredResource = this.getPreferredResource(note);

        return {
          id: note.id,
          title: note.title,
          subjectId: item.subjectId,
          queryParams: {
            title: note.title,
            desc: note.description,
            type: preferredResource.type,
            url: preferredResource.url
          }
        } satisfies HeaderNavChapter;
      });

      if (chapters.length === 0) {
        continue;
      }

      const classBucket = navByClass.get(parsed.classNumber) ?? new Map<string, HeaderNavSubject>();
      classBucket.set(parsed.subjectKey, {
        key: parsed.subjectKey,
        title: parsed.subjectTitle,
        subjectId: item.subjectId,
        chapters: chapters.sort((a, b) => a.id - b.id)
      });
      navByClass.set(parsed.classNumber, classBucket);
    }

    return Array.from(navByClass.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([classNumber, subjectMap]) => ({
        classNumber,
        title: `Class ${classNumber}`,
        subjects: Array.from(subjectMap.values()).sort((a, b) => a.title.localeCompare(b.title))
      }));
  }

  private parseSubjectId(subjectId: string): { subjectKey: string; subjectTitle: string; classNumber: number } | undefined {
    const match = subjectId.match(/^([a-z-]+)-(\d+)$/i);
    if (!match?.[1] || !match[2]) {
      return undefined;
    }

    const subjectKey = match[1].toLowerCase();
    const classNumber = Number(match[2]);
    if (Number.isNaN(classNumber)) {
      return undefined;
    }

    return {
      subjectKey,
      classNumber,
      subjectTitle: subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)
    };
  }

  private getPreferredResource(note: Note): { type: string; url: string } {
    if (note.resources.handwrittenNotes.trim()) {
      return { type: 'Handwritten Notes', url: note.resources.handwrittenNotes };
    }

    if (note.resources.digitalizedNotes.trim()) {
      return { type: 'Digitalized Notes', url: note.resources.digitalizedNotes };
    }

    if (note.resources.flowchart.trim()) {
      return { type: 'Flowchart', url: note.resources.flowchart };
    }

    return { type: 'Handwritten Notes', url: '' };
  }
}
