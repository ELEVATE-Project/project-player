import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDetailsPageComponent } from './preview-details-page.component';

describe('PreviewDetailsPageComponent', () => {
  let component: PreviewDetailsPageComponent;
  let fixture: ComponentFixture<PreviewDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewDetailsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
