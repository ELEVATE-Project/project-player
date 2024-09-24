import { LowerCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-icon-list',
  templateUrl: './icon-list.component.html',
  styleUrl: './icon-list.component.css',
})
export class IconListComponent {
  @Input() items:any;
  @Input() submittedImprovement: any;
  @Output() newItemEvent = new EventEmitter<string>();
  constructor() {}
  actionsEmit(item:any){
    this.newItemEvent.emit(item);
  }
}
