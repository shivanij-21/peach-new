import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-awc',
  templateUrl: './awc.component.html',
  styleUrls: ['./awc.component.css']
})
export class AwcComponent implements OnInit {

  constructor(
    private casino: CasinoApiService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.AWCList();
    this.accountInfo = this.tokenService.getUserInfo();

    this.casino.search.subscribe((val:any)=>{
      this.searchKey = val;
    })
  }


  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;
  public searchTerm: string = '';
  searchKey : string = "";

  accountInfo: any;
  awccasinoList = [
    {
      platform: 'E1SPORT',
      gameType: 'ESPORTS',
      gameCode: 'E1-ESPORTS-001',
      gameName: 'eSports',
    },
    {
      platform: 'SV388',
      gameType: 'LIVE',
      gameCode: 'SV-LIVE-001',
      gameName: 'CockFight',
    },
    {
      platform: 'SEXYBCRT',
      gameType: 'LIVE',
      gameCode: 'MX-LIVE-001',
      gameName: 'Baccarat Classic',
    },
    {
      platform: 'KINGMAKER',
      gameType: 'SLOT',
      gameCode: 'KM-SLOT-001',
      gameName: 'Sugar Blast',
    },
    {
      platform: 'JILI',
      gameType: 'FH',
      gameCode: 'JILI-FISH-001',
      gameName: 'Royal Fishing',
    },
    {
      platform: 'HORSEBOOK',
      gameType: 'LIVE',
      gameCode: 'HRB-LIVE-001',
      gameName: 'Horsebook',
    },
    {
      platform: 'JDBFISH',
      gameType: 'FH',
      gameCode: 'JDB-FISH-002',
      gameName: 'CaiShenFishing',
    },
    {
      platform: 'JDB',
      gameType: 'SLOT',
      gameCode: 'JDB-SLOT-001',
      gameName: 'Burglar',
    },
    {
      platform: 'FC',
      gameType: 'EGAME',
      gameCode: 'FC-EGAME-001',
      gameName: 'MONEY TREE DOZER',
    },
    {
      platform: 'FASTSPIN',
      gameType: 'SLOT',
      gameCode: 'FastSpin-SLOT-001',
      gameName: 'Royale House',
    },
    {
      platform: 'LUCKYPOKER',
      gameType: 'TABLE',
      gameCode: 'LUCKYPOKER-TABLE-001',
      gameName: 'Gao Gae',
    },
    {
      platform: 'LUDO',
      gameType: 'TABLE',
      gameCode: 'LUDO-TABLE-001',
      gameName: 'LUDO',
    },
    {
      platform: 'PG',
      gameType: 'SLOT',
      gameCode: 'PG-SLOT-001',
      gameName: 'Honey Trap of Diao Chan',
    },
    {
      platform: 'PP',
      gameType: 'LIVE',
      gameCode: 'PP-LIVE-001',
      gameName: 'Baccarat 1',
    },
    {
      platform: 'PT',
      gameType: 'LIVE',
      gameCode: 'PT-LIVE-001',
      gameName: 'Baccarat',
    },
    {
      platform: 'RT',
      gameType: 'SLOT',
      gameCode: 'RT-SLOT-001',
      gameName: 'AncientScript',
    },
    {
      platform: 'SABA',
      gameType: 'VIRTUAL',
      gameCode: 'SABA-VIRTUAL-001',
      gameName: 'Virtual Sports',
    },
    {
      platform: 'FASTSPIN',
      gameType: 'SLOT',
      gameCode: 'FastSpin-SLOT-021',
      gameName: 'Oceanic Melodies',
    },
    {
      platform: 'SPADE',
      gameType: 'EGAME',
      gameCode: 'SG-EGAME-001',
      gameName: 'DerbyExpress',
    },
    {
      platform: 'VENUS',
      gameType: 'LIVE',
      gameCode: 'VN-LIVE-001',
      gameName: 'Baccarat Classic',
    },
    {
      platform: 'YESBINGO',
      gameType: 'BINGO',
      gameCode: 'YesBingo-BINGO-001',
      gameName: 'WinCaiShen',
    },
    {
      platform: 'YL',
      gameType: 'EGAME',
      gameCode: 'YL-EGAME-002',
      gameName: 'Gold Shark',
    },
  ];
  listawc: {
    platform: string;
    gameType: string;
    gameCode: string;
    gameName: string;
  };
  status: boolean = false;
  AWClists: any;
  awclists: any;
  data: any[];
  awcGames: any;

  AWCList() {
    this.casino.awclist().subscribe((resp: any) => {
      this.AWClists = resp.result;
      //  console.log(this.AWClists);
    });
  }
  AWCFilter(filter) {
    // console.log(filter.Games);
    this.awcGames = filter.Games;
    // console.log(this.awcGames);
  }

  openAWC(gameType: any, platform: any, gameCode: any) {
    let data = {
      userName: this.accountInfo.userName,
      gameType: gameType,
      isMobile: true,
      externalUrl: window.origin,
      platform: platform,
      gameCode: gameCode,
    };
    this.casino.awcAuth(data).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        window.open(resp.url, '_self');
      } else {
        alert(resp.errorDescription);
      }
    });
  }

  public scrollRight(): void {
    this.tab.nativeElement.scrollTo({
      left: this.tab.nativeElement.scrollLeft + 200,
      behavior: 'smooth',
    });
  }

  public scrollLeft(): void {
    this.tab.nativeElement.scrollTo({
      left: this.tab.nativeElement.scrollLeft - 200,
      behavior: 'smooth',
    });
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    // console.log(this.searchTerm);
    this.casino.search.next(this.searchTerm);
  }

  clickEvent() {
    this.status = !this.status;
  }

}
