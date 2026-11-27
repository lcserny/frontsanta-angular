import {AfterViewChecked, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
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
export class GenerateComponent implements AfterViewChecked {

  @ViewChildren('nameInput') nameInputs!: QueryList<ElementRef<HTMLInputElement>>;

  error: string = "";
  links: string[] = [];
  form: FormGroup;

  private pendingFocusIndex: number | null = null;

  constructor(private matchesService: MatchesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      participants: this.fb.array([this.createParticipant()])
    });
  }

  get participants(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  ngAfterViewChecked(): void {
    if (this.pendingFocusIndex !== null && this.nameInputs.length > this.pendingFocusIndex) {
      this.nameInputs.get(this.pendingFocusIndex)?.nativeElement.focus();
      this.pendingFocusIndex = null;
    }
  }

  addParticipant() {
    this.pendingFocusIndex = this.participants.length;
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
        if (this.isNonEmptyString(curr.name)) {
          acc[curr.name] = curr.exclusions;
        }
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

  isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }
}
