import { Component, HostListener } from '@angular/core';
import { RoutingService } from '../../services/routing/routing.service';
import { Location } from '@angular/common';

@Component({
  template: '',
})
export class BackNavigationHandlerComponent {

  constructor(private routingServ: RoutingService, private loc?: Location){}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handlePopState(event);
  }

  protected handlePopState(event: any) {
    let urlQueryParams = this.getQueryParams(event.target.location.search)
    if(urlQueryParams){
      this.routingServ.navigate(event.target.location.pathname, urlQueryParams)
    }else{
      this.loc?.back()
    }
  }

  getQueryParams(queryParams:any){
    const queryObj: any = {}

    if(!queryParams){
      return null
    }
    if (queryParams.startsWith('?')) {
      queryParams = queryParams.substring(1);
    }

    const queryArray = queryParams.split('&');

    queryArray.forEach((query:any) => {
        const [key, value] = query.split('=');
        queryObj[key] = value 
    });
    return queryObj;
  }

}
