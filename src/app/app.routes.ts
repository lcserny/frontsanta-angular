import { Routes } from '@angular/router';
import {GenerateComponent} from './generate/generate.component';
import {FindMatchComponent} from './find-match/find-match.component';

export const routes: Routes = [
  {path: "generate", component: GenerateComponent},
  {path: "find-match/:from/:token", component: FindMatchComponent},
];
