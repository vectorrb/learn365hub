import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom } from 'rxjs';

import { ResourceDataService } from './core/services/resource-data.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'subject/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const resourceDataService = inject(ResourceDataService);
      const subjects = await firstValueFrom(resourceDataService.getSubjects());

      return subjects.map((subject) => ({ id: subject.id }));
    }
  },
  {
    path: 'download',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  }
];
