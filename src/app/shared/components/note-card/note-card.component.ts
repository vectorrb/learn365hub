import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Note, NoteResourceType } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent {
  readonly resourceButtons: { key: NoteResourceType; label: string; icon: string; className: string }[] = [
    { key: 'handwrittenNotes', label: 'Handwritten Notes', icon: 'edit_note', className: 'resource-handwritten' },
    { key: 'digitalizedNotes', label: 'Digitalized Notes', icon: 'description', className: 'resource-digitalized' },
    { key: 'flowchart', label: 'Flowchart', icon: 'account_tree', className: 'resource-flowchart' }
  ];

  @Input({ required: true }) note!: Note;

  getResourceLink(type: NoteResourceType): string {
    return this.note.resources[type];
  }
}
