import {Component, OnInit} from '@angular/core';
import {NamesWrapper, NameTokenPair} from '../models/matches.model';
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
      participant: this.fb.array([this.createParticipant()])
    });
  }

  get participants(): FormArray {
    return this.form.get('participant') as FormArray;
  }

  createParticipant(): FormGroup {
    return this.fb.group({
      name: [''],
      exclusions: this.fb.array([this.createExclusion()])
    });
  }

  addParticipant() {
    this.participants.push(this.createParticipant());
  }

  createExclusion(): FormGroup {
    return this.fb.group({
      exclusion: ['']
    });
  }

  getExclusions(idx: number): FormArray {
    return this.participants.at(idx).get('exclusions') as FormArray;
  }

  addExclusio(idx: number) {
    this.getExclusions(idx).push(this.createExclusion());
  }

  // TODO
  parseParticipants() {
    const data: {
      name: string,
      exclusions: string[]
    }[] = this.participants.value.map((participant: any, idx: number) => ({
      name: participant.name,
      exclusions: participant.exclusions.map((i: any) => i.exclusion).filter((v: string) => v.trim() !== '')
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
