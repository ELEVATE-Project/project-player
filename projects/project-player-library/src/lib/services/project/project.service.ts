import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { ToastService } from '../toast/toast.service';
import { apiUrls } from '../../constants/urlConstants';
import { statusType } from '../../constants/statusConstants';
import { ApiService } from '../api/api.service';
import { firstValueFrom } from 'rxjs';
import { RoutingService } from '../routing/routing.service';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private utils: UtilsService, private toastService: ToastService, private apiService: ApiService, private routerService: RoutingService,
    private dataService: DataService
  ) { }

async showSyncSharePopup(type:string, name:string, project:any, taskId?:string){
    let popupDetails= {
      title: "SYNC_PROGRESS_BEFORE_SHARE",
      actionButtons: [
        { label: "CANCEL", action: false},
        { label: "SYNC_NOW", action: true }
      ]
    }
    if(project.status === statusType.submitted || !project.isEdit) {
      taskId
        ? this.getPdfUrl(name, project._id, taskId)
        : this.getPdfUrl(name, project._id);
      return;
    }
      let response = await this.utils.showDialogPopup(popupDetails)
      if(response){
          this.routerService.navigate('/project-details',{type: "sync", projectId: project._id, taskId: taskId, isShare: true, fileName: name})
    }else{
      this.toastService.showToast("FILE_NOT_SHARED", "danger");
    }
  }

    getPdfUrl(name:string, projectId:string, taskId?:string,loader?:any){
    let url = taskId ? `${apiUrls.SHARE}/${projectId}?tasks=${taskId}` : `${apiUrls.SHARE}/${projectId}`
    const config = {
      url: url
    }
    let showLoader = loader ? false : true ;
    if(showLoader){
      this.utils.startLoader()
    }
    return firstValueFrom(this.apiService.get(config))
        .then(response => {
      this.utils.stopLoader()
      let shareResponse:any = response.result.downloadUrl || response.result?.data?.downloadUrl
      if(response.result && shareResponse){
          this.sendMessage(shareResponse,name);
      }else{
        this.toastService.showToast("ERROR_IN_DOWNLOADING_MSG","danger")
      }
    }).catch(error=>{
      this.utils.stopLoader()
      this.toastService.showToast("ERROR_IN_DOWNLOADING_MSG","danger")
    })
  }

  sendMessage(data:any,name:any) {
    const message = { type: 'SHARE_LINK', url: data ,name:name};
    window.postMessage(message, '*');
  }

  async startAssessment(projectData:any, taskData:any){
    let profileInfo = this.dataService.getConfig().profileInfo
    let apiConfig = {
      url: `${apiUrls.START_ASSESSMENT}${projectData._id}?taskId=${taskData._id}`,
      payload: profileInfo
    }
    try{
      const response = await firstValueFrom(this.apiService.post(apiConfig))
      const result = response?.result
      if(!result){
        this.toastService.showToast("MSG_FOR_NONTARGETED_USERS_QUESTIONNAIRE","danger")
        return
      }
      if(result.observationId){
        let enableObserveAgain = !(result?.status == statusType.completed)
        let solutionDetails = result?.solutionDetails
        this.routerService.navigate('',{ tab: null },{queryParamsHandling: 'merge', replaceUrl: true})
        let path = `/observations/details/${result?.observationId}/${result?.entityId}/${solutionDetails?.allowMultipleAssessemts}`
        this.routerService.navigateByHref(path)
        return
      }
      let redirectionPath = `/observations/task/${result?.solutionId}`
      this.routerService.navigate('',{ tab: null },{queryParamsHandling: 'merge', replaceUrl: true})
      this.routerService.navigateByHref(redirectionPath)
      return


    }catch (error:any){
      this.toastService.showToast(error.Message ,"danger")
    }
  }

}
