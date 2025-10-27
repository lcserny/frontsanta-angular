import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatchesService} from '../matches.service';

@Component({
  selector: 'app-find-match',
  imports: [
    NgIf
  ],
  templateUrl: './find-match.component.html'
})
export class FindMatchComponent implements OnInit {

  @ViewChild('snowflakesContainer') snowflakesContainer!: ElementRef<HTMLDivElement>;

  from: string = "";
  target: string = "";

  constructor(private route: ActivatedRoute, private matchesService: MatchesService) {
  }

  ngOnInit(): void {
    this.startCreateSnowflakes();

    this.from = this.route.snapshot.paramMap.get('from') || "";
    const tokenParam = this.route.snapshot.paramMap.get('token');

    if (tokenParam) {
      this.matchesService.findTarget(tokenParam).subscribe(target => {
        this.target = target;
      })
    }
  }

  startCreateSnowflakes() {
    setInterval(() => this.createSnowflake(), 100)
  }

  private createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
    snowflake.style.fontSize = Math.random() * 50 + 10 + 'px';

    this.snowflakesContainer?.nativeElement.appendChild(snowflake);

    setTimeout(() => {
      snowflake.remove();
    }, parseFloat(snowflake.style.animationDuration) * 1000);
  }
}
