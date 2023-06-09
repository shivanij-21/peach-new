import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MainService } from './main.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasinoApiService {
  private siteName = environment.siteName;
  private baseUrl: any;
  private casinoUrl: any;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public search = new BehaviorSubject<string>("");

  constructor(private http: HttpClient, private mainservice: MainService) {
    this.mainservice.apis2$.subscribe((res) => {
      this.baseUrl = res.devIp;
      this.casinoUrl = res.casApi;
    });
  }

  casinoRate(gtype: any) {
    let url = `${this.casinoUrl}/api/d_rate/${gtype}`;
    return this.http.get(url)
  }

  lastResult(gtype: string) {
    let url = `${this.casinoUrl}/api/l_result/${gtype}`;
    return this.http.get(url)

  }

  roundResult(gtype: string, roundId: number) {
    let url = `${this.casinoUrl}/api/r_result/${gtype}/${roundId}`;
    return this.http.get(url)

  }

  loadTable(casinoType: any) {
    return this.http.get(`${this.baseUrl}/loadTable/${casinoType}`);
  }

  placeTpBet(data: any) {
    return this.http.post(`${this.baseUrl}/TPplaceBets`, data
    );
  }

  listBooks(tableName: string, roundId: any, selectionId: any) {
    let url = `${this.baseUrl}/listBooks/${tableName}/${roundId}/${selectionId}`;
    return this.http.get(url)
  }
  supernowaAuth(params:any) {
    if(this.siteName == 'cricbuzzer'){
      return this.http.post(`https://sn.vrnl.net/pad=111/api/auth`, params);
    }else{
      return this.http.post(`https://sn.vrnl.net/pad=111/api/auth`, params);
    }
  }
  supernowaGameAssetsList(providerCode:string) {
    if(this.siteName == 'cricbuzzer'){
      return this.http.get(`https://sn.vrnl.net/pad=111/api/games/${providerCode}`);
    }else{
      return this.http.get(`https://sn.vrnl.net/pad=111/api/games/${providerCode}`);
    }
  }
  listProviders() {
    return this.http.get(`${this.baseUrl}/listProviders`);
  }
  slotlist(){
    return this.http.get(`https://slots.vrnl.net/pad=201/api/games`);
  }
  openGames(params: any){
    return this.http.post(`https://slots.vrnl.net/pad=201/api/openGame`, params);

  }

  pokerAuth(params: { userName: any; userId: any; }){
    return this.http.post(`https://poker.vrnl.net/pad=300/api/auth`, params);
  }

  pokerQuit(params: { userName: any; userId: any; }){
    return this.http.post(`https://poker.vrnl.net/pad=300/api/quit`, params);
  }

  awclist(){
    return this.http.get(`${this.baseUrl}/listAWCCasinoPlatforms`);
  }
  
  awcAuth(params){
    return this.http.post(`https://awc.vrnl.net/pad=500/api/auth`, params);
  }

}
