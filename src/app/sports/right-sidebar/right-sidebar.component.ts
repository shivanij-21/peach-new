import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { MainService } from 'src/app/services/main.service';
import { ClientApiService } from 'src/app/services/client-api.service';
import { ActivatedRoute } from '@angular/router';
import { CasinoApiService } from 'src/app/services/casino-api.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']           
})
export class RightSidebarComponent implements OnInit {
  casinoList = [
    
    { category: "Teenpatti", tableName: "TP2020", tableId: "-11", oddsUrl: "/d_rate/teen20", resultUrl: "/l_result/teen20", scoreUrl: null, streamUrl: ":8015/" },
    { category: "Teenpatti", tableName: "TP1Day", tableId: "-12", oddsUrl: "/d_rate/teen", resultUrl: "/l_result/teen", scoreUrl: null, streamUrl: ":8001/" },
    // { category: "Teenpatti", tableName: "TPTest", tableId: "-13", oddsUrl: "/d_rate/teen9", resultUrl: "/l_result/teen9", scoreUrl: null, streamUrl: ":8002/" },
    { category: "Teenpatti", tableName: "TPOpen", tableId: "-14", oddsUrl: "/d_rate/teen8", resultUrl: "/l_result/teen8", scoreUrl: null, streamUrl: ":8003/" },

    { category: "Lucky7", tableName: "Lucky7A", tableId: "-10", oddsUrl: "/d_rate/lucky7", resultUrl: "/l_result/lucky7", scoreUrl: null, streamUrl: ":8011/" },
    { category: "Lucky7", tableName: "Lucky7B", tableId: "-10", oddsUrl: "/d_rate/lucky7eu", resultUrl: "/l_result/lucky7eu", scoreUrl: null, streamUrl: ":8017/" },

    { category: "32Cards", tableName: "32Cards", tableId: "-24", oddsUrl: "/d_rate/card32", resultUrl: "/l_result/card32", scoreUrl: null, streamUrl: ":8006/" },
    { category: "32Cards", tableName: "32CardsB", tableId: "-25", oddsUrl: "/d_rate/card32eu", resultUrl: "/l_result/card32eu", scoreUrl: null, streamUrl: ":8024/" },

    { category: "Bollywood", tableName: "AAA", tableId: "-26", oddsUrl: "/d_rate/aaa", resultUrl: "/l_result/aaa", scoreUrl: null, streamUrl: ":8013/" },
    { category: "Bollywood", tableName: "Bollywood", tableId: "-27", oddsUrl: "/d_rate/btable", resultUrl: "/l_result/btable", scoreUrl: null, streamUrl: ":8014/" },

    { category: "Poker", tableName: "Poker2020", tableId: "-20", oddsUrl: "/d_rate/poker20", resultUrl: "/l_result/poker20", scoreUrl: null, streamUrl: ":8007/" },
    { category: "Poker", tableName: "Poker1Day", tableId: "-19", oddsUrl: "/d_rate/poker", resultUrl: "/l_result/poker", scoreUrl: null, streamUrl: ":8008/" },
    { category: "Poker", tableName: "Poker6P", tableId: "-18", oddsUrl: "/d_rate/poker6", resultUrl: "/l_result/poker6", scoreUrl: null, streamUrl: ":8009/" },

    { category: "Dragon Tiger", tableName: "DT2020", tableId: "-6", oddsUrl: "/d_rate/dt20", resultUrl: "/l_result/dt20", scoreUrl: null, streamUrl: ":8012/" },
    { category: "Dragon Tiger", tableName: "DT1Day", tableId: "-7", oddsUrl: "/d_rate/dt6", resultUrl: "/l_result/dt6", scoreUrl: null, streamUrl: ":8025/" },
    { category: "Dragon Tiger", tableName: "DTL2020", tableId: "-8", oddsUrl: "/d_rate/dtl20", resultUrl: "/l_result/dtl20", scoreUrl: null, streamUrl: ":8026/" },
    // { category: "Dragon Tiger", tableName: "DT2", tableId: "-52", oddsUrl: "/d_rate/dt202", resultUrl: "/l_result/dt202", scoreUrl: null, streamUrl: ":8020/" },

    { category: "Baccarat", tableName: "Baccarat", tableId: "-9", oddsUrl: "/d_rate/baccarat", resultUrl: "/l_result/baccarat", scoreUrl: null, streamUrl: ":8022/" },
    // { category: "Baccarat", tableName: "Baccarat2", tableId: "-9", oddsUrl: "/d_rate/baccarat2", resultUrl: "/l_result/baccarat2", scoreUrl: null, streamUrl: ":8023/" },

    // { category: "Ander Bahar", tableName: "AB", tableId: "-5", oddsUrl: "/d_rate/ab20", resultUrl: "/l_result/ab20", scoreUrl: null, streamUrl: ":8010/" },
    // { category: "Ander Bahar", tableName: "AB2", tableId: "-4", oddsUrl: "/d_rate/abj", resultUrl: "/l_result/abj", scoreUrl: null, streamUrl: ":8019/" },

    { category: "3CardsJud", tableName: "3CardsJud", tableId: "-23", oddsUrl: "/d_rate/3cardj", resultUrl: "/l_result/3cardj", scoreUrl: null, streamUrl: ":8016/" },

    // { category: "Sports", tableName: "CasinoMeter", tableId: "-16", oddsUrl: "/d_rate/cmeter", resultUrl: "/l_result/cmeter", scoreUrl: null, streamUrl: ":8018/" },
    // { category: "Sports", tableName: "Cricket2020", tableId: "-15", oddsUrl: "/d_rate/cmatch20", resultUrl: "/l_result/cmatch20", scoreUrl: null, streamUrl: ":8031/" },
    // { category: "Sports", tableName: "5FiveCricket", tableId: "-3", oddsUrl: "/d_rate/cricketv3", resultUrl: "/l_result/cricketv3", scoreUrl: null, streamUrl: ":8030/" },

    // { category: "Race", tableName: "Race2020", tableId: "-60", oddsUrl: "/d_rate/race20", resultUrl: "/l_result/race20", scoreUrl: null, streamUrl: ":8029/" },

    // { category: "Queen", tableName: "CasinoQueen", tableId: "-70", oddsUrl: "/d_rate/queen", resultUrl: "/l_result/queen", scoreUrl: null, streamUrl: ":8028/" },

    // { category: "worli", tableName: "WorliMatka", tableId: "-21", oddsUrl: "/d_rate/worli", resultUrl: "/l_result/worli", scoreUrl: null, streamUrl: ":8004/" },
    // { category: "worli", tableName: "InstantWorli", tableId: "-22", oddsUrl: "/d_rate/worli2", resultUrl: "/l_result/worli2", scoreUrl: null, streamUrl: ":8005/" }
  ];
  casinodata: any;
  casinoListlist: any;
  SNcasinoList: any = [];
  providerList:any = [];
  providerCode:string="ourcasino"
  searchKey : string = "";

  public searchTerm :string = '';

  @ViewChild('myCarousel')
  myCarousel!: NguCarousel<any>;
  carouselConfig: NguCarouselConfig = {
    // grid: { xs: 4, sm: 4, md: 4, lg: 4, all: 0 },
    grid: {xs: 2, sm: 3, md: 3, lg: 7, xl:7, all: 0},
    load: 3,
    slide: 1,
    interval: { timing: 1500, initialDelay: 1000 },
    
    touch: true,
    loop:true,
    velocity: 0.2,
    vertical: {
      enabled: true,
      height: 1000
    }
    
  }
  carouselItems: any[any] = [
   
    "assets/img/1.png",
    "assets/img/2.png", 
    "assets/img/3.png", 
    "assets/img/4.png",   
    "assets/img/5.png",   
    "assets/img/6.png",   
    "assets/img/7.png",   
    "assets/img/8.png",   

  ];
  mainItems: any[] = [...this.carouselItems]


  constructor(private _cdr: ChangeDetectorRef, private ourcasino: ClientApiService, private mainService: MainService, private apiService: CasinoApiService, route: ActivatedRoute) {
    this.mainService.apis$.subscribe((res) => {
      // console.log(res);
      
      this.listCasinoTables()
    });
   }

   listCasinoTables() {
    this.ourcasino.listCasinoTables().subscribe((resp: any) => {
      this.casinoListlist = resp
      if (resp.result) {
        let casinoList: any = []
        this.casinoList.forEach(element2 => {
          resp.result[0].tables.forEach((element, index) => {
            if (element.tableName == element2.tableName) {
              casinoList.push(element2);
            }
          });
        });
        this.casinoList = casinoList
      }
    })
  }

  ngOnInit(): void {
    this.apiService.search.subscribe((val:any)=>{
      this.searchKey = val;
    })
  }
  listProviders(){
    this.apiService.listProviders().subscribe((resp: any) => {
      // console.log(resp.result);
      this.providerList = resp.result;
    })
  }


  carouselTileLoad(data: any) {
    let arr = this.carouselItems;
    this.carouselItems = [...this.carouselItems, ...this.mainItems];
  }

  ngAfterViewInit(): void {
    (<any>$('.home-casiono-icons')).flexslider({
      start: function () {
        $(".right-sidebar").addClass("active");
        $(".home-casiono-icons").resize()
      },
      namespace: "promo-",
      animation: "slide",
      direction: "vertical",
      slideshowSpeed: 4000,
      animationSpeed: 500,
      pauseOnHover: false,
      controlNav: true,
      directionNav: true,
      allowOneSlide: false,
      prevText: "",
      nextText: ""
    });
  }




  
}
