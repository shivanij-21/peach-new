import { ClientApiService } from './../services/client-api.service';
import { TokenService } from 'src/app/services/token.service';
import { NavigationStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { MustMatch } from '../helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { UserloginService } from '../services/userlogin.service';
import { DataFormatsService } from '../services/data-formats.service';
import { ShareDataService } from '../services/share-data.service';
import { ScoreService } from '../services/score.service';
import { SportsApiService } from '../services/sports-api.service';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  result: any;
  Loginform!: FormGroup;
  origin = environment.origin;
  submitted: boolean = false;
  login: boolean = false;
  isopen: boolean = false;
  isopen1: boolean = false;
  isnotopen: boolean = false;
  showmore: boolean = false;
  showDropDown: boolean = false;
  ishomebutton: boolean = false;
  sidebar: boolean = false;
  accountInfo: any;
  fundInfo: any;
  gettoken: any;
  isLogin: boolean = false;
  isGameApiCall = true;
  allScoresData: any = [];
  stakeSettingData: any;
  intervalSub: any;
  // login1=false

  constructor(
    private userlogin: UserloginService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private clientApi: ClientApiService,
    private scoreService: ScoreService,
    private sportsAPi: SportsApiService,
    private tokenService: TokenService,
    private main:MainService,
    private token: TokenService // private UserloginService: UserloginService, // private ClientApiService: ClientApiService
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
      // console.log(this.isLogin)
    }
    if (this.router.url.indexOf('/sports') > -1) {
      this.isopen = true;
      this.isnotopen = false;
      this.ishomebutton = true;
      this.sidebar = true;
    } else if (this.router.url.indexOf('/cardmeter') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/casino') > -1) {
      this.isopen = true;
    } else if (this.router.url.indexOf('/fullmarkets') > -1) {
      this.isopen = true;
    } else if (this.router.url.indexOf('/slot') > -1) {
      this.isopen = true;
    }
    else if (this.router.url.indexOf('/Fantasy') > -1) {
      this.isopen = true;
    }
    else if (this.router.url.indexOf('/faq') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/account-statement') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/currentt-bets') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/activity') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/casinoresult') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/bet-history') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/profit-loss') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/securityauth') > -1) {
      this.isopen1 = true;
    } else if (this.router.url.indexOf('/') > -1) {
      this.isnotopen = true;
    } else {
      this.ishomebutton = false;
      this.sidebar = false;
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

    this.UserDescription();
    this.initform();
    // $(document).on('show.bs.modal', '.modal', function () {
    //   $(this).appendTo('body');
    // });

  }

  initform() {
    this.Loginform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['0000', Validators.required],
      log: ['0000', Validators.required],
      origin: [this.origin, Validators.required],
    });
  }

  get username() {
    return this.Loginform.get('username');
  }
  get password() {
    return this.Loginform.get('password');
  }

  // login(){
  //   this.login1=!this.login1
  // }

  get f() {
    return this.Loginform.controls;
  }

  openBetsBtn() {
    var V = $('#opensidebarSlide');
    var W = V.find('#sidebarSlide');
    // console.log(V);

    $('#openSidebar')
      .unbind('click')
      .click(function () {
        V.show();
        W.css('display', 'flex');
        W.addClass('left-in');

        window.setTimeout(function () {
          W.removeClass('left-in');
        }, 1000);
      });

    $('#close').bind('click', function () {
      V.fadeOut();
    });
  }

  ngAfterViewInit() {
    this.openBetsBtn();
  }

  Login() {
    this.login = true;
    this.result = '';
    // stop here if form is invalid
    if (this.Loginform.invalid) {
      return;
    }
    // console.log(this.loginForm.value);
    this.userlogin.login(this.Loginform.value).subscribe((data: any) => {
      this.result = data.result;

      // data = {
      //   errorCode: 0,
      //   errorDescription: null,
      //   result: [
      //     {
      //       userId: 368943,
      //       userStatus: 0,
      //       parentId: 367295,
      //       userName: 'Super01',
      //       name: '',
      //       balance: 94790.7,
      //       token: 'DC89E572B500EBDA81B55498AC8B2C14',
      //       loginTime: '1/5/2023 1:24:45 PM',
      //       conversion: 1.0,
      //       creditRef: 100000.0,
      //       userType: 8,
      //       rules: 'PHA+c3M8L3A+',
      //       currencyCode: 'INR',
      //       stakeSetting:
      //         '100,500,1000,5000,10000,25000,50000,100000,200000,500000',
      //       newUser: 0,
      //     },
      //   ],
      // };

      // console.log(data, 'response');
      if (data.errorCode === 0) {
        this.toastr.success('Login Successfully');
        $('#exampleModal [data-bs-dismiss=modal]').trigger('click');
        // console.log(data.result[0].token)
        this.router.navigate(['/sports']);
        this.token.setToken(data.result[0].token);
        this.gettoken = this.token.getToken();
        // console.log(this.gettoken, 'gettoken');
        this.token.setUserInfo(data.result[0]);
        // localStorage.setItem("mydata", JSON.stringify(this.result));
        // this.loginForm.reset();
        this.login = false;
      } else {
        this.toastr.error(data.errorDescription);
        $('#exampleModal [data-bs-dismiss=modal]').trigger('click');
      }
    }
    );
  }

  onclick1() {
    this.showmore = !this.showmore;
  }

  showDrop() {
    this.showDropDown = !this.showDropDown;
  }

  logout() {
    this.userlogin.logout().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.token.removeToken();
      }
    });
    this.token.removeToken();
  }

  UserDescription() {
    this.accountInfo = this.token.getUserInfo();

    // console.log(this.accountInfo)
  }


  openLoginForm() {
    $('#log').fadeIn();
  }

  closeLoginForm() {
    $('#log').fadeOut();
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
