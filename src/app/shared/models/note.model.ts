export type NoteResourceType = 'handwrittenNotes' | 'digitalizedNotes' | 'flowchart';

export interface NoteResourceLinks {
  handwrittenNotes: string;
  digitalizedNotes: string;
  flowchart: string;
}

export interface Note {
  id: number;
  title: string;
  description: string;
  tags: string[];
  resources: NoteResourceLinks;
}
