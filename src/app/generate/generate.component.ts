import {Component, OnInit} from '@angular/core';
import {NamesWrapper, NameTokenPair} from '../models/matches.model';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {MatchesService} from '../matches.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-generate',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './generate.component.html'
})
export class GenerateComponent implements OnInit {

  namesInput: string = '';
  links: string[] = [];

  constructor(private matchesService: MatchesService, private router: Router) {
  }

  ngOnInit(): void {
  }

  processJson() {
    try {
      /*
      {
        "names": {
          "leo": ["sabi", "casi"],
          "sabi": ["leo", "casi"],
          "casi": ["sabi", "leo"],
          "alis": ["matei", "ana"],
          "matei": ["alis", "ana"],
          "ana": ["matei", "alis"]
        }
      }
       */
      const namesWrapper: NamesWrapper = JSON.parse(this.namesInput);
      this.matchesService.generateLinks(namesWrapper).subscribe(links => {
        this.links = links;
      })
    } catch (error) {
      console.log(error);
    }
  }

  clear() {
    this.namesInput = '';
    this.links = [];
  }
}
