import { Injectable } from '@angular/core';
export const ACCEPT_OK = 'AcceptOk';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http: any;

  constructor() { }
  public login(userInfo: any) {
    localStorage.setItem('ACCESS_TOKEN', "access_token");
    console.log('ACCESS_TOKEN');
    
  }



  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }

  public logout() {
    localStorage.setItem('ACCESS_TOKEN', "null");
  }


}
