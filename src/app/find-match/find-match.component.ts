import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatchesService} from '../matches.service';

@Component({
  selector: 'app-find-match',
  imports: [
    NgIf
  ],
  templateUrl: './find-match.component.html',
  styleUrls: ['./find-match.component.scss']
})
export class FindMatchComponent implements OnInit, OnDestroy {

  @ViewChild('snowflakesContainer') snowflakesContainer!: ElementRef<HTMLDivElement>;

  from = "";
  target = "";
  loading = false;
  error = "";
  consumed = false;

  private token = "";
  private snowflakeTimer?: ReturnType<typeof setInterval>;

  constructor(private route: ActivatedRoute, private matchesService: MatchesService) {
  }

  ngOnInit(): void {
    this.startCreateSnowflakes();

    this.from = this.route.snapshot.paramMap.get('from') || "";
    this.token = this.route.snapshot.paramMap.get('token') || "";
  }

  ngOnDestroy(): void {
    if (this.snowflakeTimer) {
      clearInterval(this.snowflakeTimer);
    }
  }

  get canReveal(): boolean {
    return !!this.token && !this.target && !this.loading && !this.consumed;
  }

  revealMatch(): void {
    if (!this.canReveal) {
      return;
    }

    this.loading = true;
    this.error = "";
    this.matchesService.revealTarget(this.token).subscribe({
      next: target => {
        this.target = target;
        this.loading = false;
      },
      error: err => {
        if (err?.status === 400) {
          this.consumed = true;
          this.error = "Link was already accessed, it cannot be viewed again!";
        } else {
          this.error = "Could not reveal your match. Please try again.";
        }
        this.loading = false;
      }
    });
  }

  startCreateSnowflakes() {
    this.snowflakeTimer = setInterval(() => this.createSnowflake(), 100)
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
