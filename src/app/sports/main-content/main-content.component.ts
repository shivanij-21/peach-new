import { data } from 'jquery';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { Subscription } from 'rxjs';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { environment } from 'src/environments/environment';
import { SportsApiService } from 'src/app/services/sports-api.service';
import { MainService } from 'src/app/services/main.service';
import { TokenService } from 'src/app/services/token.service';
import { RacingApiService } from 'src/app/services/racing-api.service';
import { ClientApiService } from 'src/app/services/client-api.service';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  sportList: any;
  eventTypeId: number;
  isAllSport: boolean = false;
  isLogin: boolean = false;
  sportSubscription!: Subscription;
  siteName: string = environment.siteName;

  casinodata: any;
  casinoListlist: any;
  SNcasinoList: any = [];
  providerList:any = [];
  providerCode:string="ourcasino"
  searchKey : string = "";
  showactivitybtn :boolean = false

  public searchTerm :string = '';

  todayRaces: any;
  nextRaces: any;
  horceracing:any

  seletedTab: string = "today";
  // eventTypeId: any;
  eventTypeName: string;
  
  listMeetingPending: boolean = false;
  public getScreenWidth: any;
  public getScreenWidth1: any;
  public getScreenHeight: any;

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent!: ElementRef<any>;

  showId :boolean = true;
  isopen = true;
  data: any;


  constructor(
    public router: Router,
    private racingApi: RacingApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private mainservice:MainService,
    private sportsapi:SportsApiService,
    private ourcasino: ClientApiService,  
    private apiService: CasinoApiService) {
      if (this.tokenService.getToken()) {
        this.isLogin = true;
      }
      this.listMeetings();
      this.route.params.subscribe(params => {
        // console.log("param",params);
        
        this.eventTypeId = params['eventTypeId'];
        if (this.eventTypeId == 7) {
          this.eventTypeName = "Horse";
        } else {
          this.eventTypeName = "Greyhound";
        }
        this.mainservice.apis$.subscribe((res) => {
          $('#page_loading').css('display', 'block');
    
   
        });

        this.mainservice.apis$.subscribe((res) => {
          // console.log(res);
          
          this.listCasinoTables()
        });
      })



      this.route.params.subscribe((params: any) => {
        // console.log("param",params);
        
        this.eventTypeId = params.eventTypeId;
  
        this.shareService.activeEventType.emit(this.eventTypeId);
        // console.log("params passing data",this.eventTypeId);
        
  
        if (this.eventTypeId) {
          this.isAllSport = false;
        }
        else {
          this.isAllSport = true;
        }
      })
  }

  listCasinoTables() {
    this.ourcasino.listCasinoTables().subscribe((resp: any) => {
      // console.log(resp);
      
      this.casinoListlist = resp
      // console.log("listcasino table content", this.casinoListlist)
    })
  }

  ngOnInit(): void {
    this.sportWise();
    // this.listgame();
    this.getScreenWidth = (window.innerWidth/2);
    this.getScreenWidth1 = (window.innerWidth);
    this.getScreenHeight = window.innerHeight
    // console.log(this.getScreenWidth);
    
      // $(document).on('click','.username-info,.user-dropdown',function(){
      // $('.user-dropdown').toggleClass("show");

      // this.gameapi.getGameinfo().subscribe((data: any) => {
      //   this.result = data;
      //   console.log("api data")
      //   console.log(this.result, "response")

      // })

    // })

    this.apiService.search.subscribe((val:any)=>{
      this.searchKey = val;
    })

    

    $(document).ready(function($) {
      var alterClass = function() {
        var ww = document.body.clientWidth;
        if (ww < 1279) {
          $('.test').removeClass('sidebar-left');
        } else if (ww >= 1280) {
          $('.test').addClass('sidebar-left');
        };
      };
      $(window).resize(function () {
        alterClass();
      });
      //Fire it when the page first loads:
      alterClass();
    });
    this.sportWise();


    if (window.innerWidth <= 768) {
       this.showId = false ;
      //  console.log(window.innerWidth);
       this.showactivitybtn =true
      }

  }
  listProviders(){
    this.apiService.listProviders().subscribe((resp: any) => {
      // console.log(resp.result);
      this.providerList = resp.result;
    })
  }

  sportWise() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      // console.log("sportSubscription",data)
      if (data != null) {
        // console.log("data is not null")
        this.sportList = this.dfService.sportEventWise(data, 0);
        // console.log("sportList",this.sportList);
        if (!this.eventTypeId) {
          this.selectHighlight(this.sportList[0], false);
        }
      }
      else {
        // console.log("data is null")
      }
    });

  }

  selectHighlight(sport: any, value: boolean) {
    this.eventTypeId = sport.id;

  }
  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }

  trackByEvent(index: number, item: any) {
    return item.eventId;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth/2;
    this.getScreenWidth1 = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }


  toggleId() {
    this.showId =true;
    this.showactivitybtn=false
  }

  horseracing(){
    this.isopen = true;
  }

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }

 


  showmore:boolean=false
  onclick1(){
    this.showmore =!this.showmore
  }

// listgame(){
//   this.gameapi.listGameinfo().subscribe((resp:any)=>{
//     console.log("list game",resp);
//     this.sportList=resp;
//     this.shareService.shareListGamesData(resp.result)
//   })
//   // console.log("api call successfully")
// }


@ViewChild('myCarousel')
myCarousel!: NguCarousel<any>;
carouselConfig: NguCarouselConfig = {
  // grid: { xs: 4, sm: 4, md: 4, lg: 4, all: 0 },
  grid: {xs: 2, sm: 2, md: 2, lg: 9, xl:9, all: 0},
  load: 2,
  slide: 2,
  interval: { timing: 2000, initialDelay: 1000 },
  touch: true,
  loop:true,
  velocity: 0.2,
  // vertical: {
  //   enabled: true,
  //   height: 1000
  // }

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
  // constructor(private _cdr: ChangeDetectorRef) { }
  carouselTileLoad(data: any) {
    let arr = this.carouselItems;
    this.carouselItems = [...this.carouselItems, ...this.mainItems];
  }


opentab(a: any){
  this.data = a;
  // console.log(this.data)
  this.listMeetings();
}


toggleFavourite(event: any) {

  if (this.isLogin) {
    // this.dfService.ToggleFavourite(event.mtBfId, false);
  } else {
   
  }
}

listMeetings() {
  if (this.listMeetingPending) {
    return
  }
  this.listMeetingPending = true;
  this.todayRaces = [];
  this.racingApi.listMeetings(this.data).subscribe((resp: any) => {
    // console.log("country code",resp );
    
    if (resp) {
      this.todayRaces = this.dfService.getRacingFormat(resp);
      // console.log(this.todayRaces, "racing");

      // if (today == "today") {
      //   this.nextRaces = this.dfService.getNextRacingFormat(resp);
      //   console.log("nextRaces",this.nextRaces);
      // }
    }
    $('#page_loading').css('display', 'none');
    this.listMeetingPending = false;
  }, err => {
    $('#page_loading').css('display', 'none');
    this.listMeetingPending = false;
  });
}

slides = [
  { img: 'assets/img/b1.jpg' },
  { img: 'assets/img/b2.jpg' },
  { img: 'assets/img/b3.jpg' },
];

slideConfig = {
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  dots:true,
};

next() {
  this.slickModal.slickNext();
}

prev() {
  this.slickModal.slickPrev();
}


}
