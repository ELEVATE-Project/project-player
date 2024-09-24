import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing/routing.service';
import { DbService } from '../../services/db/db.service';
import { Router, UrlTree } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { UtilsService } from '../../services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { BackNavigationHandlerComponent } from '../../shared/back-navigation-handler/back-navigation-handler.component';

@Component({
  selector: 'lib-attachment-listing-page',
  templateUrl: './attachment-listing-page.component.html',
  styleUrl: './attachment-listing-page.component.css'
})
export class AttachmentListingPageComponent extends BackNavigationHandlerComponent {
  projectData:any ;
  isImages:any;
  isVideos:any;
  isFiles:any;
  isLinks:any;
  attachments:any;
  selectedTab = 'image'
  constructor(private routerService:RoutingService,private db:DbService,private toasterService:ToastService,
    private utils: UtilsService, private translate: TranslateService, private router: Router
  ){
    super(routerService)
    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    this.getData(urlTree.queryParams['projectId'])
  }

  getData(id:any){
    this.db.getData(id).then(data=>{
      this.projectData = data.data;
      this.getAttachments(this.projectData);
    })
  }

  hasAttachments(attachmentType: string): { project: boolean, task: boolean } {
    let result = { project: false, task: false };
    if(attachmentType === 'image'){
      if ( this.attachments.project || this.attachments.tasks ) {
        result.project = !!(this.attachments.project.attachments && this.attachments.project.attachments.some((attachment: any) => attachment.type.includes(attachmentType)) || this.attachments.project.remarks);
        result.task = this.attachments.tasks.some((task: any) => task.attachments && task.attachments.some((attachment: any) => attachment.type.includes(attachmentType))) || this.attachments.tasks.some((task:any)=>task.remarks);
      }
      return result;
    }
    else{
      if ( this.attachments.project || (this.attachments.tasks && Array.isArray(this.attachments.tasks) && this.attachments.tasks.length > 0)) {
        result.project = this.attachments.project.attachments && this.attachments.project.attachments.some((attachment: any) => attachment.type.includes(attachmentType));
        result.task = this.attachments.tasks.some((task: any) => task.attachments && task.attachments.some((attachment: any) => attachment.type.includes(attachmentType)));
    }
    return result;
    }
}

  getAttachments(data:any){
    this.attachments = {
      project: {},
      tasks: []
    };
    if(data?.attachments?.length || data?.remarks){
      let projectEvidence = {
        title: data.title,
        remarks: data.remarks ? data.remarks : '',
        attachments: []
      }
      this.getEvendencies(data.attachments,projectEvidence);
      this.attachments.project = projectEvidence;
    }
    if(data?.tasks) {
      data.tasks.forEach((task: { isDeleted: any; name: any; remarks: any; attachments: string | any[]; })=>{
        if(!task.isDeleted){
          let taskEvidence = {
            title: task.name,
            remarks: task.remarks ? task.remarks : '',
            attachments: []
          }
          if(task.attachments && task.attachments.length || task.remarks){
            this.getEvendencies(task.attachments,taskEvidence)
            this.attachments.tasks.push(taskEvidence);
          }
        }
      })
    }
    this.isVideos = this.hasAttachments('video');
    this.isFiles = this.hasAttachments('application');
    this.isLinks = this.hasAttachments('link');
    this.isImages = this.hasAttachments('image');
  }
  getEvendencies(attachments:any,evidence:any){
    attachments.forEach((attachment: any) => {
      evidence.attachments.push(attachment);
    })
  }


  getRemoveAttachment(event:any){
    this.removeAttachment(event);
  }

  async removeAttachment(data:any) {
    let message
    this.translate.get("CONFIRMATION_ATTACHMENT_DELETE").subscribe(data => {
      message = data
    })
    message = `${message}${this.selectedTab}?`
      let popupDetails= {
        title: message,
        actionButtons: [
          { label: "YES", action: true },
          { label: "NO", action: false}
        ]
      }
      let response = await this.utils.showDialogPopup(popupDetails)
      if(response){
        this.deleteAttachment(data.name);
      }
    }
    deleteAttachment(data: any): void {
      if (this.projectData.attachments) {
          this.projectData.attachments.forEach((attachment: any, index: number) => {
              if (attachment.name === data) {
                  this.projectData.attachments.splice(index, 1);
                  return;
              }
          });
      }
      this.projectData.tasks.forEach((task: any) => {
          if (task.attachments) {
              task.attachments.forEach((attachment: any, index: number) => {
                  if (attachment.name === data) {
                      task.attachments.splice(index, 1);
                      task.isEdit = true
                      return;
                  }
              });
          }
      });
      this.projectData.isEdit = true
        let finalData = {
          key: this.projectData._id,
          data: this.projectData
        }
        this.db.updateData(finalData);
        this.db.deleteData(data);
        this.toasterService.showToast("ATTACHMENT_REMOVED_SUCCESS","success")
        this.getData(this.projectData._id);
  }
  isFirstAttachment(attachments: any[], itemIndex: number, attachmentType: string): boolean {
    const firstAttachmentIndex = attachments.findIndex(a => a.type.includes(attachmentType));
    return itemIndex === firstAttachmentIndex;
}

hasRemarks(task: any): boolean {
    return task.remarks && task.remarks.trim() !== '';
}

trackByTaskIndex(index: number, task: any): any {
    return task.id; // Use a unique identifier for the task
}

trackByItemIndex(index: number, item: any): any {
    return item.id; // Use a unique identifier for the item
}
hasImageAttachments(task: any): boolean {
  return task.attachments.some((a: { type: string | string[]; }) => a.type.includes('image'));
}

onTabChange($event:any){
  this.selectedTab = $event.tab.textLabel.toLowerCase().slice(0,-1)
}

}
