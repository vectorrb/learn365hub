import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-subject-card',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, RouterLink],
  templateUrl: './subject-card.component.html',
  styleUrl: './subject-card.component.scss'
})
export class SubjectCardComponent {
  @Input({ required: true }) subject!: Subject;
}
