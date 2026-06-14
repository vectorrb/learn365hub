import { Component, Input } from '@angular/core';

import { Note } from '../../shared/models/note.model';
import { NoteCardComponent } from '../../shared/components/note-card/note-card.component';

@Component({
  selector: 'app-notes-list',
  imports: [NoteCardComponent],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss'
})
export class NotesListComponent {
  @Input({ required: true }) notes: Note[] = [];
}
