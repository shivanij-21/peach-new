import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RacingApiService {

  private baseUrl: string;
  private raceUrl: string;

  constructor(private httpClient: HttpClient, private main: MainService) {
    this.main.apis2$.subscribe((res) => {
      // console.log(res);
      
      this.baseUrl = res.ip;
      this.raceUrl = res.sslRacingApi;
    })
   }

   listHorseRaces() {
    return this.httpClient.get(`${this.baseUrl}/listHorseRaces`);
  }

  // listGreyhoundRaces() {
  //   return this.httpClient.get(`${this.raceUrl}/listMeetings/today/4339`);
  // }

  listMeetings(eventTypeId:any) {
    return this.httpClient.get(`${this.raceUrl}/listMeetings/today/${eventTypeId}`);
  }
  listMeetings2() {
    return this.httpClient.get(`${this.raceUrl}/listMeetings/today/7`);
  }

  getEventsDetails(id: any){
    return this.httpClient.get(`https://access.streamingtv.fun:3440/api/getEventsDetails/${id}`);   
  }

  getLatestResults(id: any){
    return this.httpClient.get(`https://access.streamingtv.fun:3440/api/getLatestResults/${id}`);    
  }

  marketDescription(marketId: string) {
    return this.httpClient.get(`${this.raceUrl}/marketDescription/${marketId}`);
  }
}
