import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'lib-add-link-popup',
  templateUrl: './add-link-popup.component.html',
  styleUrls: ['./add-link-popup.component.css']
})
export class AddLinkPopupComponent implements OnInit {
  link:any
  initialDialogHeight!: number;

  constructor(public popupRef: MatDialogRef<AddLinkPopupComponent>, @Inject(MAT_DIALOG_DATA)public data: any,
  private toastService: ToastService) {}

  ngOnInit(){
    this.initialDialogHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const currentHeight = window.innerHeight;

    if (currentHeight < this.initialDialogHeight * 0.7) {
      this.adjustDialogPosition(true, currentHeight);
    } else {
      this.adjustDialogPosition(false, currentHeight);
    }
  }

  adjustDialogPosition(isKeyboardOpen: boolean, currentHeight: number) {
    if (isKeyboardOpen) {
      const topPosition = `${Math.min(0.05 * currentHeight, 30)}px`;
      this.popupRef.updatePosition({ top: topPosition });
    } else {
      this.popupRef.updatePosition({ top: '50%'});
    }
  }

  addLink(data:any){
    this.popupRef.close(data)
  }

  onChange($event:any){
    let data = $event.target.value
    if(this.validateLink(data)){
      $event.target.value = data.slice(0,-1)
    }
  }

  pasteLink($event:any){
    let data = $event.clipboardData.getData('Text') 
    if(this.validateLink(data)){
      $event.preventDefault()
    }
  }

  validateLink(value:any){
    let invalidCharacters = /^[^!@~#$%^*(){}><,\n; ]+$/
    if(invalidCharacters.test(value)){
     return false
    }else{
      if(value){
        this.toastService.showToast("INVALID_LINK_MSG","danger")
      }
      return true
    }
  }
}