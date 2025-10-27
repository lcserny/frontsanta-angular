import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NamesWrapper, NameTokenPair, TargetWrapper} from './models/matches.model';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

const matchesUrl = environment.apiUrl + '/matches';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  generateLinks(namesWrapper: NamesWrapper): Observable<string[]> {
    return this.httpClient.post<NameTokenPair[]>(matchesUrl, namesWrapper).pipe(
      map(pairs => {
        return pairs.map(pair => {
          const urlTree = this.router.createUrlTree(['/find-match', pair.name, pair.token]);
          return this.router.serializeUrl(urlTree);
        });
      })
    );
  }

  findTarget(token: string): Observable<string> {
    return this.httpClient.get<TargetWrapper>(`${matchesUrl}/${token}`).pipe(
      map(wrapper => wrapper.target)
    );
  }
}
