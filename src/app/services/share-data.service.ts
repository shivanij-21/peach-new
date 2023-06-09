import { EventEmitter, Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


export type ILeftColState = {
  level: number;
  value?: any;
};
export enum LEVELS {
  ALL,
  SPORT,
  TOURNAMENT,
  MATCH,
  MARKET,
}

export const SPORTS_MAP = {
  1: {
    id: 10,
    bfId: 1,
    title: 'Soccer',
  },
  2: {
    id: 20,
    bfId: 2,
    title: 'Tennis',
  },
  4: {
    id: 30,
    bfId: 4,
    title: 'Cricket',
  },
  // 7: {
  //   id: 4,
  //   bfId: 7,
  //   title: "Horse Racing Today's Card",
  //   day: 1
  // },
  // 4339: {
  //   id: 5,
  //   bfId: 4339.1,
  //   title: "Greyhound Racing Today's Card",
  // },
  7: {
    id: 6,
    bfId: 7,
    title: 'Horse Racing',
    1: {
      id: 6,
      bfId: 7,
      title: "Horse Racing Today's Card",
    }
  },
  4339: {
    id: 7,
    bfId: 4339,
    title: 'Greyhound Racing',
    1: {
      id: 7,
      bfId: 4339,
      title: "Greyhound Racing Today's Card",
    }
  },
};

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {


  private _sportData = new BehaviorSubject<any>(null);
  sportData$ = this._sportData.asObservable();

  private _listGamesData = new BehaviorSubject<any>(null);
  listGamesData$ = this._listGamesData.asObservable();

  private _casinoList = new BehaviorSubject<any>(null);
  casinoList$ = this._casinoList.asObservable();

  private _oddsDataSub = new BehaviorSubject<any>(null);
  oddsData$ = this._oddsDataSub.asObservable();

  private _updateFundExpoSub = new BehaviorSubject<any>(null);
  updateFundExpo$ = this._updateFundExpoSub.asObservable();

  private _listBetsSub = new BehaviorSubject<any>(null);
  listBets$ = this._listBetsSub.asObservable();


  private _stakeButton = new BehaviorSubject<any>(null);
  stakeButton$ = this._stakeButton.asObservable();

  private _betSlipData = new BehaviorSubject<any>(null);
  betSlipData$ = this._betSlipData.asObservable();

  private _betExpoData = new BehaviorSubject<any>(null);
  betExpoData$ = this._betExpoData.asObservable();

  private _callTpExpo = new BehaviorSubject<any>(null);
  callTpExpo$ = this._callTpExpo.asObservable();

  private _leftColStateSub = new ReplaySubject<ILeftColState>(1);
  leftColState$ = this._leftColStateSub.asObservable();

  private _casinotabledata = new BehaviorSubject<string>('');

  showLiveTv = new EventEmitter<boolean>();
  activeMatch = new EventEmitter<any>();
  activeEventType = new EventEmitter<any>();

  public callMenu =new Subject<any>();


  constructor() { }

sendMessage(data:any){
  this.callMenu.next(data);
  // console.log("from shared",data);

}

  shareSportData(data: any) {
    this._sportData.next(data);
  }

  shareListGamesData(data: any) {
    this._listGamesData.next(data);
  }
  shareCasinoList(data: any) {
    this._casinoList.next(data);
  }

  shareOddsData(data: any) {
    this._oddsDataSub.next(data);
  }

  shareStakeButton(data: any) {
    this._stakeButton.next(data);
  }

  shareUpdateFundExpo(data: any) {
    this._updateFundExpoSub.next(data);
  }
  shareListBets(data: any) {
    this._listBetsSub.next(data);
  }

  shareBetSlipData(data: any) {
    this._betSlipData.next(data);
  }
  shareBetExpoData(data: any) {
    this._betExpoData.next(data);
  }
  shareCallTpExpoData(data: any) {
    this._callTpExpo.next(data);
  }
  setLeftColState(state: ILeftColState) {
    this._leftColStateSub.next(state);
  }
  getcasinotableData() {
    return this._casinotabledata.asObservable();
  }

  setData(value: string) {
    this._casinotabledata.next(value);
  }
  

  private _lagugageSub = new BehaviorSubject<any>(null);
  _lagugageSub$ = this._lagugageSub.asObservable();
  // showLiveTv = new EventEmitter<any>();
}
