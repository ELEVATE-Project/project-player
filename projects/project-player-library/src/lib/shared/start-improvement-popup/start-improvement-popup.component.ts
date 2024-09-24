import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-start-improvement-popup',
  templateUrl: './start-improvement-popup.component.html',
  styleUrl: './start-improvement-popup.component.css',
})
export class StartImprovementPopupComponent {
  constructor(
    public popupRef: MatDialogRef<StartImprovementPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closePopup(data: any) {
    return this.popupRef.close(data);
  }
}
