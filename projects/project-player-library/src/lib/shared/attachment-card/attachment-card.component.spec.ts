import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentCardComponent } from './attachment-card.component';

describe('AttachmentCardComponent', () => {
  let component: AttachmentCardComponent;
  let fixture: ComponentFixture<AttachmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
