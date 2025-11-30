import {Component} from '@angular/core';
import {NamesWrapper, Participant} from '../models/matches.model';
import {NgForOf, NgIf} from '@angular/common';
import {MatchesService} from '../matches.service';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-generate',
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent {

  error: string = "";
  links: string[] = [];
  form: FormGroup;

  constructor(private matchesService: MatchesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      participants: this.fb.array([this.createParticipant()])
    });
  }

  get participants(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  addParticipant() {
    this.participants.push(this.createParticipant());
  }

  createParticipant(): FormGroup {
    return this.fb.group({
      name: "",
      exclusions: ""
    });
  }

  generateLinks() {
    const data: Participant[] = this.participants.value.map((participant: any, idx: number) => ({
      name: participant.name,
      exclusions: participant.exclusions.split(",").map((item: string) => item.trim()).filter((item: string) => item.length > 0)
    }));

    const namesWrapper: NamesWrapper = {
      names: data.reduce((acc, curr) => {
        acc[curr.name] = curr.exclusions;
        return acc;
      }, {} as Record<string, string[]>),
    };

    this.matchesService.generateLinks(namesWrapper).subscribe({
      next: links => {
        this.links = links;
        this.error = "";
      },
      error: err => {
        this.error = err.message || JSON.stringify(err);
      }
    });
  }
}
