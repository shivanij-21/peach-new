import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';




@Component({
  selector: 'app-cardmeter',
  templateUrl: './cardmeter.component.html',
  styleUrls: ['./cardmeter.component.css'],
})
export class CardmeterComponent implements OnInit {
  gTypes: string;
  tableName: string;
  tableId: string;

  minStake: any = 0;
  maxStake: any = 0;
  status: string = '';
  msgData: any;
  timeoutReset: any;
  markets = [];
  // rulespopup: boolean = true;
  teenpatti1day: boolean = true;

  tpData: any;

  tpMarkets: any = [];
  tpFMarkets: any = [];
  casinoPnl: any = [];
  lastResults: any = [];
  showbetslip: boolean = false;
  isCheckedBetInfo: boolean = false;
  isCheckedAverageOdds: boolean = false;

  clock: any;
  gType: string;
  context: string;

  oldRoundId = 0;
  roundId = 0;

  openBet: any;

  activeClass = false;
  showrule: boolean = false;
  check: boolean = true;

  // getRoundResult()
  roundResult: any;

  casinoSource = interval(1000);
  casinosubscription: Subscription;
  toasterSubscription!: Subscription;
  eventBetsSubscription!: Subscription;

  cards = [
    { cardNo: 1, cardName: 'A' },
    { cardNo: 2, cardName: '2' },
    { cardNo: 3, cardName: '3' },
    { cardNo: 4, cardName: '4' },
    { cardNo: 5, cardName: '5' },
    { cardNo: 6, cardName: '6' },
    { cardNo: 7, cardName: '7' },
    { cardNo: 8, cardName: '8' },
    { cardNo: 9, cardName: '9' },
    { cardNo: 10, cardName: '10' },
    { cardNo: 11, cardName: 'J' },
    { cardNo: 12, cardName: 'Q' },
    { cardNo: 13, cardName: 'K' },
  ];

  seletedCards: any = [];
  eventBets = [];

  totalBets = 0;
  marketBets: any;
  selectedMarket: any = '';

  OpenBetForm: FormGroup;
  stakeSetting = [];
  casinoSubscription: Subscription;
  BetSlipSubscription!: Subscription;

  isLogin: boolean = false;

  showLoader: boolean = false;

  accountInfo: any;
  orientation: number = 0;
  isShowMinMax: boolean = false;
  deviceInfo: any;
  OneClickBet: any;
  public getScreenWidth: any;
  public cardwidth: any;
  public getScreenHeight: any;

  type: any = 'PieChart';
  mydata = [
    ['Player', 45.0],
    ['Banker', 26.8],
    ['Tie', 12.8],
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    is3D: true,
    backgroundColor: 'transparent',
    slices: [
      { color: 'rgb(8, 108, 184)' },
      { color: 'rgb(131, 25, 36)' },
      { color: 'rgb(39, 149, 50)' },
    ],
    legend: {
      position: 'right',
    },
    chartArea: {
      left: '20%',
      top: '2%',
      bottom: '2%',
      width: '100%',
      height: '100%',
    },
  };
  width = 209;
  height = 160;

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent!: ElementRef<any>;

  @ViewChild('widgetsContent2', { read: ElementRef })
  public widgetsContent2!: ElementRef<any>;
  tablenamevalue: any;
  betstatus: any;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    // console.log('orientationChanged');
    // console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
    this.orientation = event.target.screen.orientation.angle;
  }

  activatedTab = 'hands';

  constructor(
    private casinoApi: CasinoApiService,
    private route: ActivatedRoute,
    private main: MainService,
    private shareService: ShareDataService,
    private fb: FormBuilder,
    private userService: ClientApiService,
    private tokenService: TokenService,
    private deviceService: DeviceDetectorService,
    private dfService: DataFormatsService,
    private toastr: ToastrService,
    private ToastMessageService: ToastMessageService
  ) {
    this.route.params.subscribe((params) => {
      // console.log(params.tableName)
      this.tablenamevalue = params.tableName;
      this.tableName = params['tableName'];
      this.tableId = params['tableId'];
      this.gTypes = params['gType'];
      return this.gTypes;
    });
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth - 24;
    this.getScreenHeight = window.innerHeight;

    this.main.apis$.subscribe((res) => {
      this.getCasinoRate();
      this.getLastResult();
      this.loadTableSettings();
      this.getTpExpoCalls();
      this.casinoSubscription = this.casinoSource.subscribe((val) => {
        this.getCasinoRate();
      });
    });
    this.getBetStakeSetting();

    if (this.tableName == 'DT2020') {
      this.activatedTab = 'dragon';
    }
    this.UserDescription();
    this.getToastMessage();
    this.epicFunction();
    // this.getMatchedUnmatchBets();
  }

  ngAfterViewInit() {
    this.setClock();
    if (this.tableName == "3CardsJud") {
      this.owlCarousel();
    }
  }

  setClock() {
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.cardwidth = window.innerWidth / 7;
  }
  owlCarousel() {
    // (<any>$("#andar_div,#bahar_div")).owlCarousel({
    //   loop: false,
    //   margin: 10,
    //   responsiveClass: false,
    //   slideBy: 5,
    //   dots: false,
    //   responsive: {
    //     0: {
    //       items: 5,
    //       nav: true,
    //     },
    //     600: {
    //       items: 5,
    //       nav: true,
    //     },
    //     1000: {
    //       items: 14,
    //       nav: true,
    //       loop: false,
    //     },
    //   },
    // });
  }

  getBetStakeSetting() {
    this.shareService.stakeButton$.subscribe((data) => {
      // console.log(data);

      if (data != null) {
        this.stakeSetting = data;
      }
    });
  }

  initOpenBetForm() {
    this.OpenBetForm = this.fb.group({
      gameType: [this.openBet.gameType],
      betType: [this.openBet.betType],
      round: [this.openBet.round],
      odds: [this.openBet.odds],
      selId: [this.openBet.selId],
      runnername: [this.openBet.runnerName],
      stake: [''],
      stakeTyping: [true],
      cards: [this.seletedCards],
    });
    console.log(this.OpenBetForm.value, 'OpenBetForm');
    console.log(this.openBet, 'openBet');
  }

  get f() {
    return this.OpenBetForm?.controls;
  }

  activeTab(tab: any) {
    this.activatedTab = tab;
  }

  showMinMax(sid: any) {
    this.isShowMinMax = !this.isShowMinMax;
    if (this.isShowMinMax) {
      $('#min-max-info_' + sid)
        .fadeIn()
        .css('display', 'block');
    } else {
      $('#min-max-info_' + sid)
        .fadeOut()
        .css('display', 'none');
    }
  }

  getCasinoRate() {
    this.casinoApi.casinoRate(this.gTypes).subscribe((resp: any) => {
      // console.log(resp)
      if (this.tableName != 'TP1Day') {
        _.forEach(resp.data?.t1, (element) => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        _.forEach(resp.data?.t2, (element) => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        this.tpData = resp.data.t1[0];
        this.tpMarkets = resp.data.t2;
        // console.log('this.tpMarkets res data', this.tpMarkets);
      } else {
        _.forEach(resp.data?.bf, (element) => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        this.tpMarkets = resp.data.bf;
        this.tpData = {};
        this.tpData['mid'] = resp.data.bf[0].marketId;
        this.tpData['autotime'] = resp.data.bf[0].lasttime;
      }
      if (this.tableName == 'TPOpen') {
        if (this.tpData.cards) {
          this.tpData.cards = this.tpData.cards.split(',');
          _.forEach(this.tpData.cards, (item, index) => {
            this.tpData.cards[index] = item.split('#')[0];
          });
        }
      }
      if (this.tableName == '32Cards' || this.tableName == '32CardsB') {
        if (this.tpData.desc) {
          this.tpData.desc = this.tpData.desc.split(',');
        }

        this.tpData['t1'] = [];
        this.tpData['t2'] = [];
        this.tpData['t3'] = [];
        this.tpData['t4'] = [];

        _.forEach(this.tpData.desc, (value: any, index: number) => {
          if (
            index == 0 ||
            index == 4 ||
            index == 8 ||
            index == 12 ||
            index == 16 ||
            index == 20 ||
            index == 24 ||
            index == 28
          ) {
            this.tpData.t1.push(value);
          }
          if (
            index == 1 ||
            index == 5 ||
            index == 9 ||
            index == 13 ||
            index == 17 ||
            index == 21 ||
            index == 25 ||
            index == 29
          ) {
            this.tpData.t2.push(value);
          }
          if (
            index == 2 ||
            index == 6 ||
            index == 10 ||
            index == 14 ||
            index == 18 ||
            index == 22 ||
            index == 26 ||
            index == 30
          ) {
            this.tpData.t3.push(value);
          }
          if (
            index == 3 ||
            index == 7 ||
            index == 11 ||
            index == 15 ||
            index == 119 ||
            index == 23 ||
            index == 27 ||
            index == 31
          ) {
            this.tpData.t4.push(value);
          }
        });

        // console.log(this.tpData)
      }

      if (this.tableName == '3CardsJud') {
        if (this.casinoPnl.length == 0) {
          setTimeout(() => {
            this.owlCarousel();
          }, 200);
        }
      }
      if (this.tableName == 'CasinoMeter') {
        if (this.tpData.cards) {
          this.tpData.cards = this.tpData.cards.split(',');
        }
        this.tpData['high'] = [];
        this.tpData['low'] = [];
        _.forEach(this.tpData.cards, (item: any) => {
          if (item != 1) {
            let firstChr = item.substr(0, 1);
            if (item.length == 4) {
              firstChr = item.substr(0, 2);
            }
            if (
              firstChr == '10' ||
              firstChr == 'J' ||
              firstChr == 'Q' ||
              firstChr == 'K'
            ) {
              this.tpData.high.push(item);
            } else {
              this.tpData.low.push(item);
            }
          }
        });
      }

      if (this.tableName == 'Poker1Day') {
        this.tpFMarkets = resp.data.t3;
      }

      if (this.tpData.autotime) {
        if (this.clock) {
          this.clock.setValue(this.tpData.autotime);
        } else {
           this.setClock();
        }
      }

      if (this.tpData.mid.indexOf('.') > -1) {
        this.roundId = this.tpData.mid.split('.')[1];
      } else {
        this.roundId = this.tpData.mid;
      }

      if (this.oldRoundId != this.roundId) {
        this.casinoPnl = [];
        setTimeout(() => {
          this.listBooks(this.roundId);
          if (this.oldRoundId != 0) {
            this.getLastResult();
          }
        }, 500);
        this.oldRoundId = this.roundId;
      }

      $('#page_loading').css('display', 'none');
    });
  }

  trackByIndex(index: number, item: any) {
    return item.sid;
  }

  getCardSymbolImg(cardName: any) {
    if (cardName == '1') {
      return '';
    }
    let char = '';
    let type = '';
    let className = '';
    let value = '';
    // let value = {};

    if (cardName.length == 4) {
      char = cardName.substring(0, 2);
      type = cardName.slice(2);
    } else {
      char = cardName.charAt(0);
      type = cardName.slice(1);
    }
    switch (type) {
      case 'HH':
        type = '}';
        className = 'card-black1';
        break;
      case 'DD':
        type = '{';
        className = 'card-red1';
        break;
      case 'CC':
        type = ']';
        className = 'card-black1';
        break;
      case 'SS':
        type = '[';
        className = 'card-red1';
        break;
    }

    value = char + '<span class="' + className + '">' + type + '</span>';

    return value;

    // return value = { type, className, char };
  }

  loadTableSettings() {
    this.casinoApi.loadTable(this.tableName).subscribe((resp: any) => {
      // console.log(resp)
      if (resp.errorCode == 0) {
        this.minStake = resp.result[0].min;
        this.maxStake = resp.result[0].max.toString();
        if (this.maxStake.length > 5) {
          this.maxStake = this.maxStake.slice(0, -3) + 'K';
        }
      }
    });
  }

  getLastResult() {
    this.casinoApi.lastResult(this.gTypes).subscribe((resp: any) => {
      // console.log("last result",resp);

      if (resp.data) {
        _.forEach(resp.data, (item) => {
          if (item.result == 0) {
            item['player'] = 'playerb';
            item['winner'] = 'R';
          }
          if (item.result == 1) {
            item['player'] = 'playera';
            item['winner'] = 'A';
          }
          if (item.result == 2) {
            item['player'] = 'playerb';
            item['winner'] = 'B';
          }
          if (item.result == 3) {
            item['player'] = 'playerb';
            item['winner'] = 'B';
          }
          if (this.tableName == 'Lucky7A' || this.tableName == 'Lucky7B') {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'L';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'H';
            }
            if (item.result == 0) {
              item['player'] = 'playerc';
              item['winner'] = 'T';
            }
          }
          if (this.tableName == '32Cards' || this.tableName == '32CardsB') {
            if (item.result == 1) {
              item['player'] = 'playerb';
              item['winner'] = '8';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = '9';
            }
            if (item.result == 3) {
              item['player'] = 'playerb';
              item['winner'] = '10';
            }
            if (item.result == 4) {
              item['player'] = 'playerb';
              item['winner'] = '11';
            }
          }
          if (this.tableName == 'AAA' || this.tableName == 'Bollywood') {
            if (item.result == 1) {
              item['player'] = 'playerb';
              item['winner'] = 'A';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'B';
            }
            if (item.result == 3) {
              item['player'] = 'playerb';
              item['winner'] = 'C';
            }
            if (item.result == 4) {
              item['player'] = 'playerb';
              item['winner'] = 'D';
            }
            if (item.result == 5) {
              item['player'] = 'playerb';
              item['winner'] = 'E';
            }

            if (item.result == 6) {
              item['player'] = 'playerb';
              item['winner'] = 'F';
            }
          }
          if (this.tableName == 'Baccarat') {
            if (item.result == 1) {
              item['player'] = 'cplayer';
              item['winner'] = 'P';
            }
            if (item.result == 2) {
              item['player'] = 'cbanker';
              item['winner'] = 'B';
            }
            if (item.result == 3) {
              item['player'] = 'ctie';
              item['winner'] = 'T';
            }
            if (resp.graphdata) {
              this.mydata = [];
              this.mydata.push(['Player', resp.graphdata.P]);
              this.mydata.push(['Banker', resp.graphdata.B]);
              this.mydata.push(['Tie', resp.graphdata.T]);
            }
          }
          if (this.tableName == 'Poker2020' || this.tableName == 'Poker1Day') {
            if (item.result == 0) {
              item['player'] = 'playert';
              item['winner'] = 'T';
            }
            if (item.result == 11) {
              item['player'] = 'playera';
              item['winner'] = 'A';
            }
            if (item.result == 21) {
              item['player'] = 'playerb';
              item['winner'] = 'B';
            }
          }
          if (this.tableName == 'Poker6P') {
            if (item.result == 0) {
              item['player'] = 'playert';
              item['winner'] = 'T';
            }
            if (item.result == 11) {
              item['player'] = 'playera';
              item['winner'] = '1';
            }
            if (item.result == 12) {
              item['player'] = 'playera';
              item['winner'] = '2';
            }
            if (item.result == 13) {
              item['player'] = 'playera';
              item['winner'] = '3';
            }
            if (item.result == 14) {
              item['player'] = 'playera';
              item['winner'] = '4';
            }
            if (item.result == 15) {
              item['player'] = 'playera';
              item['winner'] = '5';
            }
            if (item.result == 16) {
              item['player'] = 'playera';
              item['winner'] = '6';
            }
          }
          if (this.tableName == 'DT2020' || this.tableName == 'DT1Day') {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'D';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'T';
            }
          }
          if (this.tableName == 'DTL2020') {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'D';
            }
            if (item.result == 21) {
              item['player'] = 'playerb';
              item['winner'] = 'T';
            }
            if (item.result == 41) {
              item['player'] = 'playerc';
              item['winner'] = 'L';
            }
          }
        });
      }

      this.lastResults = resp.data;
      // console.log("lastResults",this.lastResults);
    });
  }

  getRoundResult(gameRound: any) {
    // console.log('click', this.tableName);

    this.casinoApi
      .roundResult(this.gTypes, gameRound.mid)
      .subscribe((resp: any) => {
        // console.log(resp);

        if (resp.data) {
          this.roundResult = resp.data[0];
          // console.log(this.roundResult);

          this.roundResult.cards = this.roundResult.cards.split(',');
          this.roundResult.mid = this.roundResult.mid.split('.')[1];

          if (this.tableName == '32Cards' || this.tableName == '32CardsB') {
            this.roundResult['t1'] = [];
            this.roundResult['t2'] = [];
            this.roundResult['t3'] = [];
            this.roundResult['t4'] = [];

            _.forEach(this.roundResult.cards, (value: any, index: number) => {
              if (
                index == 0 ||
                index == 4 ||
                index == 8 ||
                index == 12 ||
                index == 16 ||
                index == 20 ||
                index == 24 ||
                index == 28
              ) {
                this.roundResult.t1.push(value);
              }
              if (
                index == 1 ||
                index == 5 ||
                index == 9 ||
                index == 13 ||
                index == 17 ||
                index == 21 ||
                index == 25 ||
                index == 29
              ) {
                this.roundResult.t2.push(value);
              }
              if (
                index == 2 ||
                index == 6 ||
                index == 10 ||
                index == 14 ||
                index == 18 ||
                index == 22 ||
                index == 26 ||
                index == 30
              ) {
                this.roundResult.t3.push(value);
              }
              if (
                index == 3 ||
                index == 7 ||
                index == 11 ||
                index == 15 ||
                index == 119 ||
                index == 23 ||
                index == 27 ||
                index == 31
              ) {
                this.roundResult.t4.push(value);
              }
            });
          }

          if (this.tableName == 'CasinoMeter') {
            this.roundResult['high'] = [];
            this.roundResult['low'] = [];
            this.roundResult['hlwin'] = [];

            _.forEach(this.roundResult.cards, (item: any) => {
              if (item != 1) {
                if (item == '10HH' || item == '9HH') {
                  this.roundResult.hlwin.push(item);
                  return;
                }
                let firstChr = item.substr(0, 1);
                if (item.length == 4) {
                  firstChr = item.substr(0, 2);
                }
                if (
                  firstChr == '10' ||
                  firstChr == 'J' ||
                  firstChr == 'Q' ||
                  firstChr == 'K'
                ) {
                  this.roundResult.high.push(item);
                } else {
                  this.roundResult.low.push(item);
                }
              }
            });
          }

          console.log(this.roundResult,"result");
          this.roundResult.desc = this.roundResult?.desc?.split('|');
          console.log(this.roundResult.desc, 'slice');
          

          // $('#lastresultpopup').fadeIn();
          // (<any>$('#lastresultpopup')).modal('show')
        }
      });
  }

  openCasinoRules() {
    $('#casinoRulesWrap').fadeIn();
  }

  closeCasinoResult() {
    $('#casinoResultWrap').fadeOut();
  }

  closeCasinoRules() {
    $('#casinoRulesWrap').fadeOut();
  }

  getTpExpoCalls() {
    this.shareService.callTpExpo$.subscribe((data) => {
      if (data) {
        // console.log(data)

        if (data == 'clearSelection') {
          this.ClearAllSelection();
        } else if (data?.gameType) {
          this.openBet = data;
          this.listBooks(this.openBet.round);
        } else {
          if (this.casinoPnl.length > 0) {
            this.casinoPnl.forEach((element: any, index: any) => {
              if (element.gt == data.gt) {
                this.casinoPnl[index] = data;
              } else {
                this.casinoPnl.push(data);
              }
            });
          } else {
            this.casinoPnl.push(data);
          }
          // console.log(this.casinoPnl)
        }
      } else {
        this.openBet = data;
      }
    });
  }

  listBooks(roundId: any) {
    if (roundId == 0) {
      return false;
    }
    let selId = 1;
    if (this.openBet) {
      selId = this.openBet.selId;
      roundId = this.openBet.round;
    }
    this.casinoApi
      .listBooks(this.tableName, roundId, selId)
      .subscribe((data: any) => {
        if (this.casinoPnl.length == 0) {
          this.casinoPnl = data.result;
        } else {
          this.casinoPnl.push(data.result[0]);
        }
        this.openBet = null;
      });
  }

  getPnlValue(runner: any) {
    let pnl = '0';
    if (this.casinoPnl) {
      _.forEach(this.casinoPnl, (value, index) => {
        if (!pnl || pnl == '0') {
          if (runner.sectionId) {
            pnl = value[runner.sectionId];
          }
          if (runner.sid) {
            pnl = value[runner.sid];
          }
          if (!pnl) {
            pnl = '0';
          }
        }

        // return pnl;
      });
    }
    return pnl;
  }

  getPnlClass(runner: any) {
    let pnlClass = 'black';
    if (this.casinoPnl) {
      _.forEach(this.casinoPnl, (value, index) => {
        if (runner.sectionId) {
          if (parseInt(value[runner.sectionId]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.sectionId]) < 0) {
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
      });
    }
    return pnlClass;
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

  openTPbetSlip(
    event,
    betType: any,
    odds: any,
    runnerName: any,
    selId: any,
    round: string,
    gameType: any,
    cardName: any
  ) {
    this.showbetslip = true;
    // console.log(this.openBet);

    if (this.openBet) {
      if (this.openBet.backlay != betType) {
        this.ClearAllSelection();
      }
    }

    round = round.split('.')[1];
    if (gameType == 'TP1Day') {
      odds = '1.' + odds;
    }
    if (gameType == 'Baccarat') {
      if (odds) {
        odds = parseFloat(odds) + 1;
      }
    }
    this.openBet = {
      backlay: betType,
      betType,
      odds,
      runnerName,
      selId,
      round,
      gameType,
      cardName,
    };
    // console.log("3card data ",this.openBet)

    if (this.tableName == '3CardsJud') {
      if (this.seletedCards.length < 3) {
        let indexcheck = this.seletedCards.indexOf(cardName);
        if (indexcheck == -1) {
          this.seletedCards.push(cardName);
        }
      }
      if (this.seletedCards.length > 2) {
        this.openBet.runnerName =
          this.openBet.runnerName +
          ' ' +
          this.seletedCards.toString().replace(/,/g, '');
        this.initOpenBetForm();
        // console.log("3card data from",this.openBet)
      }
    } else {
      //   this.initOpenBetForm();
    }

    this.initOpenBetForm();
    // if (window.innerWidth <= 1279) {
    //   (<any>$('#placebetmob')).modal('show');
    // }
    

    if (
      navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i)
    ) {
      (<any>$('#placebetmob')).modal('show');
    }
    //  else {
    //   $('#placebetmob [data-bs-dismiss=modal]').trigger('click');
    // }
  }
  selected3cardj(card: any, betType: any): any {
    let selected = false;
    if (!this.openBet) {
      return selected;
    }

    if (this.openBet.backlay == betType) {
      let indexcheck = this.seletedCards.indexOf(card);
      if (indexcheck > -1) {
        return (selected = true);
      }
    }
  }
  openTPbetSlip3cardj(
    event,
    betType: any,
    odds: any,
    runnerName: any,
    selId: any,
    round: string,
    gameType: any,
    cardName: any
  ) {
    this.showbetslip = true;
    // console.log(this.openBet);

    if (this.openBet) {
      if (this.openBet.backlay != betType) {
        this.ClearAllSelection();
      }
    }

    round = round.split('.')[1];
    if (gameType == 'TP1Day') {
      odds = '1.' + odds;
    }
    if (gameType == 'Baccarat') {
      if (odds) {
        odds = parseFloat(odds) + 1;
      }
    }
    this.openBet = {
      backlay: betType,
      betType,
      odds,
      runnerName,
      selId,
      round,
      gameType,
      cardName,
    };
    // console.log("3card data ",this.openBet)

    if (this.tableName == '3CardsJud') {
      if (this.seletedCards.length < 3) {
        let indexcheck = this.seletedCards.indexOf(cardName);
        if (indexcheck == -1) {
          this.seletedCards.push(cardName);
        }
      }
      if (this.seletedCards.length > 2) {
        this.openBet.runnerName =
          this.openBet.runnerName +
          ' ' +
          this.seletedCards.toString().replace(/,/g, '');
          if (
            navigator.userAgent.match(
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i)
          ) {
            (<any>$('#placebetmob')).modal('show');
          }
          // console.log("3card data from",this.openBet)
        }
        this.initOpenBetForm();
    } else {
      //   this.initOpenBetForm();
    }

    this.initOpenBetForm();
    // if (window.innerWidth <= 1279) {
    //   (<any>$('#placebetmob')).modal('show');
    // }
    

 
    //  else {
    //   $('#placebetmob [data-bs-dismiss=modal]').trigger('click');
    // }
  }

  ClearAllSelection() {
    this.openBet = null;
    this.seletedCards = [];
    this.shareService.shareBetSlipData(this.openBet);
    this.marketsNewExposure(this.openBet);
    // $('#placebetmob [data-bs-dismiss=modal]').trigger('click');
    // this.shareService.shareCallTpExpoData('clearSelection');
  }

  // rightside bar ts

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
  }

  getToastMessage() {
    this.toasterSubscription =
      this.ToastMessageService.successMsgSource.subscribe((data) => {
        // console.log(data)
        this.status = 'success';
        this.msgData = data;
        this.timeoutReset = setTimeout(() => {
          this.removeMsg();
        }, 5000);
      });
    this.ToastMessageService.errorMsgSource.subscribe((data) => {
      // console.log(data)

      this.status = 'error';
      this.msgData = data;

      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    });
  }

  removeMsg() {
    this.msgData = null;
    clearTimeout(this.timeoutReset);
  }

  BetSubmit() {
    if (!this.OpenBetForm.valid) {
      return;
    }
    this.showLoader = true;

    $('#loading').css('display', 'flex');

    this.casinoApi.placeTpBet(this.OpenBetForm.value).subscribe(
      (resp: any) => {
        (<any>$('#placebetmob')).modal('hide');
        $("#placebetmob [data-dismiss=modal]").trigger("click");
        if (resp.errorCode == 0) {
          if (resp.result[0]?.reqId && resp.result[0]?.result == 'pending') {
            let getResp = resp.result[0];
            // getResp.delay = getResp.delay + 1;
            setTimeout(() => {
              this.requestResult(getResp);
            }, getResp.delay * 1000 + 500);
          } else {
            // this.toastr.success(resp.errorDescription);
            this.toastr.success(resp.errorDescription);

            setTimeout(() => {
              if (resp.result[1]) {
                if (resp.result[0].sportName == 'Casino') {
                  resp.result[1]['gt'] = resp.result[0].gameType;
                  this.casinoPnl.forEach((element, index) => {
                    if (element.gt == resp.result[0].gameType) {
                      this.casinoPnl[index] = resp.result[1];
                    }
                  });
                  this.casinoPnl.push(resp.result[1]);
                }
              } else {
                this.listBooks(this.OpenBetForm.value.round);
              }
              if (resp.result[2] && resp.result[3]) {
                this.shareService.shareUpdateFundExpo(resp.result);
              } else {
                this.shareService.shareUpdateFundExpo('event');
              }
              this.OpenBetForm.reset();
              this.ClearAllSelection();
              this.showLoader = false;
              $('#loading').css('display', 'none');
            }, 500);
          }
        } else {
          // this.toastr.error(resp.errorDescription);
          this.toastr.error(resp.errorDescription);
          this.showLoader = false;
          $('#loading').css('display', 'none');
        }
      },
      (err) => {
        this.showLoader = false;
        $('#loading').css('display', 'none');
      }
    );
  }

  requestResult(data) {
    this.userService.requestResult(data.reqId).subscribe(
      (resp: any) => {
        if (resp.errorCode == 0) {
          if (resp.result[0].result == 'pending') {
            setTimeout(() => {
              this.requestResult(data);
            }, 500);
          } else {
            // this.toastr.success(resp.errorDescription);
            this.toastr.success(resp.errorDescription);
            this.betstatus = resp.errorDescription;
            console.log('betstatus pending', this.betstatus);

            setTimeout(() => {
              if (resp.result[1]) {
                if (resp.result[0].sportName == 'Casino') {
                  resp.result[1]['gt'] = resp.result[0].gameType;
                  this.casinoPnl.forEach((element, index) => {
                    if (element.gt == resp.result[0].gameType) {
                      this.casinoPnl[index] = resp.result[1];
                    }
                  });
                  this.casinoPnl.push(resp.result[1]);
                }
              } else {
                this.listBooks(this.OpenBetForm.value.round);
              }
              if (resp.result[2] && resp.result[3]) {
                this.shareService.shareUpdateFundExpo(resp.result);
              } else {
                this.shareService.shareUpdateFundExpo('event');
              }
              this.OpenBetForm.reset();
              this.ClearAllSelection();
              this.showLoader = false;
              $('#loading').css('display', 'none');
            }, 500);
          }
        } else {
          // this.toastr.error(resp.errorDescription);
          this.toastr.error(resp.errorDescription);
          this.showLoader = false;
          $('#loading').css('display', 'none');
        }
      },
      (err) => {
        this.showLoader = false;
        $('#loading').css('display', 'none');
      }
    );
  }

  marketsNewExposure(bet: any) {
    this.shareService.shareBetExpoData(bet);
  }

  //OPEN BET SLIP CALC

  addStake(stake) {
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(stake.toFixed(0));
    } else if (this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(
        (parseFloat(this.OpenBetForm.value.stake) + stake).toFixed(0)
      );
    }
  }

  clearStake() {
    this.OpenBetForm.controls['stake'].setValue(null);
  }

  incStake() {
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(0);
    }

    if (this.OpenBetForm.value.stake > -1) {
      let stake = parseInt(this.OpenBetForm.value.stake);
      this.OpenBetForm.controls['stake'].setValue(
        stake + this.stakeDiffCalc(stake)
      );
    }
  }

  decStake() {
    if (this.OpenBetForm.value.stake <= 0) {
      this.OpenBetForm.controls['stake'].setValue('');
      return false;
    }

    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(0);
    }

    if (this.OpenBetForm.value.stake > -1) {
      let stake = parseInt(this.OpenBetForm.value.stake);
      this.OpenBetForm.controls['stake'].setValue(
        stake - this.stakeDiffCalc(stake)
      );
    }
  }

  oddsDecimal(value: any) {
    return value == null || value == '' || parseFloat(value) > 19.5
      ? value
      : parseFloat(value) > 9.5
        ? parseFloat(value).toFixed(1)
        : parseFloat(value).toFixed(2);
  }

  stakeDiffCalc(currentStake) {
    var diff;

    if (currentStake <= 50) {
      diff = 5;
    } else if (currentStake <= 100) {
      diff = 10;
    } else if (currentStake <= 1000) {
      diff = 100;
    } else if (currentStake <= 10000) {
      diff = 1000;
    } else if (currentStake <= 100000) {
      diff = 10000;
    } else if (currentStake <= 1000000) {
      diff = 100000;
    } else if (currentStake <= 10000000) {
      diff = 1000000;
    } else if (currentStake <= 100000000) {
      diff = 10000000;
    } else {
      diff = 100000000;
    }
    return diff;
  }
  openMarketBets(marketBets: any) {
    this.marketBets = marketBets;
    // console.log(this.marketBets)
    this.selectedMarket = this.marketBets;
  }

  closebetslip() {
    this.showbetslip = false;
  }

  trackByMatch(match: any) {
    return match.matchId;
  }
  trackByMarket(market: any) {
    return market.marketId;
  }
  trackByBetType(bet: any) {
    return bet.betType;
  }
  trackByBet(bet: any) {
    return bet.id;
  }

  betInfo() {
    this.isCheckedBetInfo = !this.isCheckedBetInfo;
  }
  averageOdds() {
    this.isCheckedAverageOdds = !this.isCheckedAverageOdds;
  }

  // change css class
  onClickcard() {
    this.activeClass = !this.activeClass;
    console.log(this.activeClass, 'false');
  }

  openrulespopup() {
    this.showrule = !this.showrule;

    if (
      navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
      )
    ) {
      (<any>$('#rulespopup')).modal('show');
    } else {
      $('#rulespopup [data-bs-dismiss=modal]').trigger('click');
    }
  }

  closerulespopup() {
    this.showrule = false;
    $('#casino-vieo-rules').fadeOut();
  }

  showstatic() {
    this.check = !this.check;
  }

  ngOnDestroy(): void {
    this.openBet = null;
    this.shareService.shareBetSlipData(null);
    if (this.BetSlipSubscription) {
      this.BetSlipSubscription.unsubscribe();
    }
    if (this.casinoSubscription) {
      this.casinoSubscription.unsubscribe();
    }
  }

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 300,
      behavior: 'smooth',
    });
  }
  public scrollRight2(): void {
    this.widgetsContent2.nativeElement.scrollTo({
      left: this.widgetsContent2.nativeElement.scrollLeft + 300,
      behavior: 'smooth',
    });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 300,
      behavior: 'smooth',
    });
  }
  public scrollLeft2(): void {
    this.widgetsContent2.nativeElement.scrollTo({
      left: this.widgetsContent2.nativeElement.scrollLeft - 300,
      behavior: 'smooth',
    });
  }

  myclass = {};
}

// this.casinoList = [
// {"category":"Teenpatti" "tableName": "TP2020", "tableId": "-11", "oddsUrl": "/d_rate/teen20", "resultUrl": "/l_result/teen20", "scoreUrl": null, "streamUrl": ":8015/" },
// {"category":"Teenpatti" "tableName": "TP1Day", "tableId": "-12", "oddsUrl": "/d_rate/teen", "resultUrl": "/l_result/teen", "scoreUrl": null, "streamUrl": ":8001/" },
// {"category":"Teenpatti" "tableName": "TPTest", "tableId": "-13", "oddsUrl": "/d_rate/teen9", "resultUrl": "/l_result/teen9", "scoreUrl": null, "streamUrl": ":8002/" },
// {"category":"Teenpatti" "tableName": "TPOpen", "tableId": "-14", "oddsUrl": "/d_rate/teen8", "resultUrl": "/l_result/teen8", "scoreUrl": null, "streamUrl": ":8003/" },

// { "tableName": "TPOpen", "tableId": "-14", "oddsUrl": "/d_rate/teen8", "resultUrl": "/l_result/teen8", "scoreUrl": null, "streamUrl": ":8003/" },
// { "tableName": "TPTest", "tableId": "-13", "oddsUrl": "/d_rate/teen9", "resultUrl": "/l_result/teen9", "scoreUrl": null, "streamUrl": ":8002/" },
// { "tableName": "Baccarat", "tableId": "-9", "oddsUrl": "/d_rate/baccarat", "resultUrl": "/l_result/baccarat", "scoreUrl": null, "streamUrl": ":8022/" },
// { "tableName": "Baccarat2", "tableId": "-9", "oddsUrl": "/d_rate/baccarat2", "resultUrl": "/l_result/baccarat2", "scoreUrl": null, "streamUrl": ":8023/" },
// { "tableName": "AB", "tableId": "-5", "oddsUrl": "/d_rate/ab20", "resultUrl": "/l_result/ab20", "scoreUrl": null, "streamUrl": ":8010/" },
// { "tableName": "AB2", "tableId": "-4", "oddsUrl": "/d_rate/abj", "resultUrl": "/l_result/abj", "scoreUrl": null, "streamUrl": ":8019/" },
// { "tableName": "3CardsJud", "tableId": "-23", "oddsUrl": "/d_rate/3cardj", "resultUrl": "/l_result/3cardj", "scoreUrl": null, "streamUrl": ":8016/" },
// { "tableName": "CasinoMeter", "tableId": "-16", "oddsUrl": "/d_rate/cmeter", "resultUrl": "/l_result/cmeter", "scoreUrl": null, "streamUrl": ":8018/" },
// { "tableName": "Cricket2020", "tableId": "-15", "oddsUrl": "/d_rate/cmatch20", "resultUrl": "/l_result/cmatch20", "scoreUrl": null, "streamUrl": ":8031/" },
// { "tableName": "DT2", "tableId": "-52", "oddsUrl": "/d_rate/dt202", "resultUrl": "/l_result/dt202", "scoreUrl": null, "streamUrl": ":8020/" },
// { "tableName": "Race2020", "tableId": "-60", "oddsUrl": "/d_rate/race20", "resultUrl": "/l_result/race20", "scoreUrl": null, "streamUrl": ":8029/" },
// { "tableName": "CasinoQueen", "tableId": "-70", "oddsUrl": "/d_rate/queen", "resultUrl": "/l_result/queen", "scoreUrl": null, "streamUrl": ":8028/" },
// { "tableName": "WorliMatka", "tableId": "-21", "oddsUrl": "/d_rate/worli", "resultUrl": "/l_result/worli", "scoreUrl": null, "streamUrl": ":8004/" },
// { "tableName": "5FiveCricket", "tableId": "-3", "oddsUrl": "/d_rate/cricketv3", "resultUrl": "/l_result/cricketv3", "scoreUrl": null, "streamUrl": ":8030/" },
// { "tableName": "InstantWorli", "tableId": "-22", "oddsUrl": "/d_rate/worli2", "resultUrl": "/l_result/worli2", "scoreUrl": null, "streamUrl": ":8005/" }
// ];
