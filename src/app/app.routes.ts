import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ResourceDataService } from './core/services/resource-data.service';

const subjectTitleResolver: ResolveFn<string> = async (route) => {
  const resourceDataService = inject(ResourceDataService);
  const subjectId = route.paramMap.get('id') ?? '';
  const subject = await firstValueFrom(resourceDataService.getSubjectById(subjectId));

  return subject ? `${subject.title} | Learn365Hub` : 'Learn365Hub | Subject Notes';
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'Learn365Hub | Class 11 and 12 Notes for Physics and Chemistry'
  },
  {
    path: 'subject/:id',
    loadComponent: () => import('./features/subject/subject.page').then((m) => m.SubjectPage),
    title: subjectTitleResolver
  },
  {
    path: 'view-pdf',
    loadComponent: () => import('./features/download/download.page').then((m) => m.ViewPdfPage),
    title: 'View PDF | Learn365Hub'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
