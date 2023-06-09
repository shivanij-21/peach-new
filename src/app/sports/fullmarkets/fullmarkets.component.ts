import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ScoreService } from 'src/app/services/score.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { RacingApiService } from 'src/app/services/racing-api.service';

@Component({
  selector: 'app-fullmarkets',
  templateUrl: './fullmarkets.component.html',
  styleUrls: ['./fullmarkets.component.css'],
})
export class FullmarketsComponent implements OnInit {
  matchData: any = [];
  stakeSetting = [];
  params: any;
  isSocketConn: boolean = false;
  scoreInterval: NodeJS.Timer;
  score_id: any;
  selectedMatch: any;
  isSportRadar: any;
  isLogin: any;
  marketsPnl: any = {};
  openedPremiumMarkets: any = {};
  isSportBook: boolean = false;
  openBet: any;
  fancyExposures: any;
  fSource: any;
  selectedMarket: any;
  isVirtual: any;
  subSink = new Subscription();
  fMin: any;
  fMax: any;
  bfMin: any;
  bfMax: any;
  bmMin: any;
  bmMax: any;
  liveUrl: string;
  liveUrlSafe: SafeResourceUrl;
  testiframe: SafeResourceUrl;
  status: boolean = false;
  OpenBetForm: FormGroup;
  BetSlipSubscription!: Subscription;
  OneClickBet: any;
  accountInfo: any;
  expoApiPending: boolean = false;
  fexpoApiPending: boolean = false;
  stakeSettingData: number[];
  context: string;
  width: number = 450;
  height: number = 250;
  counter = 0;
  showbetslip: boolean = false;
  showprofit: boolean = false;
  scoreWidth: number = 450;
  scoreHeight: number = 180;
  test: boolean = false;

  deviceInfo: import('ngx-device-detector').DeviceInfo;
  marketdesc: any;
  Update: any;
  showLoader: boolean = false;

  constructor(
    private shareService: ShareDataService,
    private dfService: DataFormatsService,
    private route: ActivatedRoute,
    private scoreService: ScoreService,
    private socketService: SocketService,
    private userService: ClientApiService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private racingApi: RacingApiService,
    private fb: FormBuilder
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit(): void {
    // this.main.apis$.subscribe((res) => {
    // this.getBalance();
    // })
    this.route.params.subscribe((params) => {
      // console.log(params);
      this.shareService.activeMatch.emit(params['eventId']);
      this.params = params;
      this.subSink.unsubscribe();
      this.subSink = new Subscription();
      this.matchData = [];
      this.isSocketConn = false;
      this.subSink.add(() => {
        this.socketService.closeConnection();
      });

      this.getMatchData();
    });
    $(document).ready(function ($) {
      var alterClass = function () {
        var ww = document.body.clientWidth;
        if (ww < 1279) {
          $('.test').removeClass('sidebar-left');
        } else if (ww >= 1280) {
          $('.test').addClass('sidebar-left');
        }
      };
      $(window).resize(function () {
        alterClass();
      });
      //Fire it when the page first loads:
      alterClass();
    });
    this.initOpenBetForm();
    this.getBetStakeSetting();
    this.epicFunction();
    this.UserDescription();
  }

  getlanguages() {
    this.shareService._lagugageSub$.subscribe((data) => {
      if (data != null) {
        this.Update = data;
      }
      console.log(this.Update);
    });
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktop = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktop); // returns if the app is running on a Desktop browser.

    if (isMobile) {
      this.context = 'Mobile';
    }
    if (isTablet) {
      this.context = 'Tablet';
    }
    if (isDesktop) {
      this.context = 'Desktop';
    }
    if (isMobile) {
      this.width = window.innerWidth;
      this.height = Math.ceil(this.width / 1.778);
    }
  }

  getMarketDescription() {
    if (!this.isLogin) {
      return;
    }
    this.racingApi
      .marketDescription(this.params.marketId)
      .subscribe((data: any) => {
        // this.marketDescription = data;
        this.marketdesc = data;
        // console.log("this.marketdesc",this.marketdesc);
        if (data) {
          this.matchData[0]['eventTypes'] = data.eventTypes;
          this.matchData[0]['time'] =
            data.eventTypes?.eventNodes?.marketNodes?.description?.marketTime;
          this.matchData[0]['inplay'] =
            data.eventTypes?.eventNodes?.marketNodes?.state?.inplay;
          this.matchData[0]['isBettable'] = true;
          this.matchData[0]['eventTypeId'] = data.eventTypes.eventTypeId;
        }
      });
  }
  loadEventSettings() {
    // if (!this.isLogin) {
    //   return;
    // }
    this.userService.loadEvent(this.params.eventId).subscribe((resp: any) => {
      // console.log("bf min max ",resp)
      if (resp.errorCode == 0 && resp.result.length > 0) {
        this.bfMin = resp.result[0].min;
        this.bfMax = resp.result[0].max.toString();
        if (this.bfMax.length > 5) {
          this.bfMax = this.bfMax.slice(0, -3) + 'K';
        }
        // if (this.bfMax.length > 5) {
        //   this.bfMax = this.bfMax.slice(0, -3) + 'K';
        // }

        if (this.isVirtual) {
          this.bmMin = this.bfMin;
          this.bmMax = this.bfMax;
        }

        if (resp.result[0].bookmakerSettings) {
          this.bmMin = resp.result[0].bookmakerSettings?.min;
          this.bmMax = resp.result[0].bookmakerSettings?.max.toString();
          if (this.bmMax.length > 5) {
            this.bmMax = this.bmMax.slice(0, -3) + 'K';
          }
          // if (this.bmMax.length > 5) {
          //   this.bmMax = this.bmMax.slice(0, -3) + 'K';
          // }
        }

        if (resp.result[0].sessionSettings) {
          this.fMin = resp.result[0].sessionSettings?.min;
          this.fMax = resp.result[0].sessionSettings?.max.toString();
          if (this.fMax.length > 5) {
            this.fMax = this.fMax.slice(0, -3) + 'K';
          }
          // if (this.fMax.length > 5) {
          //   this.fMax = this.fMax.slice(0, -3) + 'K';
          // }
        }
      }
    });
  }

  getMatchData() {
    $('#page_loading').css('display', 'block');
    this.matchData = [];
    let IsTvShow = false;
    this.shareService.sportData$.subscribe((data: any) => {
      // console.log("data from full market",data);
      if (data) {
        if (!this.isSocketConn) {
          if (this.params.marketId) {
            // console.log(this.params.marketId);
            this.matchData.push({
              eventId: this.params.eventId,
              port: this.params.port,
              markets: [],
              isRacing: true,
            });
            // console.log("match data  1",this.matchData);
            this.getMarketDescription();
          } else {
            this.matchData = _.cloneDeep(
              this.dfService.favouriteEventWise(data, this.params.eventId)
            );
            // console.log("match data 2",this.matchData);

            this.scoreInterval = setInterval(
              () => {
                _.forEach(this.matchData, (element) => {
                  this.getScore(element);
                });
                // this.getBalance();
              },
              this.isLogin ? 2000 : 10000
            );
          }
          this.socketService.getWebSocketData(this.matchData[0]);
          this.isSocketConn = true;

          // console.log("matchData3",this.matchData)
          if (this.matchData.length == 0) {
            this.router.navigate(['/dash']);
          }

          this.loadEventSettings();

          if (!this.params.marketId) {
            _.forEach(this.matchData, (element) => {
              _.forEach(element.markets, (element2, mktIndex: number) => {
                element2['MarketId'] = element2.marketId;
                this.ExposureBook(element2);
                if (mktIndex == 0) {
                  this.getBmExposureBook(element2);
                }
              });
              this.getFancyExposure(element);
              this.getScoreId(element);
              // if (this.siteName != 'line1000') {

              //   this.getScoreId(element);
              // }

              // if (element.videoEnabled) {
              //   $('#openTV').css('display', 'flex');
              // }
              // else {
              //   $('#openTV').css('display', 'none');
              // }

              if (
                !this.selectedMatch &&
                element.videoEnabled &&
                !IsTvShow &&
                this.isLogin
              ) {
                this.openTv(element);
                IsTvShow = true;
              }
            });
          } else {
            _.forEach(this.matchData, (element) => {
              _.forEach(element.markets, (element2) => {
                element2['MarketId'] = element2.marketId;
                this.ExposureBook(element2);
              });
            });
          }

          this.shareService.oddsData$.subscribe((oddsData: any) => {
            if (oddsData && this.matchData[0]) {
              if (this.matchData[0].isRacing) {
                if (this.matchData[0].eventTypes) {
                  _.forEach(
                    this.matchData[0].eventTypes.eventNodes.marketNodes.runners,
                    (data) => {
                      _.forEach(oddsData.runners, (runner) => {
                        if (!runner.exchange.availableToBack) {
                          runner.exchange.availableToBack = [];
                        }
                        if (!runner.exchange.availableToLay) {
                          runner.exchange.availableToLay = [];
                        }
                        runner.exchange['AvailableToBack'] =
                          runner.exchange.availableToBack;
                        runner.exchange['AvailableToLay'] =
                          runner.exchange.availableToLay;

                        if (runner.selectionId == data.selectionId) {
                          runner['SelectionId'] = runner.selectionId;
                          runner['ExchangePrices'] = runner.exchange;
                          runner['description'] = data.description;
                        }
                      });
                    }
                  );
                  oddsData['isBettable'] = true;

                  oddsData['Runners'] = oddsData.runners;
                  oddsData['MarketId'] = oddsData.marketId;
                  oddsData['Status'] = oddsData.state.status;
                  oddsData['marketName'] =
                    this.matchData[0].eventTypes.eventNodes.marketNodes.description.marketName;

                  let raceMarket: any = [];
                  raceMarket.push(oddsData);
                  // console.log(this.matchData)

                  _.forEach(this.matchData, (element) => {
                    _.forEach(element.markets, (element2) => {
                      _.forEach(raceMarket, (market) => {
                        if (market.MarketId == element2.MarketId) {
                          element2.pnl = this.marketsPnl[element2.MarketId];
                          if (element2.pnl) {
                            market['pnl'] = element2.pnl;
                          } else {
                            this.ExposureBook(element2);
                          }

                          if (element2.newpnl) {
                            market['newpnl'] = element2.newpnl;
                          }
                        }
                      });
                    });
                  });

                  if (this.matchData[0].markets[0]) {
                    this.oddsChangeBlink(this.matchData[0].markets, raceMarket);
                  }
                  this.getMarketsData(raceMarket);
                }

                setTimeout(() => {
                  $('#page_loading').css('display', 'none');
                }, 1000);
              } else {
                if (oddsData.sportsBookMarket) {
                  _.forEach(this.matchData, (element) => {
                    _.forEach(element.sportsBookMarket, (element2) => {
                      _.forEach(oddsData.sportsBookMarket, (market, index) => {
                        if (market.id == element2.id) {
                          element2.pnl = this.marketsPnl[element2.id];

                          if (element2.pnl) {
                            market['pnl'] = element2.pnl;
                          } else {
                            // this.ExposureBook(element2);
                          }

                          if (element2.newpnl) {
                            market['newpnl'] = element2.newpnl;
                          }
                        }
                      });
                    });

                    // this.oddsChangeBlink(element.markets, oddsData);
                  });
                  this.getSportsBookMarket(oddsData.sportsBookMarket);
                }

                if (oddsData.Fancymarket) {
                  _.forEach(oddsData.Fancymarket, (fanyItem) => {
                    // if (this.siteName == 'lc247' || this.siteName == 'lc365') {

                    //   if (fanyItem.gstatus == 'SUSPENDED') {
                    //     fanyItem.gstatus = "Suspend"
                    //   }
                    //   if (fanyItem.gstatus == 'BALL RUNNING') {
                    //     fanyItem.gstatus = "Ball Running"
                    //   }
                    //   if (fanyItem.gstatus != '') {
                    //     fanyItem.b1 = '';
                    //     fanyItem.bs1 = '';
                    //     fanyItem.l1 = '';
                    //     fanyItem.ls1 = '';

                    //   }
                    // }

                    if (this.openBet) {
                      if (
                        this.openBet.runnerName == fanyItem.nat &&
                        fanyItem.gstatus != ''
                      ) {
                        this.ClearAllSelection();
                      }
                    }
                    if (this.fancyExposures) {
                      let fancyExpo =
                        this.fancyExposures[
                          'df_' +
                            fanyItem.mid +
                            '_' +
                            fanyItem.sid +
                            '_' +
                            fanyItem.nat
                        ];
                      if (fancyExpo != undefined) {
                        fanyItem['pnl'] = fancyExpo;
                      }
                    }
                  });

                  this.getFancyData(oddsData.Fancymarket);
                }
                if (oddsData.BMmarket) {
                  // if (this.siteName == 'lc247' || this.siteName == 'lc365') {
                  //   if (oddsData.BMmarket.bm1) {
                  //     _.forEach(oddsData.BMmarket.bm1, (runner: any) => {
                  //       if (runner.s == 'SUSPENDED') {
                  //         runner.s = 'Suspend';
                  //       }
                  //       if (runner.s == 'BALL RUNNING') {
                  //         runner.s = 'Ball Running';
                  //       }
                  //       if (runner.s != 'ACTIVE') {
                  //         runner.b1 = '';
                  //         runner.bs1 = '';
                  //         runner.l1 = '';
                  //         runner.ls1 = '';
                  //       }
                  //     });
                  //   }
                  // }

                  _.forEach(this.matchData, (element: any) => {
                    if (element.BMmarket.bm1) {
                      if (
                        element.BMmarket.bm1[0].mid ==
                        oddsData.BMmarket?.bm1[0].mid
                      ) {
                        // if (!element2.pnl) {
                        element.BMmarket.pnl =
                          this.marketsPnl['bm_' + element.BMmarket?.bm1[0].mid];
                        // }
                        if (element.BMmarket.pnl) {
                          oddsData.BMmarket['pnl'] = element.BMmarket.pnl;
                        } else {
                          this.getBmExposureBook(element.markets[0]);
                        }

                        if (element.BMmarket.newpnl) {
                          oddsData.BMmarket['newpnl'] = element.BMmarket.newpnl;
                        }
                      }
                    }

                    // console.log(element.BMmarket.bm1)
                  });
                  this.getBookMakersData(oddsData.BMmarket);
                }
                if (oddsData.length > 0) {
                  oddsData = oddsData.sort(function (a: any, b: any) {
                    if (a.marketName == 'Draw no Bet') {
                      return 1;
                    } else {
                      return a.marketName < b.marketName
                        ? -1
                        : a.marketName > b.marketName
                        ? 1
                        : 0;
                    }
                  });

                  // console.log(oddsData)

                  if (oddsData[0]) {
                    oddsData = oddsData.filter(function (market: any) {
                      return market.marketName != 'Over/Under 3.5 Goals';
                    });
                  }

                  _.forEach(this.matchData, (element) => {
                    _.forEach(element.markets, (element2) => {
                      _.forEach(oddsData, (market, index: any) => {
                        if (market.MarketId == element2.MarketId) {
                          if (market.marketName.indexOf('Winner ') > -1) {
                            market.Runners = market.Runners.filter(function (
                              runner: any
                            ) {
                              return runner.Status == 'ACTIVE';
                            });
                          }

                          if (market.marketName == 'To Win the Toss') {
                            market['isBettable'] = true;
                          } else {
                            market['isBettable'] = element.isBettable;
                          }
                          market['isBettable'] = true;
                          // console.log(market);

                          // if (element2.pnl) {
                          element2.pnl = this.marketsPnl[element2.MarketId];
                          // }
                          if (element2.pnl) {
                            market['pnl'] = element2.pnl;
                          } else {
                            this.ExposureBook(element2);
                          }

                          if (element2.newpnl) {
                            market['newpnl'] = element2.newpnl;
                          }

                          if (market.Runners.length > 0 && index == 0) {
                            market['TotalMatched'] =
                              market.Runners[0].TotalMatched.toFixed(2);
                            this.matchData[0]['TotalMatched'] =
                              market.Runners[0].TotalMatched.toFixed(2);
                            this.matchData[0]['marketName'] = market.marketName;
                          }
                          if (!this.selectedMarket) {
                            this.selectMarket(market.MarketId, false);
                          }
                        }
                      });
                    });

                    this.oddsChangeBlink(element.markets, oddsData);
                  });
                  this.getMarketsData(oddsData);
                }
                this.matchData[0].isData = true;

                $('#page_loading').css('display', 'none');
              }
            }
            // console.log(this.matchData,"matchData")
            if (this.matchData[0]) {
              this.isVirtual = this.matchData[0].isVirtual;
            }
            // console.log(this.isVirtual,"isVirtual")
            // if (this.isVirtual) {
            //   this.getMatchData();
            // }
          });
        } else {
          if (this.params.marketId) {
          } else {
            let matchData = _.cloneDeep(
              this.dfService.favouriteEventWise(data, this.params.eventId)
            );

            if (matchData[0] && this.matchData[0]) {
              this.matchData[0].isInPlay = matchData[0].isInPlay;
              this.matchData[0].isBettable = matchData[0].isBettable;
              this.matchData[0].inplay = matchData[0].inplay;
              this.matchData[0].videoEnabled = matchData[0].videoEnabled;

              if (this.matchData[0].videoEnabled) {
                $('#openTV').css('display', 'flex');
              } else {
                $('#openTV').css('display', 'none');
              }
            }
          }
        }
      }
    });

    if (this.isLogin) {
      this.shareService.showLiveTv.subscribe((data) => {
        // console.log(data);
        // this.hideTvControl();
        _.forEach(this.matchData, (event) => {
          if (event.videoEnabled) {
            $('#openTV').css('display', 'flex');
          } else {
            $('#openTV').css('display', 'none');
          }
          if (event.videoEnabled && !this.selectedMatch) {
            this.openTv(event);
          }
        });
      });
    }
  }

  getBookMakersData(BMmarket: any[]) {
    this.matchData[0]['BMmarket'] = BMmarket;
    this.matchData[0].isBookData = true;
  }

  getScore(event: any) {
    if (event.isKabaddi) {
      return;
    }
    if (
      (!event.sportradar_url && !this.score_id) ||
      (this.selectedMatch && this.score_id && !this.isSportRadar)
    ) {
      this.scoreService.getScore(event.eventId).subscribe((resp) => {
        // console.log("get score ",resp);

        if (resp.score) {
          // {
          //   if (this.isVirtual) {

          //   } else {
          //   }
          // }
          if (event.eventTypeId == 4) {
            if (resp.score.score1.indexOf('&') > -1) {
              resp.score['score3'] = resp.score.score1.split('&')[1];
              resp.score.score1 = resp.score.score1.split('&')[0];
            }
            if (resp.score.score2.indexOf('&') > -1) {
              resp.score['score4'] = resp.score.score2.split('&')[1];
              resp.score.score2 = resp.score.score2.split('&')[0];
            }
          }
          if (event.eventId == resp.eventId) {
            event['fullScore'] = resp;
          }
        }
      });
    }
  }
  getScoreId(match: any) {
    this.scoreService.GetScoreId(match.eventId).subscribe((resp: any) => {
      // console.log("get score id", resp);

      this.score_id = resp.result[0]?.score_id;
      if (this.score_id) {
        this.GetIframeScoreUrl(match);
      }
    });
  }
  GetIframeScoreUrl(match: any) {
    // if (this.siteName != 'line1000') {
    let url =
      'https://www.satsports.net/score_widget/index.html?id=' +
      this.score_id +
      '&aC=bGFzZXJib29rMjQ3';
    // let url = 'http://localhost:5500/index2.html?id=' + this.score_id + '&aC=bGFzZXJib29rMjQ3';
    match['sportradar_url'] =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.testiframe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // console.log(this.testiframe);

    // }
  }

  oddsChangeBlink(oldMarkets: any, newMarkets: any) {
    _.forEach(oldMarkets, (market: any, index: number) => {
      _.forEach(market.Runners, (runner: any, index2: number) => {
        if (runner.ExchangePrices) {
          let BackRunner =
            newMarkets[index]?.Runners[index2]?.ExchangePrices.AvailableToBack;

          if (BackRunner) {
            _.forEach(
              runner.ExchangePrices.AvailableToBack,
              (value: any, index3: number) => {
                // || value.size != BackRunner[index3]?.size
                if (
                  value.price != BackRunner[index3]?.price ||
                  value.size != BackRunner[index3]?.size
                ) {
                  const back = $(
                    '#' + runner.SelectionId + ' .back' + (index3 + 1)
                  );
                  back.addClass('spark');
                  this.removeChangeClass(back);
                }
              }
            );
          }
        }

        if (runner.ExchangePrices) {
          let LayRunner =
            newMarkets[index]?.Runners[index2]?.ExchangePrices.AvailableToLay;

          if (LayRunner) {
            _.forEach(
              runner.ExchangePrices.AvailableToLay,
              (value: any, index3: number) => {
                // || value.size != LayRunner[index3]?.size
                if (
                  value.price != LayRunner[index3]?.price ||
                  value.size != LayRunner[index3]?.size
                ) {
                  const back = $(
                    '#' + runner.SelectionId + ' .lay' + (index3 + 1)
                  );
                  back.addClass('spark');
                  this.removeChangeClass(back);
                }
              }
            );
          }
        }
      });
    });
  }
  removeSpace(value: any) {
    if (value) {
      value = value.toString();
      return value.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '_');
    }
  }
  removeChangeClass(changeClass: any) {
    setTimeout(() => {
      // changeClass.removeClass('odds-up');
      changeClass.removeClass('spark');
    }, 300);
  }

  getSportsBookMarket(sportsBookMarket: any[]) {
    sportsBookMarket = sportsBookMarket.filter((market) => {
      return market.apiSiteStatus != 'DEACTIVED';
    });
    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return a.eventId - b.eventId;
    });

    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id);
    });

    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return parseInt(a.apiSiteMarketId) - parseInt(b.apiSiteMarketId);
    });

    // sportsBookMarket = sportsBookMarket.sort((a, b) => {
    //   return parseInt(a.updateDate) - parseInt(b.updateDate);
    // });

    _.forEach(sportsBookMarket, (market, index) => {
      // market.sportsBookSelection.filter((market:any) => {
      //   return market.apiSiteStatus != "DEACTIVED";
      // });
      if (index < 5) {
        market['isExpand'] = 1;
        this.openedPremiumMarkets[market.id] = 1;
      }
      if (this.openedPremiumMarkets[market.id]) {
        market['isExpand'] = this.openedPremiumMarkets[market.id];
      }
      if (market.sportsBookSelection) {
        market.sportsBookSelection = market.sportsBookSelection.sort(
          (a: any, b: any) => {
            return parseInt(a.id) - parseInt(b.id);
          }
        );
      }
    });

    this.matchData[0]['sportsBookMarket'] = sportsBookMarket;

    setTimeout(() => {
      if (
        this.matchData[0]?.Fancymarket.length == 0 &&
        sportsBookMarket.length > 0
      ) {
        this.isSportBook = true;
      }
    }, 1000);

    //   console.log("this.matchData",this.matchData)
  }

  getFancyData(Fancymarket: any[]) {
    this.fSource = this.socketService.getFSource();

    // Fancymarket = Fancymarket.filter((f1) =>
    //   !(
    //     // /[0-9]+.[1-9]\s+(ball|over)\s+run/.test(f1.nat) ||
    //     /[0-9]+.[1-6]\s+(ball|over)\s+run/.test(f1.nat) ||
    //     // /\./.test(f1.nat) ||
    //     // /^[0-9]+\.?[0-9]*$/.test(f1.nat) ||
    //     // /[\d]+\s+runs\s+bhav\s+/i.test(f1.nat) ||
    //     // /run\s+bhav/i.test(f1.nat) ||
    //     /(total\s+match\s+boundaries)/i.test(f1.nat) ||
    //     /\d+\s+to\s+\d+\s+overs\s+/i.test(f1.nat)
    //   ));
    // Fancymarket = Fancymarket.filter((f1) => {
    //   return !f1.nat.includes('ball run ');
    // });
    // if (this.siteName == 'mash247' || this.siteName == "runbet" || this.siteName == "winbetusd" || this.siteName == "jeesky7" || this.siteName == "jee365") {
    //   Fancymarket = Fancymarket.filter((f1) => {
    //     return !f1.nat.includes('.3 over run ');
    //   });
    // }
    // if (this.siteName == "runbet") {
    //   Fancymarket = Fancymarket.filter((f1) => {
    //     return !f1.nat.includes('run bhav ');
    //   });
    // }
    Fancymarket = Fancymarket.filter((f1) => {
      return !f1.nat.includes('ball run ') || f1.ballsess != '3';
    });

    this.matchData[0]['Fancymarket'] = Fancymarket;
    this.matchData[0].isFancyData = true;
  }

  selectMarket(marketId: any, value: any) {
    this.selectedMarket = marketId;
    // var g = $('#marketBetsWrap');
    // var f = g.find('#naviMarket_' + this.removeSpace(marketId));
    // if (f && value) {
    //   const mainWrap = document.querySelector('#mainWrap');
    //   let leftOffset = 0;
    //   leftOffset = f.offset().left;
    //   // console.log(leftOffset)
    //   if (mainWrap) {
    //     // frame.scrollLeft = leftOffset ? leftOffset : 0;
    //     mainWrap.scrollLeft = leftOffset;
    //   }
    // }
  }

  getMarketsData(markets: any[]) {
    this.matchData[0]['markets'] = markets;
    this.matchData[0].isMarketData = true;

    // console.log(this.matchData)
  }

  openTv(match: any) {
    // console.log("open tv call ");
    this.status = !this.status;
    // if(this.fundInfo?.balance<1 && this.fundInfo?.exposure<1){
    //   this.lowBalancePop();
    // }
    // else{
    // this.scoreApiPending = false;
    if (this.selectedMatch) {
      if (this.selectedMatch.eventId != match.eventId) {
        this.selectedMatch = match;
        this.setIframeUrl(match);
      } else {
        this.selectedMatch = null;
      }
    } else {
      // this.selectedMatch = match;
      this.setIframeUrl(match);
    }
    // }
  }

  setIframeUrl(match: any) {
    // console.log("setIframeUrl setIframeUrl");
    if (match) {
      this.userService.getliveTvApi(match.eventId).subscribe(
        (resp: any) => {
          if (resp) {
            // resp=JSON.parse(resp);
            // console.log(resp)
            if (resp.streamingUrl) {
              this.selectedMatch = match;
              this.liveUrl = resp.streamingUrl;
              // console.log(this.liveUrl );

              this.liveUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.liveUrl
              );
              // console.log(this.liveUrlSafe);

              // setTimeout(() => {
              //   this.hideTvControl();
              // }, 500);
            } else {
              this.selectedMatch = null;
              $('#openTV').css('display', 'none');
              // this.liveUrl = "https://streamingtv.fun/live_tv/index.html?eventId=" + this.selectedMatch.eventId;
            }

            // if (match.eventTypeId < 10) {
            //   this.scoreHeight = 180;
            // }

            // if (resp.scoreUrl) {
            //   this.score_id = match.eventId;

            //   if (this.siteName != 'line1000') {
            //     let url = resp.scoreUrl;
            //     match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);

            //   }
            // }
          }
        },
        (err) => {
          // console.log(err)
        }
      );

      // this.liveUrl = "https://streamingtv.fun/live_tv/index.html?eventId=" + this.selectedMatch.eventId;
      // this.liveUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);
      // setTimeout(() => {
      //   this.hideTvControl();
      // }, 500)
    }
  }

  trackByEvent(index: any, item: any) {
    return item.eventId;
  }
  trackByRunner(index: any, item: any) {
    return item.SelectionId;
  }
  trackByMkt(index: any, item: any) {
    return item.MarketId;
  }
  trackByFancy(index: any, item: any) {
    return item.id;
  }
  trackByBookRunner(index: any, item: any) {
    return item.name;
  }
  trackBySportBook(index: any, item: any) {
    return item.id;
  }

  // betslip section
  showtv() {
    this.status = !this.status;
  }

  getBetStakeSetting() {
    this.shareService.stakeButton$.subscribe((data) => {
      if (data != null) {
        this.stakeSetting = data;
        // console.log(this.stakeSetting, "stakeSetting")
      }
    });
  }
  getpprofile() {
    if (!this.isLogin) {
      return;
    }
    this.userService.profile().subscribe((resp: any) => {
      if (resp.result) {
        this.tokenService.setUserInfo(resp.result[0]);

        window.location.href =
          window.location.origin + window.location.pathname;
      }
    });
  }

  initOpenBetForm() {
    this.OpenBetForm = this.fb.group({
      sportId: [this.openBet?.sportId],
      tourid: [this.openBet?.tourid],
      matchBfId: [this.openBet?.matchBfId],
      matchId: [this.openBet?.matchId],
      eventId: [this.openBet?.matchId],
      bfId: [this.openBet?.bfId],
      marketId: [this.openBet?.bfId],
      mktBfId: [this.openBet?.bfId],
      mktId: [this.openBet?.mktId],
      selId: [this.openBet?.SelectionId],
      matchName: [this.openBet?.matchName],
      marketName: [this.openBet?.marketName],
      mktname: [this.openBet?.marketName],
      isInplay: [this.openBet?.isInplay],
      runnerName: [this.openBet?.runnerName],
      odds: [this.openBet?.odds],
      bookodds: [{ value: this.openBet?.odds, disabled: true }],
      backlay: [this.openBet?.backlay],
      betType: [this.openBet?.backlay],
      yesno: [this.openBet?.backlay == 'back' ? 'yes' : 'no'],
      score: [this.openBet?.score],
      runs: [this.openBet?.score],
      rate: [this.openBet?.rate],
      fancyId: [this.openBet?.fancyId],
      bookId: [this.openBet?.bookId],
      runnerId: [this.openBet?.runnerId],
      bookType: [this.openBet?.bookType],
      stake: [this.openBet?.stake],
      profit: [0],
      loss: [0],
      mtype: [this.openBet?.mtype],
      gameType: [this.openBet?.mtype],
      oddsTyping: [false],
      stakeTyping: [true],
    });
    // console.log(this.OpenBetForm.value);
  }
  get f() {
    return this.OpenBetForm.controls;
  }

  OpenBetSlip(
    event: any,
    sportId: any,
    tourid: any,
    matchBfId: any,
    bfId: any,
    SelectionId: any,
    matchName: any,
    marketName: any,
    isInplay: any,
    runnerName: any,
    odds: any,
    backlay: any,
    score: any,
    rate: any,
    fancyId: any,
    bookId: any,
    runnerId: any,
    bookType: any,
    sportBookType: any
  ) {
    // console.log("click");
    this.showbetslip = true;

    $(
      '.back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3,#back_1,#lay_1'
    ).removeClass('select');

    this.ClearAllSelection();

    if (this.dfService.getOneClickSetting()) {
      this.OneClickBet = JSON.parse(
        this.dfService.getOneClickSetting() || '{}'
      );
    }

    var element = event.currentTarget.classList;
    element.add('select');

    this.openBet = {
      sportId,
      tourid,
      matchBfId,
      bfId,
      SelectionId,
      matchName,
      marketName,
      isInplay,
      runnerName,
      odds,
      backlay,
      score,
      rate,
      fancyId,
      bookId,
      runnerId,
      bookType,
    };
    // this.SetValue()

    // this.f.sportId.setValue(this.openBet?.sportId);
    // this.f.sportId.setValue(this.openBet?.sportId);

    if (this.OneClickBet?.isOneClickBet) {
      this.openBet['stake'] =
        this.stakeSetting[this.OneClickBet?.oneClickBetStakeIndex + 8];
    } else {
      this.openBet['stake'] = '';
    }

    if (
      bfId != null &&
      SelectionId != null &&
      bookType == null &&
      !fancyId &&
      !sportBookType
    ) {
      this.openBet['mtype'] = 'exchange';

      // if (this.openBet.mtype == "exchange") {
      this.shareService.shareBetSlipData(this.openBet);
      // }

      setTimeout(() => {
        $('#betSlipBoard').fadeIn();
      }, 10);
    }

    if (bookId != null && bookType != null) {
      this.openBet['mtype'] = 'book';
    }
    if (fancyId != null) {
      this.openBet['mtype'] = 'fancy';
    }

    if (sportBookType == 'premium') {
      this.openBet['mtype'] = 'premium';
    }

    setTimeout(() => {
      $('.fancy-quick-tr').fadeIn();
    }, 10);

    this.initOpenBetForm();
    // console.log(this.openBet,"this.openBet");

    // if (this.OneClickBet?.isOneClickBet && this.openBet?.mtype != "exchange") {
    //   this.BetSubmit();
    // }

    if (
      navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
      )
    ) {
      (<any>$('#betSlip_popup')).modal('show');
    } else {
      // $("#betSlip_popup [data-bs-dismiss=modal]").trigger("click");
      // console.log("else part ");
    }
  }

  SetValue() {
    this.f.sportId.setValue(this.openBet?.sportId);
    this.f.tourid.setValue(this.openBet?.tourid);
    this.f.matchBfId.setValue(this.openBet?.matchBfId);
    this.f.matchId.setValue(this.openBet?.matchId);
    this.f.eventId.setValue(this.openBet?.eventId);
    this.f.bfId.setValue(this.openBet?.tourid);
    this.f.marketId.setValue(this.openBet?.marketId);
    this.f.mktBfId.setValue(this.openBet?.mktBfId);
    this.f.mktId.setValue(this.openBet?.mktId);
    this.f.selId.setValue(this.openBet?.selId);
    this.f.matchName.setValue(this.openBet?.matchName);
    this.f.marketName.setValue(this.openBet?.marketName);
    this.f.mktname.setValue(this.openBet?.mktname);
    this.f.isInplay.setValue(this.openBet?.mktname);
    this.f.runnerName.setValue(this.openBet?.runnerName);
    this.f.odds.setValue(this.openBet?.odds);
    this.f.bookodds.setValue(this.openBet?.bookodds);
    this.f.backlay.setValue(this.openBet?.backlay);
    this.f.betType.setValue(this.openBet?.betType);
    this.f.yesno.setValue(this.openBet?.yesno);
    this.f.score.setValue(this.openBet?.score);
    this.f.runs.setValue(this.openBet?.runs);
    this.f.rate.setValue(this.openBet?.rate);
    this.f.bookId.setValue(this.openBet?.bookId);
    this.f.runnerId.setValue(this.openBet?.runnerId);
    this.f.bookType.setValue(this.openBet?.bookType);
    this.f.stake.setValue(this.openBet?.stake);
    this.f.profit.setValue(this.openBet?.profit);
    this.f.loss.setValue(this.openBet?.loss);
    this.f.mtype.setValue(this.openBet?.mtype);
    this.f.gameType.setValue(this.openBet?.gameType);
    this.f.oddsTyping.setValue(this.openBet?.oddsTyping);
    this.f.betType.setValue(this.openBet?.betType);
    this.f.stakeTyping.setValue(this.openBet?.stakeTyping);
  }

  closebetslip() {
    console.log('close bet ');
    this.showbetslip = false;
  }
  ClearAllSelection() {
    this.openBet = null;

    this.marketsNewExposure(this.openBet);
    $(
      '.back-1,.back-2,.back-3,#back_1,.lay-1,.lay-2,.lay-3,#lay_1'
    ).removeClass('select');

    $('#confirmBetPop').fadeOut();
  }

  BetSubmit() {
    if (!this.isLogin) {
      // this.openLoginPop();
      // this.router.navigate(['/login']);
      return;
    }

    if (!this.OpenBetForm.valid) {
      return;
    }
    this.showLoader = true;

    $('#page_loading').css('display', 'block');
    $('#confirmBetPop').fadeOut();

    let fSource = this.socketService.getFSource();

    let placeData = {};

    if (this.OpenBetForm.value.gameType == 'exchange') {
      placeData = {
        marketId: this.OpenBetForm.value.marketId,
        selId: this.OpenBetForm.value.selId,
        odds: this.OpenBetForm.value.odds,
        stake: this.OpenBetForm.value.stake,
        betType: this.OpenBetForm.value.betType,
        gameType: this.OpenBetForm.value.gameType,
        uid: this.accountInfo.userName,
      };
      this.showBetCooldown();
    } else if (this.OpenBetForm.value.gameType == 'book') {
      placeData = {
        // "marketId": this.OpenBetForm.value.sportId == 52 ? this.OpenBetForm.value.marketId : "bm_" + this.OpenBetForm.value.marketId,
        marketId:
          this.OpenBetForm.value.sportId == 52
            ? this.OpenBetForm.value.marketId
            : (fSource == '0' ? 'bm_' : 'bm2_') +
              this.OpenBetForm.value.marketId,
        selId: this.OpenBetForm.value.selId,
        odds: this.OpenBetForm.value.odds,
        stake: this.OpenBetForm.value.stake,
        betType: this.OpenBetForm.value.betType,
        gameType: this.OpenBetForm.value.gameType,
        uid: this.accountInfo.userName,
        source: fSource,
      };
    } else if (this.OpenBetForm.value.gameType == 'fancy') {
      placeData = {
        marketId:
          'df_' +
          (this.isVirtual
            ? '_' + this.OpenBetForm.value.selId
            : this.OpenBetForm.value.marketId +
              '_' +
              this.OpenBetForm.value.selId),
        marketName: this.OpenBetForm.value.runnerName,
        odds: +this.OpenBetForm.value.rate,
        runs: +this.OpenBetForm.value.runs,
        stake: +this.OpenBetForm.value.stake,
        betType: this.OpenBetForm.value.yesno,
        gameType: this.OpenBetForm.value.gameType,
        uid: this.accountInfo.userName,
        source: fSource,
      };
    } else if (this.OpenBetForm.value.gameType == 'premium') {
      // console.log(this.OpenBetForm)
      placeData = {
        eventId: this.OpenBetForm.value.matchBfId,
        marketId: this.OpenBetForm.value.marketId,
        selId: this.OpenBetForm.value.selId,
        odds: this.OpenBetForm.value.odds,
        stake: this.OpenBetForm.value.stake,
        betType: this.OpenBetForm.value.betType,
        gameType: this.OpenBetForm.value.gameType,
        uid: this.accountInfo.userName,
      };
      this.showBetCooldown();
    }

    // console.log(placeData);
    if (this.OpenBetForm.value.gameType == 'premium') {
      this.userService.placeBetsPremium(placeData).subscribe(
        (resp: any) => {
          if (resp.errorCode == 0) {
            if (resp.result[0].reqId && resp.result[0].result == 'pending') {
              let getResp = resp.result[0];
              // getResp.delay = getResp.delay + 1;

              setTimeout(() => {
                this.requestResult(getResp);
              }, getResp.delay * 1000 + 500);
            } else {
              let respData = this.OpenBetForm.value;
              respData['msg'] = resp.errorDescription;
              // this.toastr.success(respData);
              this.toastr.success(resp.errorDescription);
              this.showbetslip = false;
              this.closebetslip();

              setTimeout(() => {
                if (resp.result[1]) {
                  let marketBook: any = [];
                  marketBook.push(resp.result[1]);
                  if (resp.result[0].gameType == 'premium') {
                    this.marketsPnl[resp.result[0].marketId] = marketBook;
                  } else if (resp.result[0].gameType == 'book') {
                    resp.result[0].marketId = resp.result[0].marketId.replace(
                      'bm2_',
                      'bm_'
                    );
                    this.marketsPnl[resp.result[0].marketId] = marketBook;
                  } else {
                    this.afterPlaceBetExposure();
                  }
                } else {
                  this.afterPlaceBetExposure();
                }
                if (resp.result[2] && resp.result[3]) {
                  this.shareService.shareUpdateFundExpo(resp.result);
                } else {
                  this.shareService.shareUpdateFundExpo('event');
                }
                this.OpenBetForm.reset();
                this.ClearAllSelection();
                this.showLoader = false;
                $('#page_loading').css('display', 'none');
              }, 500);
            }
          } else {
            let respData = this.OpenBetForm.value;
            respData['msg'] = resp.errorDescription;
            // this.toastr.error(respData);
            this.toastr.error(resp.errorDescription);
            this.showLoader = false;
            $('#page_loading').css('display', 'none');
          }
        },
        (err) => {
          this.showLoader = false;
          $('#page_loading').css('display', 'none');
        }
      );
    } else {
      this.userService.placeBet(placeData).subscribe(
        (resp: any) => {
          if (resp.errorCode == 0) {
            if (resp.result[0].reqId && resp.result[0].result == 'pending') {
              let getResp = resp.result[0];
              setTimeout(() => {
                this.requestResult(getResp);
              }, getResp.delay * 1000 + 500);
            } else {
              let respData = this.OpenBetForm.value;
              respData['msg'] = resp.errorDescription;
              // this.toastr.success(respData);
              this.toastr.success(resp.errorDescription);
              this.showbetslip = false;
              console.log(this.showbetslip);

              this.closebetslip();

              setTimeout(() => {
                if (resp.result[1]) {
                  let marketBook: any = [];
                  marketBook.push(resp.result[1]);
                  if (resp.result[0].gameType == 'exchange') {
                    this.marketsPnl[resp.result[0].marketId] = marketBook;
                  } else if (resp.result[0].gameType == 'book') {
                    resp.result[0].marketId = resp.result[0].marketId.replace(
                      'bm2_',
                      'bm_'
                    );
                    this.marketsPnl[resp.result[0].marketId] = marketBook;
                  } else {
                    this.afterPlaceBetExposure();
                  }
                } else {
                  this.afterPlaceBetExposure();
                }
                if (resp.result[2] && resp.result[3]) {
                  this.shareService.shareUpdateFundExpo(resp.result);
                } else {
                  this.shareService.shareUpdateFundExpo('event');
                }
                this.OpenBetForm.reset();
                this.ClearAllSelection();
                this.showLoader = false;
                $('#page_loading').css('display', 'none');
              }, 500);
            }
          } else {
            let respData = this.OpenBetForm.value;
            respData['msg'] = resp.errorDescription;
            // this.toastr.error(respData);
            this.toastr.error(resp.errorDescription);
            this.showLoader = false;
            $('#page_loading').css('display', 'none');
          }
        },
        (err) => {
          this.showLoader = false;
          $('#page_loading').css('display', 'none');
        }
      );
    }
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
  }
  requestResult(data: any) {
    // console.log(data)
    this.userService.requestResult(data.reqId).subscribe(
      (resp: any) => {
        if (resp.errorCode == 0) {
          if (resp.result[0].result == 'pending') {
            setTimeout(() => {
              this.requestResult(data);
            }, 500);
          } else {
            let respData = this.OpenBetForm.value;
            respData['msg'] = resp.errorDescription;
            // this.toastr.success(respData);
            this.toastr.success(resp.errorDescription);
            this.showbetslip = false;

            setTimeout(() => {
              if (resp.result[1]) {
                let marketBook: any = [];
                marketBook.push(resp.result[1]);
                if (resp.result[0].gameType == 'exchange') {
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else if (resp.result[0].gameType == 'premium') {
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else if (resp.result[0].gameType == 'book') {
                  resp.result[0].marketId = resp.result[0].marketId.replace(
                    'bm2_',
                    'bm_'
                  );
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else {
                  this.afterPlaceBetExposure();
                }
              } else {
                this.afterPlaceBetExposure();
              }
              if (resp.result[2] && resp.result[3]) {
                this.shareService.shareUpdateFundExpo(resp.result);
              } else {
                this.shareService.shareUpdateFundExpo('event');
              }
              this.OpenBetForm.reset();
              this.ClearAllSelection();
              this.showLoader = false;
              $('#page_loading').css('display', 'none');
            }, 500);
          }
        } else {
          let respData = this.OpenBetForm.value;
          respData['msg'] = resp.errorDescription;
          // this.toastr.error(respData);
          this.toastr.error(resp.errorDescription);
          this.showLoader = false;
          $('#page_loading').css('display', 'none');
        }
      },
      (err) => {
        this.showLoader = false;
        $('#page_loading').css('display', 'none');
      }
    );
  }

  afterPlaceBetExposure() {
    _.forEach(this.matchData, (item) => {
      if (this.OpenBetForm.value.mtype == 'exchange') {
        _.forEach(item.markets, (item2) => {
          if (this.OpenBetForm.value.marketId == item2.MarketId) {
            this.ExposureBook(item2);
          }
        });
      }

      if (this.OpenBetForm.value.mtype == 'book') {
        _.forEach(item.markets, (item2) => {
          if (this.OpenBetForm.value.marketId == item2.MarketId) {
            this.getBmExposureBook(item2);
          }
        });
      }

      if (this.OpenBetForm.value.mtype == 'fancy') {
        if (this.OpenBetForm.value.matchBfId == item.eventId) {
          this.getFancyExposure(item);
        }
      }
    });
  }

  getFancyExposure(match: any) {
    if (!this.isLogin) {
      return;
    }
    if (this.fexpoApiPending) {
      return;
    }

    this.fexpoApiPending = true;
    this.userService.getFancyExposure(match.eventId).subscribe(
      (resp: any) => {
        if (resp.errorCode == 0) {
          this.fancyExposures = resp.result[0];
        }
        this.fexpoApiPending = false;
      },
      (err) => {
        this.fexpoApiPending = false;
      }
    );
  }

  getBmExposureBook(market: any) {
    if (!this.isLogin) {
      return;
    }
    if (!market.MarketId) {
      return;
    }
    let fSource = this.socketService.getFSource();

    let MarketId = '';
    if (this.matchData[0].eventTypeId == 52) {
      market.MarketId = market.MarketId.replace('bm_', '');
      MarketId = market.MarketId;
    } else {
      market.MarketId = market.MarketId.replace('bm_', '');
      // MarketId = "bm_" + market.MarketId;
      MarketId = (fSource == '0' ? 'bm_' : 'bm2_') + market.MarketId;
    }
    if (this.expoApiPending) {
      return;
    }

    this.expoApiPending = true;
    this.userService.getBookMakerBook(MarketId).subscribe(
      (resp: any) => {
        // if (resp.errorCode == 0) {
        //   market['pnl'] = resp.result[0];
        // }
        // market['pnl'] = resp.result;
        this.marketsPnl['bm_' + market.MarketId] = resp.result;

        // console.log(this.marketsPnl)
        this.expoApiPending = false;
      },
      (err) => {
        this.expoApiPending = false;
      }
    );
  }

  ExposureBook(market: any) {
    if (!this.isLogin) {
      return;
    }
    if (this.expoApiPending) {
      return;
    }

    this.expoApiPending = true;
    this.userService.getBookExposure(market.MarketId).subscribe(
      (resp: any) => {
        // if (resp.errorCode == 0) {
        //   market['pnl'] = resp.result[0];
        // }
        // market['pnl'] = resp.result;
        this.marketsPnl[market.MarketId] = resp.result;

        // console.log(this.marketsPnl)
        this.expoApiPending = false;
      },
      (err) => {
        this.expoApiPending = false;
      }
    );
  }

  marketsNewExposure(bet: any) {
    _.forEach(this.matchData, (match, matchIndex) => {
      _.forEach(match.markets, (market, mktIndex) => {
        if (bet) {
          let newMktExposure = _.cloneDeep(market.pnl);
          if (!newMktExposure) {
            newMktExposure = [];
          }
          if (
            bet.stake != null &&
            market.MarketId == bet.bfId &&
            bet.mtype == 'exchange'
          ) {
            let selectionPnl: any = {};
            if (newMktExposure.length == 0) {
              _.forEach(market.Runners, (runner) => {
                selectionPnl[runner.SelectionId] = 0;
              });
              newMktExposure.push(selectionPnl);
            }
            _.forEach(newMktExposure[0], (value, selId) => {
              if (bet.backlay == 'back' && bet.selId == selId) {
                if (bet.profit != null) {
                  value = this.convertToFloat(
                    parseFloat(value) + parseFloat(bet.profit)
                  );
                  newMktExposure[0][selId] = value;
                }
              }
              if (bet.backlay == 'back' && bet.selId != selId) {
                value = this.convertToFloat(
                  parseFloat(value) - parseFloat(bet.loss)
                );
                newMktExposure[0][selId] = value;
              }
              if (bet.backlay == 'lay' && bet.selId == selId) {
                if (
                  bet.profit != null &&
                  bet.rate == null &&
                  bet.odds != null
                ) {
                  value = this.convertToFloat(
                    parseFloat(value) - parseFloat(bet.loss)
                  );
                  newMktExposure[0][selId] = value;
                }
              }
              if (bet.backlay == 'lay' && bet.selId != selId) {
                if (
                  bet.profit != null &&
                  bet.rate == null &&
                  bet.odds != null
                ) {
                  value = this.convertToFloat(
                    parseFloat(value) + parseFloat(bet.profit)
                  );
                  newMktExposure[0][selId] = value;
                }
              }
            });

            market['newpnl'] = newMktExposure;
          }
        } else {
          market['newpnl'] = null;
        }
      });
      _.forEach(match.BMmarket, (book, bookIndex) => {
        if (bet) {
          let newbookExposure = _.cloneDeep(match.BMmarket.pnl);
          if (!newbookExposure) {
            newbookExposure = [];
          }
          let bookId = match.BMmarket.bm1[0].mid;
          if (bet.stake != null && bookId == bet.bfId && bet.mtype == 'book') {
            let selectionPnl: any = {};
            if (newbookExposure.length == 0) {
              _.forEach(match.BMmarket.bm1, (runner) => {
                selectionPnl[runner.sid] = 0;
              });
              newbookExposure.push(selectionPnl);
            }
            _.forEach(newbookExposure[0], (value, selId) => {
              if (bet.backlay == 'back' && bet.selId == selId) {
                if (bet.profit != null) {
                  newbookExposure[0][selId] = this.convertToFloat(
                    parseFloat(value) + parseFloat(bet.profit)
                  );
                }
              }
              if (bet.backlay == 'back' && bet.selId != selId) {
                newbookExposure[0][selId] = this.convertToFloat(
                  parseFloat(value) - parseFloat(bet.loss)
                );
              }
              if (bet.backlay == 'lay' && bet.selId == selId) {
                if (
                  bet.profit != null &&
                  bet.rate == null &&
                  bet.odds != null
                ) {
                  newbookExposure[0][selId] = this.convertToFloat(
                    parseFloat(value) - parseFloat(bet.loss)
                  );
                }
              }
              if (bet.backlay == 'lay' && bet.selId != selId) {
                if (
                  bet.profit != null &&
                  bet.rate == null &&
                  bet.odds != null
                ) {
                  newbookExposure[0][selId] = this.convertToFloat(
                    parseFloat(value) + parseFloat(bet.profit)
                  );
                }
              }
            });

            match.BMmarket['newpnl'] = newbookExposure;
          }
        } else {
          match.BMmarket['newpnl'] = null;
        }
      });
    });

    // console.log(this.matchData)
  }

  showBetCooldown() {
    if (this.openBet) {
      _.forEach(this.matchData, (event) => {
        event.isBettable = !this.showLoader;
        _.forEach(event.markets, (market) => {
          if (market.MarketId == this.openBet?.bfId) {
            market['isBettable'] = this.showLoader;
          }
        });
      });
    }
  }

  addStake(stake: any) {
    // console.log(this.OpenBetForm.value);

    this.showprofit = true;
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(stake.toFixed(0));
    } else if (this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(
        (parseFloat(this.OpenBetForm.value.stake) + stake).toFixed(0)
      );
    }

    this.calcProfit();
  }

  calcProfit() {
    // console.log("calc profit form data", this.OpenBetForm.value)

    if (this.OpenBetForm.value.backlay == 'back') {
      // console.log("back ");

      this.OpenBetForm.controls['profit'].setValue(
        (
          (parseFloat(this.OpenBetForm.value.odds) - 1) *
          this.OpenBetForm.value.stake
        ).toFixed(2)
      );
      this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
    } else {
      this.OpenBetForm.controls['loss'].setValue(
        (
          (parseFloat(this.OpenBetForm.value.odds) - 1) *
          this.OpenBetForm.value.stake
        ).toFixed(2)
      );
      this.OpenBetForm.controls['profit'].setValue(
        this.OpenBetForm.value.stake
      );
    }

    if (
      this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'book'
    ) {
      if (this.OpenBetForm.value.bookType == 'Bookmaker') {
        if (this.OpenBetForm.value.backlay == 'back') {
          this.OpenBetForm.controls['profit'].setValue(
            (
              (parseFloat(this.OpenBetForm.value.odds) *
                this.OpenBetForm.value.stake) /
              100
            ).toFixed(2)
          );
          this.OpenBetForm.controls['loss'].setValue(
            this.OpenBetForm.value.stake
          );
        } else {
          this.OpenBetForm.controls['loss'].setValue(
            (
              (parseFloat(this.OpenBetForm.value.odds) *
                this.OpenBetForm.value.stake) /
              100
            ).toFixed(2)
          );
          this.OpenBetForm.controls['profit'].setValue(
            this.OpenBetForm.value.stake
          );
        }
      }

      if (this.OpenBetForm.value.bookType == 2) {
        if (this.OpenBetForm.value.backlay == 'back') {
          this.OpenBetForm.controls['profit'].setValue(
            (
              (parseFloat(this.OpenBetForm.value.odds) - 1) *
              this.OpenBetForm.value.stake
            ).toFixed(2)
          );
          this.OpenBetForm.controls['loss'].setValue(
            this.OpenBetForm.value.stake
          );
        } else {
          this.OpenBetForm.controls['loss'].setValue(
            (
              (parseFloat(this.OpenBetForm.value.odds) - 1) *
              this.OpenBetForm.value.stake
            ).toFixed(2)
          );
          this.OpenBetForm.controls['profit'].setValue(
            this.OpenBetForm.value.stake
          );
        }
      }
    }

    if (
      this.OpenBetForm.value.rate &&
      this.OpenBetForm.value.score &&
      this.OpenBetForm.value.mtype == 'fancy'
    ) {
      if (this.OpenBetForm.value.backlay == 'back') {
        this.OpenBetForm.controls['profit'].setValue(
          (parseFloat(this.OpenBetForm.value.rate) *
            this.OpenBetForm.value.stake) /
            100
        );
        this.OpenBetForm.controls['loss'].setValue(
          this.OpenBetForm.value.stake
        );
      } else {
        this.OpenBetForm.controls['loss'].setValue(
          (parseFloat(this.OpenBetForm.value.rate) *
            this.OpenBetForm.value.stake) /
            100
        );
        this.OpenBetForm.controls['profit'].setValue(
          this.OpenBetForm.value.stake
        );
      }
    }
    if (this.OpenBetForm.value.stake == null) {
      this.OpenBetForm.controls['profit'].setValue(0);
    }
    this.marketsNewExposure(this.OpenBetForm.value);
  }

  convertToFloat(value: any) {
    return parseFloat(value).toFixed(2);
  }

  incOdds() {
    if (!this.OpenBetForm.value.odds) {
      this.OpenBetForm.controls['odds'].setValue(1.0);
    }
    if (parseFloat(this.OpenBetForm.value.odds) >= 1000) {
      this.OpenBetForm.controls['odds'].setValue(1000);
      this.calcProfit();
      return false;
    }
    let odds = parseFloat(this.OpenBetForm.value.odds);
    // console.log(odds);

    this.OpenBetForm.controls['odds'].setValue(
      this.oddsDecimal(odds + this.oddsDiffCalc(odds))
    );

    this.calcProfit();
    // this.calcExposure(bet);
  }

  decOdds() {
    if (
      this.OpenBetForm.value.odds == '' ||
      this.OpenBetForm.value.odds == null ||
      parseFloat(this.OpenBetForm.value.odds) <= 1.01
    ) {
      this.OpenBetForm.controls['odds'].setValue(1.01);
      this.calcProfit();
      return false;
    }
    let odds = parseFloat(this.OpenBetForm.value.odds);
    this.OpenBetForm.controls['odds'].setValue(
      this.oddsDecimal(odds - this.oddsDiffCalc(odds))
    );

    this.calcProfit();
    // this.calcExposure(bet);
  }

  oddsDecimal(value: any) {
    return value == null || value == '' || parseFloat(value) > 19.5
      ? value
      : parseFloat(value) > 9.5
      ? parseFloat(value).toFixed(1)
      : parseFloat(value).toFixed(2);
  }

  oddsDiffCalc(currentOdds: any) {
    var diff;
    if (currentOdds < 2) {
      diff = 0.01;
    } else if (currentOdds < 3) {
      diff = 0.02;
    } else if (currentOdds < 4) {
      diff = 0.05;
    } else if (currentOdds < 6) {
      diff = 0.1;
    } else if (currentOdds < 10) {
      diff = 0.2;
    } else if (currentOdds < 20) {
      diff = 0.5;
    } else if (currentOdds < 30) {
      diff = 1.0;
    } else {
      diff = 2.0;
    }
    return diff;
  }

  update() {
    this.calcProfit();
  }

  getPnlValue(runner: any, Pnl: any) {
    let pnl = '';
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.SelectionId) {
          pnl = value[runner.SelectionId];
          // console.log(pnl,"pnl");
        }
        if (runner.sid) {
          pnl = value[runner.sid];
        }
        if (runner.id) {
          pnl = value[runner.id];
        }
      });
    }
    return pnl;
  }

  getPnlClass(runner: any, Pnl: any) {
    let pnlClass = 'black';
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.SelectionId) {
          if (parseInt(value[runner.SelectionId]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.SelectionId]) < 0) {
            pnlClass = 'lose';
          }
        }
        if (runner.sid) {
          if (parseInt(value[runner.sid]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.sid]) < 0) {
            pnlClass = 'lose';
          }
        }
        if (runner.id) {
          if (parseInt(value[runner.id]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.id]) < 0) {
            pnlClass = 'lose';
          }
        }
      });
    }
    return pnlClass;
  }

  getPnl2Class(runner: any, Pnl: any) {
    let pnlClass = 'black';
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.SelectionId) {
          if (parseInt(value[runner.SelectionId]) >= 0) {
            pnlClass = 'to-win';
          }
          if (parseInt(value[runner.SelectionId]) < 0) {
            pnlClass = 'to-lose';
          }
        }
        if (runner.sid) {
          if (parseInt(value[runner.sid]) >= 0) {
            pnlClass = 'to-win';
          }
          if (parseInt(value[runner.sid]) < 0) {
            pnlClass = 'to-lose';
          }
        }
        if (runner.id) {
          if (parseInt(value[runner.id]) >= 0) {
            pnlClass = 'to-win';
          }
          if (parseInt(value[runner.id]) < 0) {
            pnlClass = 'to-lose';
          }
        }
      });
    }
    return pnlClass;
  }

  ngOnDestroy() {
    $('#openTV').css('display', 'none');
    this.shareService.activeMatch.emit(null);
    this.shareService.shareBetSlipData(null);
    this.socketService.closeConnection();
    this.subSink.unsubscribe();
    this.matchData = [];
    if (this.scoreInterval) {
      clearInterval(this.scoreInterval);
    }
  }
}
