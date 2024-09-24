import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskCardComponent } from '../edit-task-card/edit-task-card.component';
import { actions } from '../../constants/actionConstants';
import { DbService } from '../../services/db/db.service';
import { ToastService } from '../../services/toast/toast.service';
import { UtilsService } from '../../services/utils/utils.service';
interface TaskOption {
  value: any;
  label: string;
}
@Component({
  selector: 'lib-subtask-card',
  templateUrl: './subtask-card.component.html',
  styleUrl: './subtask-card.component.css'
})
export class SubtaskCardComponent {
@Input() subTask: any;
@Input() projectDetails: any
@Output() deleteSubTaskEvent = new EventEmitter<string>();
@Output()  updateSubTaskStatusEvent = new EventEmitter<any>();
subTaskOptions:TaskOption[] = [];
@Input() task:any

ngOnInit(): void {
  this.setOptionList();
}
constructor(private dialog:MatDialog, private utils: UtilsService,private db: DbService,private toasterService:ToastService){}

async openDialog() {
  let popupDetails= {
    title: "DELETE_SUB_TASK",
    actionButtons: [
      { label: "NO", action: false},
      { label: "YES", action: true }
    ]
  }
  let response = await this.utils.showDialogPopup(popupDetails)

  if(response){
    this.deleteSubTask(this.subTask);
  }
}
deleteSubTask(item:any){
this.deleteSubTaskEvent.emit(item);
}
editSubTask(){
  if(this.subTask.isDeletable){
    this.openEditSubTaskName(this.subTask.name,"EDIT_SUBTASK");
  }
}
openEditSubTaskName(
  subTaskName:string,
  editType:string
): void {
  const modelref = this.dialog.open(EditTaskCardComponent, {
    width: '400px'
  });
  modelref.componentInstance.title = subTaskName;
  modelref.componentInstance.editType=editType;
  modelref.componentInstance.editName.subscribe((res)=>{
    this.subTask.name = res;
  })
  modelref.afterClosed().subscribe((res: boolean) => {
    if (res) {
      this.updateDataInDb();
    }
  });
}
updateSubTaskStatus(data:any){
  this.updateSubTaskStatusEvent.emit(data);
}
setOptionList(){
  let options:any = actions.TASK_STATUS;
  this.subTaskOptions = options;
}
onDateChange(newDate: any) {
  this.subTask.endDate = newDate;
  this.updateDataInDb();
}

updateDataInDb(){
  this.projectDetails.isEdit = true
  this.subTask.isEdit = true
  this.task.isEdit = true
  let finalData = {
    key:this.projectDetails._id,
    data:this.projectDetails
  }
  this.db.updateData(finalData);
  this.toasterService.showToast("FILES_CHANGES_UPDATED","success")
}
}
