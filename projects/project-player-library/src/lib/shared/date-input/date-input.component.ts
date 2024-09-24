import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'lib-date-input',
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css'
})
export class DateInputComponent {
  currentYear:any= new Date().getFullYear();
  minDate:any= new Date(this.currentYear-2,0,1);
  maxDate:any= new Date(this.currentYear+5,11,31);
  @Input() label?: any
  @Input() selectedDate: any
  @ViewChild('dateInput') dateInput !: ElementRef;
  @Output() dateEvent = new EventEmitter<any>();

  constructor(){}

  showCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this.dateInput.nativeElement.focus());
  }

  onDateChange($event:any){
    if(!$event.value){
      $event.target.value = null
    }
    let date = $event.value ? this.formatDateToLocal($event.value) : null
    this.selectedDate = date
    this.dateEvent.emit(date)
  }

  formatDateToLocal(date: Date): string {
    let offset = date.getTimezoneOffset() * 60000;
    let localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, -1);
    return localISOTime;
  }
}
