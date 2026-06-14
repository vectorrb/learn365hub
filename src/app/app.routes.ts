import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'Learn365Hub | Home'
  },
  {
    path: 'subject/:id',
    loadComponent: () => import('./features/subject/subject.page').then((m) => m.SubjectPage),
    title: 'Learn365Hub | Subject Notes'
  },
  {
    path: 'download',
    loadComponent: () => import('./features/download/download.page').then((m) => m.DownloadPage),
    title: 'Learn365Hub | Download'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
