import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartImprovementPopupComponent } from './start-improvement-popup.component';

describe('StartImprovementPopupComponent', () => {
  let component: StartImprovementPopupComponent;
  let fixture: ComponentFixture<StartImprovementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartImprovementPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartImprovementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
