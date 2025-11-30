import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NamesWrapper, NameTokenPair, TargetWrapper} from './models/matches.model';
import {map, Observable} from 'rxjs';
import {Router} from '@angular/router';

const matchesUrl = '/api/matches';
// const matchesUrl = 'http://localhost:7070/matches';

@Injectable({providedIn: 'root'})
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
