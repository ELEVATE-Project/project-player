import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskCardComponent } from './subtask-card.component';

describe('SubtaskCardComponent', () => {
  let component: SubtaskCardComponent;
  let fixture: ComponentFixture<SubtaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtaskCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubtaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
