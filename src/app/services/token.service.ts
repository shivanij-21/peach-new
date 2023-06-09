import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'


export const AUTH_TOKEN = 'AuthToken';
export const USER_INFO = 'UserInfo';
export const NEW_USER = 'NewUser';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router:Router,private cookieService:CookieService) { }
 
  setUserInfo(userInfo: any) {
    this.cookieService.set(USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
  }

  getUserInfo() {
    // console.log(this.getLocalUserInfo())
    if (this.getLocalUserInfo()) {
      return this.getLocalUserInfo();
    } else {
      return this.cookieService.get(USER_INFO) ? JSON.parse(this.cookieService.get(USER_INFO)) : null;
    }
  }

  getLocalUserInfo() {
    return localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO) || '{}') :null;
  }

  setToken(token:any) {
    this.cookieService.set(AUTH_TOKEN, token);
    console.log(AUTH_TOKEN);
  }

  getToken() {
    if(this.getlocalToken()){
      return this.getlocalToken()
    }
    return this.cookieService.get(AUTH_TOKEN);
  }
  

  setLocalToken(token:any){
   return localStorage.setItem(AUTH_TOKEN , token)

  }

  getlocalToken(){
    return localStorage.getItem(AUTH_TOKEN)
  }

  getLocalToken() {
    return localStorage.getItem(AUTH_TOKEN);
  }

  setNewUser(newUser:any){
    localStorage.setItem(NEW_USER, newUser);
  }

  getNewUser(){
    return localStorage.getItem(NEW_USER);
  }

  async removeToken() {
    this.cookieService.delete(AUTH_TOKEN);
    this.cookieService.deleteAll();
    var newUser = this.getNewUser();
    localStorage.clear();
    if(newUser!=null){
      this.setNewUser(1);
    }
    window.location.href = window.location.origin + window.location.pathname;
  }
  getMaintanance() {
    return this.cookieService.get('isMaintanance');
  }
}