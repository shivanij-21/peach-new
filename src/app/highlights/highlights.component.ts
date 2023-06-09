import { ClientApiService } from './../services/client-api.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserloginService } from '../services/userlogin.service';
import { ShareDataService } from '../services/share-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CasinoApiService } from '../services/casino-api.service';
import { MainService } from '../services/main.service';
import { DataFormatsService } from '../services/data-formats.service';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.css'],
})
export class HighlightsComponent implements OnInit {
  showDropDown: boolean = false;
  containerView: any;
  ishomebutton: boolean = false;
  showmore: boolean = false;
  uid: any;
  result: boolean = false;
  userInfo: any;
  activeEventId: any;
  accountInfo: any;
  fundInfo: any;
  balanceApi: any;
  msg: any;
  data: any;
  isLogin: boolean = false;
  submitted: boolean = false;
  isChangePassword: boolean = false;
  ChangePwdForm: FormGroup;
  StakeSettingForm: FormGroup;
  BetStakeSubscription: Subscription;
  stakeSettingData: any = {};
  isStakeEdited: boolean = false;
  pingPending: boolean = false;
  isClicked: boolean = true;
  OneClickBet: any = {
    isConfirmOneClickBet: false,
    isOneClickBet: false,
    oneClickBetStakeIndex: 0
  }
  listBetsPending: boolean = false;
  sportSubscription!: Subscription;
  sportList: any = [];
  fundInterval;

  constructor(
    private token: TokenService,
    private router: Router,
    private news: UserloginService,
    private ClientApiService: ClientApiService,
    private userlogin: UserloginService,
    private shared: ShareDataService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private casinoapiService: CasinoApiService,
    private main: MainService,
    private dfService :DataFormatsService
  ) {
    if (this.router.url.indexOf('/Fantasy') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/faq') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/account-statement') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/currentt-bets') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/activity') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/bet-history') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/profit-loss') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/poker-report') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/slot-report') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/slot-profit-loss-report') > -1) {
      this.containerView = 'header-casino';
    }
    else if (this.router.url.indexOf('/sn-report') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/casinoresult') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/livecasinobets') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/securityauth') > -1) {
      this.containerView = 'header-casino';
    } else if (this.router.url.indexOf('/sports') > -1) {
      this.ishomebutton = true;
    }
    if (this.token.getToken()) {
      this.isLogin = true;
    }

    if (this.isLogin) {
      this.shareService.activeMatch.subscribe(data => {
        this.activeEventId = data;
      })

      if (!this.dfService.getOneClickSetting()) {
        this.dfService.saveOneClickSetting(this.OneClickBet);
      } else {
        // this.OneClickBet = JSON.parse(this.dfService.getOneClickSetting());
      }
      this.main.apis$.subscribe((res) => {
        // this.myMarketMatch();
        this.UserDescription();
        this.QuitCasino(null);
        this.FundExpo(null);
        this.listBets();
        this.sportWise();
        this.shareService.updateFundExpo$.subscribe(data => {
          if (data == 'event') {
            this.FundExpo('refresh');
            this.listBets();
          } else if (data) {
            this.fundInfo = data[3][0];
            let allbets = this.dfService.matchUnmatchBetsMarketWise(data[2]);
            this.shareService.shareListBets(allbets);
          }
          // this.FundExpo('refresh');
          // this.listBets();
        })
      });

      this.fundInterval = setInterval(() => {
        this.FundExpo(null);
      }, 60000)
    } else {
      this.sportWise();
    }
  }

  ngOnInit(): void {
    this.getLocalUserInfo();
    this.marquee();
    this.initChangePwdForm();
    this.GetBetStakeSetting();
  }

  initChangePwdForm() {
    this.ChangePwdForm = this.fb.group(
      {
        pwd: ['', Validators.required],
        newpwd: ['', [Validators.required]],
        retypepwd: ['', Validators.required],
        context: ['Web'],
      },
      {
        validator: MustMatch('newpwd', 'retypepwd'),
      }
    );
  }
  get fc() {
    return this.ChangePwdForm.controls;
  }
  get pwd() {
    return this.ChangePwdForm.get('pwd');
  }
  get newpwd() {
    return this.ChangePwdForm.get('newpwd');
  }
  get retypepwd() {
    return this.ChangePwdForm.get('retypepwd');
  }

  ChangePwd() {
    this.submitted = true;
    if (!this.ChangePwdForm.valid) {
      return;
    }
    this.isChangePassword = true;

    this.userlogin
      .changePassword(this.ChangePwdForm.value)
      .subscribe((res: any) => {
        if (res.errorCode == 0) {
          this.toastr.success('Password updated successfull');
          // console.log(this.toastr ,"toastr");

          this.router.navigate(['/']);
          // this.toastr.successMsg(resp.errorDescription);
          // this.tokenService.removeToken();
          this.submitted = false;
          this.isChangePassword = false;
        } else {
          this.toastr.error(res.errorDescription);
          this.result = res.errorDescription;
          this.submitted = false;
          this.isChangePassword = false;
        }
      });
  }

  logout() {
    this.userlogin.logout().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.token.removeToken();
        // console.log("remove token")
      }
    });
    this.token.removeToken();
  }

  showDrop() {
    this.showDropDown = !this.showDropDown;
  }

  onclick1() {
    // this.showmore = !this.showmore;
    this.shared.sendMessage(!this.showmore);
  }

  getLocalUserInfo() {
    this.balanceApi = this.token.getUserInfo();
    // console.log(this.balanceApi, 'old');
  }

  marquee() {
    this.news.news().subscribe((data: any) => {
      this.data = data;
    });
  }

  initStakeSettingForm(data: any) {
    this.StakeSettingForm = this.fb.group({
      stake1: [
        data?.stake1,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake2: [
        data?.stake2,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake3: [
        data?.stake3,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake4: [
        data?.stake4,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake5: [
        data?.stake5,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake6: [
        data?.stake6,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake7: [
        data?.stake7,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake8: [
        data?.stake8,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake9: [
        data?.stake9,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake10: [
        data?.stake10,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      stake11: [
        data?.stake11 ? data?.stake11 : 1000,
        [Validators.pattern('^[0-9]*$'), Validators.maxLength(10)],
      ],
      stake12: [
        data?.stake12 ? data?.stake12 : 2000,
        [Validators.pattern('^[0-9]*$'), Validators.maxLength(10)],
      ],
    });
  }

  get f() {
    return this.StakeSettingForm.controls;
  }

  GetBetStakeSetting() {
    this.BetStakeSubscription = this.shareService.stakeButton$.subscribe(
      (data: any) => {
        if (data != null) {
          this.stakeSettingData = {};
          data?.forEach((element: any, index: any) => {
            this.stakeSettingData['stake' + (index + 1)] = element;
          });

          // console.log("setting",this.stakeSettingData)

          this.initStakeSettingForm(this.stakeSettingData);
        }
      }
    );
  }

  SaveBetStakeSetting() {
    // console.log("stake form ",this.StakeSettingForm)
    if (!this.StakeSettingForm.valid) {
      return;
    }
    let stakeArray: any[] = [];
    for (let i = 1; i <= 12; i++) {
      stakeArray.push(parseInt(this.StakeSettingForm.value['stake' + i]));
    }

    this.ClientApiService.stakeSetting(stakeArray.toString()).subscribe(
      (resp: any) => {
        if (resp.errorCode == 0) {
          let accountInfo = this.tokenService.getUserInfo();
          if (accountInfo.stakeSetting) {
            accountInfo.stakeSetting = stakeArray.toString();
          }
          console.log(stakeArray);

          this.shareService.shareStakeButton(stakeArray);
          this.tokenService.setUserInfo(accountInfo);
          this.toastr.success('Stake value saved');
          this.settingClose();
        } else {
          this.toastr.error('Something went wrong');
        }
      },
      (err) => {
        // console.log("err stae",err);
        this.toastr.error('Error Occured');
      }
    );
  }

  editStake() {
    $('#stakeSet').css('display', 'none');
    $('#editCustomizeStakeList').css('display', 'block');
    this.isStakeEdited = true;
  }
  editStakeClosed() {
    $('#editCustomizeStakeList').css('display', 'none');
    $('#stakeSet').css('display', 'block');
    this.isStakeEdited = false;
  }

  settingClose() {
    $('#editCustomizeStakeList').css('display', 'none');
    $('#stakeSet').css('display', 'block');
    this.initStakeSettingForm(this.stakeSettingData);
    var s = $('#set_pop');

    // s.fadeOut();
    s.css('display', 'none');
    this.isStakeEdited = false;
  }

  ngOnDestroy() {
    if (this.BetStakeSubscription) {
      this.BetStakeSubscription.unsubscribe();
    }
  }

  sportWise() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);
        // console.log(this.sportList ,"list");
        // this.sportList.forEach(element => {

        // })
      }
    });
  }

  listBets() {
    if (this.listBetsPending) {
      return;
    }
    this.listBetsPending = true;
    this.ClientApiService.listBets().subscribe((resp: any) => {
      // console.log(resp);
      if (resp.errorCode == 0) {
        let allbets = this.dfService.matchUnmatchBetsMarketWise(resp.result);
        // console.log(allbets);

        this.shareService.shareListBets(allbets);
      }
      this.listBetsPending = false;
    }, err => {
      this.listBetsPending = false;
    })
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

    // console.log(this.accountInfo)
  }

  QuitCasino(isdata) {
    // if (this.siteName == 'cricbuzzer' || this.siteName == 'runbet' || this.siteName == 'sports365' || this.siteName == 'lc247' || this.siteName == 'wskyexch' || this.siteName == 'nayaludis' || this.siteName == 'ninewicket') {
    this.ClientApiService.QuitCasino(
      this.accountInfo.userName,
      this.accountInfo.userId
    ).subscribe(
      (resp: any) => {
        // console.log(resp);
        if (resp?.errorCode == 0) {
        }
        setTimeout(() => {
          if (!isdata) {
            this.FundExpo(null);
          }
        }, 500);
      },
      (err) => {}
    );
    // }
  }

  quitPoker() {
    let authData = {
      userName: this.accountInfo.userName,
      userId: this.accountInfo.userId,
    };
    this.casinoapiService.pokerQuit(authData).subscribe((resp: any) => {
      // console.log(resp);
    });
  }

  FundExpo(isdata: any) {
    if (this.pingPending) {
      return;
    }
    this.pingPending = true;
    if (isdata) {
      this.QuitCasino(isdata);

      this.isClicked = this.pingPending;
    }

    if (!this.router.url.includes('/pokercasino')) {
      this.quitPoker();
    }

    this.ClientApiService.balance(this.activeEventId).subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.fundInfo = resp.result[0];
      }

      this.pingPending = false;
      this.isClicked = this.pingPending;
    });
  }

  trackByEvent(index: number, item: any) {
    return item.eventId;
  }
}
