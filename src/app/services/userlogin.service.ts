import { TokenService } from 'src/app/services/token.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { MainService } from './main.service';


@Injectable({
  providedIn: 'root'
})
export class UserloginService {
  baseUrl: string | undefined;
  accountInfo: any;
  beturl: any;

  constructor
    (
      private http: HttpClient,
      private router: Router,
      private httpClient: HttpClient,
      private main: MainService,
      private token: TokenService
    ) {
    this.main.apis2$.subscribe((res) => {
      // console.log(res,"base")
      this.baseUrl = res.ip
      this.beturl = res.devIp
    })
  }


  UserDescription() {
    this.accountInfo = this.token.getUserInfo();
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  changePassword(data: any) {
    return this.http.post(`${this.baseUrl}/updateUser`, data);
  }

  logout() {
    return this.http.get(`${this.baseUrl}/logout`);
  }

  news() {
    return this.http.get(`https://access.streamingtv.fun:3460/api/get_ticker`);
  }

}




