import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  navigate(path:any,queryParams?:any){
    if(queryParams){
      this.router.navigate([path],{skipLocationChange:true, queryParams: queryParams})
    }else{
      this.router.navigate([path],{skipLocationChange:true})
    }
    
  }
}
