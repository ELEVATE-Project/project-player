import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-files-card',
  templateUrl: './files-card.component.html',
  styleUrls: ['./files-card.component.css']
})
export class FilesCardComponent implements OnInit {
  @Input() filesList:any
  @Output() deleteFile = new EventEmitter<any>()

  constructor() { }

  ngOnInit() {
  }

  removeFile(file:any,index:any){
    let data = { file: file, index: index }
    this.deleteFile.emit(data)
  }

}