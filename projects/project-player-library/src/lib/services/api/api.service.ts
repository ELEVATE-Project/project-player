import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { NetworkServiceService } from 'network-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token = ''
  private baseUrl = '';
  headers = {
    'Authorization': `Bearer ${this.token}`,
    'x-auth-token': this.token,
    'x-authenticated-user-token': this.token,
    'Content-Type': 'application/json',
    'x-app-ver':''
  }
  private onlineStatus:any;
  constructor(private http: HttpClient,private dataService: DataService,private router: Router,private toastService: ToastService,private network:NetworkServiceService) {
    this.network.isOnline$.subscribe((status)=>{
      this.onlineStatus=status
    })
  }
  private handleOfflineError(): Observable<never> {
    this.toastService.showToast("OFFLINE_MSG",'danger')
    return throwError(() => ({
      status: 0,
      error:{message: 'You are offline'},
    }));
  }

  get(config:any): Observable<any> {
    if (!this.onlineStatus) {
      return this.handleOfflineError();
    }
    this.setHeaders()
    return this.http.get(`${this.baseUrl}/${config.url}`,{headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }

  post(config: any): Observable<any> {
    if (!this.onlineStatus) {
      return this.handleOfflineError();
    }
    this.setHeaders()
    return this.http.post(`${this.baseUrl}/${config.url}`, config.payload, {headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }

  put(config: any): Observable<any> {
    if (!this.onlineStatus) {
      return this.handleOfflineError()
    }
    return this.http.put(`${this.baseUrl}/${config.url}`, config.payload, {headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }

  delete(config:any): Observable<any> {
    if (!this.onlineStatus) {
      return this.handleOfflineError();
    }
    return this.http.delete(`${this.baseUrl}/${config.url}`,{headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError=(error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Unknown error!';
    this.toastService.showToast(error.error.message,"danger")
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        window.location.href = '/'
      }
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(error.error));
  }

  setHeaders(){
    let config = this.dataService.getConfig()
    this.baseUrl = config.baseUrl
    if(!config.accessToken) return
    this.token = config.accessToken
    this.headers = {
      'Authorization': `Bearer ${config.accessToken}`,
      'x-auth-token': config.accessToken,
      'x-authenticated-user-token': config.accessToken,
      'Content-Type': 'application/json',
      'x-app-ver':''
    }
  }
}
