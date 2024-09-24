import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  navigate(path:any,queryParams:any, options?:any){
    if(options){
      this.router.navigate([path],{queryParams: queryParams, ...options})
    }else{
      this.router.navigate([path],{ queryParams: queryParams })
    }
    
  }
}
