import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-edit-task-card',
  templateUrl: './edit-task-card.component.html',
  styleUrl: './edit-task-card.component.css'
})
export class EditTaskCardComponent {
  title:string='';
  editType:string='';
  @Output() editName:EventEmitter<string>= new EventEmitter<string>();
  constructor(
    public dialogRef: MatDialogRef<EditTaskCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  inputFormControl = new FormControl('');
  updateName(data:boolean){
    if(data){
      this.editName.emit(this.title);
      this.dialogRef.close(true);
    }
    else{
      this.dialogRef.close(false);
    }
  }
}
