import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../app/services/main.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  // SlotBetHistory(fromdate: string, todate: string, BETSTATUS: string) {
  //   throw new Error('Method not implemented.');
  // }

  SlotBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoSlotBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }
  // SlotProfitLoss(fromDate: string, toDate: string) {
  //   return this.http.get(
  //     `${this.baseUrl}/casinoSlotProfitLoss?from=${fromDate}&to=${toDate}`
  //   );
  // }
  SlotProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoSlotProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  baseUrl: any;

  constructor(private http: HttpClient, private mainservice: MainService) {
    mainservice.apis2$.subscribe((res) => {
      this.baseUrl = res.devIp;
    });
  }

  AccountStatement(fromDate: string, toDate: string,filter: string) {
    return this.http.get(
      `${this.baseUrl}/betsReport?from=${fromDate}&to=${toDate}&filter=${filter}`
    );
  }

  logActivity() {
    return this.http.get(`${this.baseUrl}/logActivity`);
  }

  CasinoBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  currentBets() {
    return this.http.get(`${this.baseUrl}/currentBets`);
  }


  CasinoProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  
  BetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/betsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  ProfitLoss(fromDate: string, toDate: string) {

    return this.http.get(
      `${this.baseUrl}/profitLoss?from=${fromDate}&to=${toDate}`
    );
  }

  PokerBetHistory(fromDate: string, toDate: string) {
    return this.http.get(
      `https://222222.digital/pad=82/pokerLog?from=${fromDate}&to=${toDate}`
    );
  }

  SNCasinoBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoSNBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  SNCasinoProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoSNProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }

}
