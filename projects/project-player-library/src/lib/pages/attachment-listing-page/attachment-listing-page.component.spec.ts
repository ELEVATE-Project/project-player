import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentListingPageComponent } from './attachment-listing-page.component';

describe('AttachmentListingPageComponent', () => {
  let component: AttachmentListingPageComponent;
  let fixture: ComponentFixture<AttachmentListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentListingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
