import { NgModule } from '@angular/core';

import { PdfViewerComponent } from './pdf-viewer.component';

@NgModule({
  imports: [PdfViewerComponent],
  exports: [PdfViewerComponent]
})
export class PdfViewerModule {}