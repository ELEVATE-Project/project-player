import { Component } from '@angular/core';
import { actions } from '../../constants/actionConstants';
import { RoutingService } from '../../services/routing/routing.service';
import { Router, UrlTree } from '@angular/router';
import { DbService } from '../../services/db/db.service';
import { ApiService } from '../../services/api/api.service';
import { apiUrls } from '../../constants/urlConstants';
import { DataService } from '../../services/data/data.service';
import { MatDialog } from '@angular/material/dialog';
import { StartImprovementPopupComponent } from '../../shared/start-improvement-popup/start-improvement-popup.component';
import { UtilsService } from '../../services/utils/utils.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-preview-details-page',
  templateUrl: './preview-details-page.component.html',
  styleUrl: './preview-details-page.component.css'
})
export class PreviewDetailsPageComponent {
  projectDetails:any;
  actionsList = [];
  displayedTasks:any;
  remainingTasks = [];
  startImprovement: boolean = true;
  id:any;
  stateData:any = {}
  constructor(private routerService:RoutingService,private db:DbService,private apiService:ApiService,private dataService: DataService,
    private dialog: MatDialog, private router: Router, private utils: UtilsService, private toastService: ToastService, private translate: TranslateService,
    private location: Location
  ){
    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    this.id = urlTree.queryParams['id']
    this.stateData = urlTree.queryParams
    this.stateData["isATargetedSolution"] = this.stateData.isATargetedSolution ? this.stateData.isATargetedSolution == "true" : null
    if(this.utils.isLoggedIn()){
      if(this.stateData.referenceFrom == "library"){
        this.getTemplateByExternalId()
      }else{
        this.getProjectTemplate()
      }
    }else{
      this.getTemplateByExternalId(true)
    }
  }
  ngOnInit(): void {
  }

  getTemplateByExternalId(isLink?:boolean){
    let config = {
      url: isLink ? `${apiUrls.GET_TEMPLATE_BY_LINK}?link=${this.id}` : `${apiUrls.GET_TEMPLATE_BY_LINK}/${this.stateData.externalId}`
    }
    this.apiService.get(config).subscribe({
      next: (response:any) => {
        this.projectDetails = response.result;
        this.setActionsList();
        this.initializeTasks()
      },
      error: (error:any) => {
        setTimeout(() => {
          this.location.back()
        }, 1000);
      }
    })
  }

  getProjectTemplate(){
    let config = this.dataService.getConfig()
    let profileInfo = config.profileInfo
    const configForSolutionId = {
      url: `${apiUrls.GET_TEMPLATE_DETAILS}${this.id}`,
      payload: profileInfo
    }
    this.apiService.post(configForSolutionId).subscribe((res)=>{
      this.projectDetails = res.result;
      this.setActionsList();
      this.initializeTasks()
    })
}
  setActionsList(){
    let optionList:any = actions.ACTION_LIST;
    this.actionsList = optionList;
  }
  taskCardAction(event:any){
  }
  navigate(){
    this.showStartImprovementPopup()
  }
  onLearningResources(){
  }
  onStartObservation(){
  }
  initializeTasks(): void {
    if (this.projectDetails.tasks && this.projectDetails.tasks.length > 0) {
      this.displayedTasks = this.projectDetails.tasks.slice(0, 4);
      this.remainingTasks = this.projectDetails.tasks.slice(4);
    }
  }

  loadMoreTasks(): void {
    if (this.remainingTasks.length > 0) {
      this.displayedTasks.push(...this.remainingTasks);
      this.remainingTasks = [];
    }
  }

  getProjectDetails(extraPayload?:any){
    let config = this.dataService.getConfig()
    let profileInfo = config.profileInfo
    let payload = { ...profileInfo, type: "improvementProject" }
    if(extraPayload){
      payload = { ...payload, ...extraPayload }
    }
    const configForProjectId = {
      url: extraPayload ? `${apiUrls.GET_PROJECT_DETAILS}?solutionId=${this.id}` : `${apiUrls.GET_PROJECT_DETAILS}?solutionId=${this.id}&templateId=${this.projectDetails.externalId}`,
      payload: payload
    }
      this.apiService.post(configForProjectId).subscribe((res)=>{
        if(res.result){
          if(this.stateData?.referenceFrom == "link"){
            let tab = this.stateData?.isATargetedSolution ? "ASSIGNED_TO_ME_TAB" : "DISCOVERED_BY_ME_TAB"
            this.translate.get(["PROJECT_AVAILABLE_UNDER_TAB_MSG",tab]).subscribe(data => {
              this.toastService.showToast(`${data["PROJECT_AVAILABLE_UNDER_TAB_MSG"]} ${data[tab]}`,"success")
            })
          }
          res.result.hasAcceptedTAndC = this.projectDetails.hasAcceptedTAndC
          let data = {
            key: res.result._id,
            data: res.result
          }
          this.db.addData(data)
          this.routerService.navigate("/project-details",{ type: "details", id: res.result._id, projectId: res.result._id },{ replaceUrl: true })
        }
      })
  }

  startImprovementProgram(data:Event){
    if(data){
      this.navigate();
    }
  }

  showStartImprovementPopup() {
    const dialogRef = this.dialog.open(StartImprovementPopupComponent, {
      width: '400px',
      minHeight: '150px',
    });

    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        this.startProject()
      }
    })
  }

  async start() {
    const isLinkReference = this.stateData?.referenceFrom === "link" && !this.stateData?.isATargetedSolution;
    const isLibraryReference = this.stateData?.referenceFrom === "library";
  
    if (isLinkReference || isLibraryReference) {
      const response = await this.utils.showPopupWithCheckbox("projectShare");
      if(!response) return
      this.projectDetails.hasAcceptedTAndC = response.buttonAction
      if (isLinkReference) {
        const payload = { referenceFrom: "link", link: this.stateData.link };
        this.getProjectDetails(payload);
      } else if (isLibraryReference) {
        this.importFromLibrary();
      }
    } else {
      this.getProjectDetails();
    }
  }

 async startProject(){
    if(!this.utils.isLoggedIn()){
      this.toastService.showToast("USER_NOT_LOGGEDIN_MSG","danger")
      setTimeout(() => {
        history.replaceState(null, '', '/');
        window.location.href = '/'
      }, 1000);
      return
    }
    if(this.projectDetails.certificateTemplateId){
      let dialogData= {
        content :"CERTIFICATE_NAME_CONFIRMATION_MSG",
        actionButtons: [
          { label: "CONFIRM", action: true },
          { label: "EDIT", action: false }
        ]
      }
      let response = await this.utils.showDialogPopup(dialogData)
      if(response === true){
        this.start();
      }
      else if(response === false){
        window.location.href = "/profile-edit"
      }
    }
    else {
      this.start();
    }
  }

  importFromLibrary(){
    const config = {
      url: `${apiUrls.IMPORT_LIBRARY}${this.projectDetails._id}`,
      payload: { hasAcceptedTAndC: this.projectDetails.hasAcceptedTAndC || false, referenceFrom: "fromLibrary" }
    }
    this.apiService.post(config).subscribe((res)=>{
      if(res.result){
        res.result.hasAcceptedTAndC = this.projectDetails.hasAcceptedTAndC
        let data = {
          key: res.result._id,
          data: res.result
        }
        this.db.addData(data)
        this.routerService.navigate("/project-details",{ type: "details", id: res.result._id, projectId: res.result._id },{ replaceUrl: true })
      }
    })
  }
}
