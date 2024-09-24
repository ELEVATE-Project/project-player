import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-dailog-page',
  templateUrl: './dailog-popup.component.html',
  styleUrl: './dailog-popup.component.css'
})
export class DailogPopupComponent {


constructor(
  public dialogRef: MatDialogRef<DailogPopupComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {}

closePopup(data:any){
  this.dialogRef.close(data)
}
}
