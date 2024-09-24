import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskCardComponent } from './edit-task-card.component';

describe('EditTaskCardComponent', () => {
  let component: EditTaskCardComponent;
  let fixture: ComponentFixture<EditTaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaskCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
