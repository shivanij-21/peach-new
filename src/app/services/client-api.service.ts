import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainService } from './main.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {

  public baseUrl!: string;
  private betUrl!: string;

  private scoreApi!: string;
  private liveTvApi!: string;

  isIcasino: boolean = environment.isIcasino;
  ICasinoPad: string = environment.ICasinoPad;


  private _pingResSub = new BehaviorSubject<any>(null);
  pingRes$ = this._pingResSub.asObservable();

  accountInfo: any;

  constructor(private http: HttpClient, private main: MainService, private tokenService: TokenService) {
    main.apis2$.subscribe((res) => {
      // console.log("client api response  ",res);
      
      this.baseUrl = res.devIp;
      this.betUrl = res.devIp;
      // console.log(this.betUrl," betUrl")

      // this.betUrl = res.devIp;
      this.scoreApi = res.scoreApi;
      this.liveTvApi = res.liveTvApi;

      if (this.isIcasino) {
        this.betUrl = this.ICasinoPad;
      }

      this.UserDescription();

    });
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

    // console.log(this.accountInfo)
  }

  balance(activeEventId: any) {
    if (activeEventId) {
      return this.http.get(`${this.betUrl}/ping/loadEvent/${activeEventId}`);
    } else {
      return this.http.post(`${this.betUrl}/ping`, { uid: this.accountInfo?.userName });
    }
  }
  
  // balanceApi() {
  //   return this.http.post(`${this.betUrl}/balance`, { uid: this.accountInfo?.userName, token: this.tokenService.getToken() });
  // }

  getTicker() {
    return this.http.get(`${this.baseUrl}/getTicker`);
  }

  myMarkets() {
    return this.http.get(`${this.baseUrl}/liveBetsByMarket`)
  }

  stakeSetting(stakes: any) {
    return this.http.get(`${this.baseUrl}/stakeSetting/${stakes}`)
  }

  listGames() {
    return this.http.get(`${this.baseUrl}/listGames`);
  }

  loadEvent(eventId: any) {
    return this.http.get(`${this.baseUrl}/loadEvent/${eventId}`);
  }

  listBets() {
    return this.http.post(`${this.betUrl}/listBets`, { uid: this.accountInfo?.userName });
  }

  getBookExposure(marketId: any) {
    return this.http.post(`${this.betUrl}/listBooks/${marketId}`, { uid: this.accountInfo?.userName, marketId: marketId })
  }

  getFancyExposure(eventId: any) {
    return this.http.post(`${this.betUrl}/fancyExposure/${eventId}`, { uid: this.accountInfo?.userName });
  }

  placeBet(betData: any) {
    return this.http.post(`${this.betUrl}/placeBets`, betData);

  }
  placeTpBet(data: any) {
    return this.http.post(`${this.betUrl}/TPplaceBets`, data
    );
  }
  placeBetsPremium(betData: any) {
    return this.http.post(`${this.betUrl}/placeBetsPremium`, betData);
  }
  requestResult(reqId: any) {
    return this.http.get(`${this.betUrl}/requestResult/${reqId}`);
  }

  getBookMakerBook(marketId: any) {
    return this.http.post(`${this.betUrl}/listBooks/${marketId}`, { uid: this.accountInfo?.userName });
  }

  getFancyBook(marketId: any, fancyId: any, fname: any) {
    return this.http.post(`${this.betUrl}/listBooks/df_${marketId}_${fancyId}_${fname}`, { uid: this.accountInfo?.userName });
  }

  get_ticker() {
    return this.http.get(`${this.scoreApi}/api/get_ticker`);
  }

  listCasinoTables() {
    return this.http.get(`${this.baseUrl}/listCasinoTable`);
  }

  listCasinoProduct() {
    return this.http.get(`${this.baseUrl}/listCasinoProduct`);
  }

  profile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }
  getliveTvApi(eventId: any) {
    return this.http.get(`${this.liveTvApi}/api/get_live_tv_url/${eventId}`);
  }
  getAuthCasinoAWC(data: any) {
    // return this.http.post(`http://185.225.233.199:33334/api/auth`, data);
    return this.http.post(`https://awc.globlethings.com/api/auth`, data);

  }
  getAdminBankAccounts(uid: any) {
    return this.http.get(`https://social.cricbuzzer.io:15552/api/GetAdminbankaccounts/?uid=${uid}`);
  }

  GetAdminUpilist(uid: any) {
    return this.http.get(`https://social.cricbuzzer.io:15552/api/GetAdminUpi/?uid=${uid}`);
  }

  getBankAccountsList(uid: any) {
    return this.http.get(`https://social.cricbuzzer.io:15552/api/Getbankaccountslist/?uid=${uid}`);
  }

  Getupilist(uid: any) {
    return this.http.get(`https://social.cricbuzzer.io:15552/api/Getupilist/?uid=${uid}`);
  }

  doTransactionrequest(data: any) {
    return this.http.post(`https://social.cricbuzzer.io:15552/api/doTransactionrequest`, data);
  }

  QuitCasino(userName: string, userId) {
    // return this.http.post(`http://185.225.233.199:33333/api/quit`, { userName, userId });
    return this.http.post(`https://etg.globlethings.com/api/quit`, { userName, userId });

  }
}
