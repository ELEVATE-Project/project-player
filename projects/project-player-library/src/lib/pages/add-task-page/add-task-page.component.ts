import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RoutingService } from '../../services/routing/routing.service';
import { AttachmentService } from '../../services/attachment/attachment.service';
import { actions } from '../../constants/actionConstants';
import { DbService } from '../../services/db/db.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast/toast.service';
import { UtilsService } from '../../services/utils/utils.service'
import { Router, UrlTree } from '@angular/router';
import { BackNavigationHandlerComponent } from '../../shared/back-navigation-handler/back-navigation-handler.component';
import { Location } from '@angular/common';
import { statusType } from '../../constants/statusConstants';

@Component({
  selector: 'lib-add-task-page',
  templateUrl: './add-task-page.component.html',
  styleUrls: ['./add-task-page.component.css']
})
export class AddTaskPageComponent extends BackNavigationHandlerComponent implements OnInit {
  @ViewChild('file') file! : ElementRef
  uploadOptions = JSON.parse(JSON.stringify(actions.FILE_UPLOAD_OPTIONS))
  allowedFileTypes:any=actions.FILE_UPLOAD_OPTIONS.flatMap(data=>data.accept.split(","))
  attachmentsList:any = []
  acceptType = ''
  taskData:any
  projectDetails:any
  taskOptions = actions.TASK_STATUS
  taskTitle = ''
  taskStatus = 'notStarted'
  endDate = ''
  
  constructor(private routingService: RoutingService, private attachmentService: AttachmentService, private db: DbService,
    private dialog: MatDialog, private toastService: ToastService, private utils: UtilsService, private router: Router, private location: Location) {
      super(routingService)
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      this.getProjectDetails(urlTree.queryParams['projectId'])
    }

  ngOnInit(){
    this.taskData = this.utils.getMetaData()
    this.uploadOptions.pop()
  }

  getProjectDetails(id:any){
    this.db.getData(id).then(data=>{
      this.projectDetails = data.data
    })
  }

  goBack(){
    this.location.back()
  }

  async uploadFile(accept:any){
    this.acceptType = accept
    let response = await this.utils.showPopupWithCheckbox("evidence")
    if(response){
      if(response.isChecked && response.buttonAction){
        this.file.nativeElement.value = ''
        this.file.nativeElement.click()
      }else{
        this.toastService.showToast('ACCEPT_POLICY_ERROR_MSG',"danger")
      }
    }
  }

  async onChange($event:any){
    let selectedFile = $event.target.files[0]
    if(!this.allowedFileTypes.includes(selectedFile.type)){
      this.toastService.showToast("INVALID_FILE_TYPE",'danger')
      return
    }
    if(this.attachmentService.isFileSizeGreater(selectedFile)){
      return
    }
    this.toastService.showToast('ATTACHED_SUCCESSFULLY',"success")
    let fileName = this.attachmentService.generateFileName(selectedFile)
    let data = {
      name : fileName,
      type : selectedFile.type,
      isUploaded : false,
      url : '',
      selectedFile : selectedFile
    }
    this.attachmentsList.push(data)
  }

  removeAttachment(data:any){
    this.attachmentsList.splice(data.index,1)
  }


  addTask(){
    this.taskData.name = this.taskTitle
    this.taskData.endDate = this.endDate
    this.taskData.status = this.taskStatus
    this.taskData.attachments = this.attachmentsList
    this.projectDetails.isEdit = true
    this.projectDetails.status = this.projectDetails.status ? this.projectDetails.status : statusType.notStarted;
    this.projectDetails.status = this.projectDetails.status == statusType.notStarted ? statusType.inProgress : this.projectDetails.status;
    this.projectDetails.tasks.push(this.taskData)
    this.attachmentsList.map(async(attachment:any)=>{
      let convertedFile = await this.attachmentService.convertTobase64(attachment.selectedFile)
      let data = {
        key : attachment.name,
        data : convertedFile
      }
      this.db.addData(data)
    })

    let finalData = {
      key: this.projectDetails._id,
      data:this.projectDetails
    }
    this.db.updateData(finalData)
    this.goBack()
    this.toastService.showToast("NEW_TASK_ADDED_SUCCESSFULLY_MSG","success")
  }

  onDateChange($event:any){
    this.endDate = $event
  }
}