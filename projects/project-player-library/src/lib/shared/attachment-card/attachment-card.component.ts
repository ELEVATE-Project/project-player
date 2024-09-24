import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-attachment-card',
  templateUrl: './attachment-card.component.html',
  styleUrl: './attachment-card.component.css'
})
export class AttachmentCardComponent {
@Input() details:any;
@Input() attachmentsType:any;
@Output() onRemove = new EventEmitter<any>();
@Input() projectDataStatus:any;
getAttachmentRemove(event:any){
  this.onRemove.emit(event);
}
}
