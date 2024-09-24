import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilesPageComponent } from './add-files-page.component';

describe('AddFilesPageComponent', () => {
  let component: AddFilesPageComponent;
  let fixture: ComponentFixture<AddFilesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFilesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFilesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
