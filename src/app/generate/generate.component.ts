import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NamesWrapper, NameTokenPair} from '../models/matches.model';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-generate',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './generate.component.html',
  styleUrl: './generate.component.scss'
})
export class GenerateComponent implements OnInit {

  links: string[] = [];

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    const namesWrapper: NamesWrapper = {
      names: {
        "casu": [],
        "sabina": [],
        "leo": ["sabina"],
      }
    }

    this.httpClient.post<NameTokenPair[]>('http://localhost:7070/matches', namesWrapper).subscribe(pairs => {
      this.links = pairs.map(pair => {
        const urlTree = this.router.createUrlTree(['/find-match', pair.name, pair.token]);
        return this.router.serializeUrl(urlTree);
      });
    })
  }
}
