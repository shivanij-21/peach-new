import { Component, OnInit } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { MainService } from 'src/app/services/main.service';
import { ScoreService } from 'src/app/services/score.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { SportsApiService } from 'src/app/services/sports-api.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {
  isGameApiCall = true;
  allScoresData: any = [];
  stakeSettingData: any;
  isLogin: boolean = false;
  intervalSub: any;

  constructor(
    private main: MainService,
    private mainService: MainService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private clientApi: ClientApiService,
    private scoreService: ScoreService,
    private sportsAPi: SportsApiService,
    private tokenService: TokenService,


  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit(): void {
    this.main.apis$.subscribe((res) => {
      this.sportWise();
      this.GetBetStakeSetting();
      this.intervalSub = setInterval(() => {
        this.sportWise();
      }, 60000)
    })
    $("ul li").on("click", function () {
      $("li").removeClass("active");
      $(this).addClass("active");
    });
  }
  sportWise() {
    if (!this.isGameApiCall) {
      return;
    }
    this.isGameApiCall = false;

    this.clientApi.listGames().subscribe((resp: any) => {
      // console.log("sport wise game api call", resp);

      if (resp.result) {
        if (resp.result) {
          resp.result.forEach((item: any) => {
            if (item.eventId == 31345701) {
              item.markets.push({ betDelay: 0, gameId: 430719080, isInPlay: 1, marketId: '1.145970106', marketName: 'Winner 2022', open: 1, status: 1 })
            }
          })
        }


        // if (this.isIcasino || (this.siteName != 'lc247' && this.siteName != 'lc365' && this.siteName != 'cricbuzzer' && this.siteName != 'skyexch' && this.siteName != 'deep11exch' && this.siteName != 'skyproexchange' && this.siteName != 'cheetahexch' && this.siteName != 'sky444' && this.siteName != 'jeesky7' && this.siteName != 'jee365' && this.siteName != 'mpl365' && this.siteName != 'runexchange')) { //Remove new all sport for icasino
        resp.result = resp.result.filter((item: any) => {
          return parseInt(item.eventTypeId) == 4 || parseInt(item.eventTypeId) == 1 || parseInt(item.eventTypeId) == 2 || parseInt(item.eventTypeId) == 52 || parseInt(item.eventTypeId) == 85;
        });

        this.shareService.shareListGamesData(resp.result);
        this.getMatchOdds(resp.result);

      }
      this.isGameApiCall = true;
    }, err => {
      this.isGameApiCall = true;
    });
  }
  getMatchOdds(matches: any[]) {
    var ids: any[] = [];
    var allSportIds: any[] = [];

    matches.forEach((match, index) => {
      if (!match.markets[0]) {
        return;
      }
      if ((match.eventTypeId == 4 || match.eventTypeId == 1 || match.eventTypeId == 2) && match.markets[0]?.marketId.length < 13) {
        if (match.markets[0].marketName == 'Match Odds' || match.markets[0].marketName == 'Moneyline' || match.markets[0].marketName == 'Fight Result' || match.markets[0].marketName == 'Fight Result - Unmanaged') {
          ids.push(match.markets[0].marketId);
        }
      } else if (match.markets[0]?.marketId.length < 13) {
        // if (match.markets[0].marketName == 'Match Odds' || match.markets[0].marketName == 'Moneyline' || match.markets[0].marketName == 'Fight Result' || match.markets[0].marketName == 'Fight Result - Unmanaged') {
        allSportIds.push(match.markets[0].marketId);
        // }
      }

    });
    if (ids.length) {

      this.sportsAPi.getMatchOdds(4, ids.join(','), false).subscribe((resp: any) => {
        // console.log(resp)

        if (resp.errorCode) {
          this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));

        } else {
          matches.forEach((match: any) => {
            resp.forEach((market: any) => {
              if (match.eventId == market.eventId) {
                match['runners'] = market.runners;
                match['status'] = market.status;
              }
            });
            if (this.allScoresData.length > 0) {
              this.allScoresData.forEach((scoreData: any) => {
                if (match.eventId == scoreData.eventId) {
                  match['score'] = scoreData;
                }
              });
            }
          });
        }

        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));


        this.getAllScores(matches);
      }, err => {
        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
      });
    }
    if (allSportIds.length) {

      this.sportsAPi.getMatchOdds(4, allSportIds.join(','), true).subscribe((resp: any) => {
        // console.log(resp)

        if (resp.errorCode) {
          this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));

        } else {
          matches.forEach((match: any) => {
            resp.forEach((market: any) => {
              if (match.eventId == market.eventId) {
                match['runners'] = market.runners;
                match['status'] = market.status;
              }
            });
            if (this.allScoresData.length > 0) {
              this.allScoresData.forEach((scoreData: any) => {
                if (match.eventId == scoreData.eventId) {
                  match['score'] = scoreData;
                }
              });
            }
          });
        }

        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));


        this.getAllScores(matches);
      }, err => {
        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
      });
    }

    // console.log(allSportIds)
  }
  getAllScores(matches: any[]) {

    if (matches.length > 0) {

      this.scoreService.getAllScore().subscribe((resp: any) => {
        // console.log(resp)
        this.allScoresData = resp;

        matches.forEach((match: any) => {
          if (resp.length > 0) {
            resp.forEach((scoreData: any) => {
              if (match.eventId == scoreData.eventId) {
                match['score'] = scoreData;
              }
            });
          }
        });
        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
      });
    }
  }


  GetBetStakeSetting() {
    let accountInfo = this.tokenService.getUserInfo();
    if (!accountInfo) {
      this.stakeSettingData = [100, 500, 1000, 5000, 10000, 20000, 50000, 100000, 100, 500, 1000, 5000];
      this.shareService.shareStakeButton(this.stakeSettingData);
      this.getProfile();
      return;
    }

    if (accountInfo.stakeSetting) {
      this.stakeSettingData = accountInfo.stakeSetting.split(',');
    } else {
      this.stakeSettingData = [100, 500, 1000, 5000, 10000, 20000, 50000, 100000, 100, 500, 1000, 5000];
    }

    this.stakeSettingData.forEach((element, index) => {
      this.stakeSettingData[index] = parseInt(element);
    });
    this.shareService.shareStakeButton(this.stakeSettingData);
  }
  getProfile() {
    if (!this.isLogin) {
      return;
    }
    this.clientApi.profile().subscribe((resp: any) => {
      if (resp.result) {
        this.tokenService.setUserInfo(resp.result[0]);

        window.location.href = window.location.origin + window.location.pathname;

      }
    })
  }

  ngOnDestroy(): void {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }

}
