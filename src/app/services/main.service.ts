import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  // private siteName = environment.siteName;
  private apisUrl = environment.apisUrl;
  apis$ = new ReplaySubject<any>();
  apis2$ = new ReplaySubject<any>();
  private apis: any;

  constructor(private http: HttpClient, private authService: TokenService) {
    this.apis2$.subscribe((res: any) => {
      this.apis = res
      let hostname = window.origin;
      res.ip = res.sslclient;
      if (location.protocol === 'https:') {
        res.racingApi = res.sslRacingApi;
        res.racingSocketApi = res.sslracingSocketApi;
        res.sportApi = res.sslSportApi;
        res.sportSocketApi = res.sslsportSocketApi;
        res.allSportApi = res.sslAllSportApi;
        res.allSportSocketApi = res.sslAllSportSocketApi?.replace('http', 'ws');
        if (hostname.indexOf('cricbuzzer') > -1 || hostname.indexOf('winplus247') > -1 || hostname.indexOf('dreamcric') > -1 || hostname.indexOf('localhost') > -1) {
          res.ip = res.devIp;
        } else {
          res.ip = res.sslclient;
        }
        // console.log(res.allSportSocketApi, "res.allSportSocketApi");


      }
      this.apis = res;
    })
  }

  getApis() {
    return this.http.get(`${this.apisUrl}`);
  }

}
