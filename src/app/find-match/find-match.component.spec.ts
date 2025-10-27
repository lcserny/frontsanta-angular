import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMatchComponent } from './find-match.component';

describe('FindMatchComponent', () => {
  let component: FindMatchComponent;
  let fixture: ComponentFixture<FindMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
