import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentShowCardComponent } from './attachment-show-card.component';

describe('AttachmentShowCardComponent', () => {
  let component: AttachmentShowCardComponent;
  let fixture: ComponentFixture<AttachmentShowCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentShowCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachmentShowCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
