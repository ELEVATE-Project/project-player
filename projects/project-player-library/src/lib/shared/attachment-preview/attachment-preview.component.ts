import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-attachment-preview',
  templateUrl: './attachment-preview.component.html',
  styleUrls: ['./attachment-preview.component.css']
})
export class AttachmentPreviewComponent {
  constructor(public popupRef: MatDialogRef<AttachmentPreviewComponent>, @Inject(MAT_DIALOG_DATA)public data: any) {
  }

}