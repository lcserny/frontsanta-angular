import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs';
import {NgIf} from '@angular/common';
import {TargetWrapper} from '../models/matches.model';

@Component({
  selector: 'app-find-match',
  imports: [
    NgIf
  ],
  templateUrl: './find-match.component.html',
  styleUrl: './find-match.component.scss'
})
export class FindMatchComponent implements OnInit {

  from: string = "";
  target: string = "";

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.from = this.route.snapshot.paramMap.get('from') || "";
    const tokenParam = this.route.snapshot.paramMap.get('token');

    this.httpClient.get<TargetWrapper>(`http://localhost:7070/matches/${tokenParam}`).subscribe(wrapper => {
      this.target = wrapper.target;
    })
  }
}
