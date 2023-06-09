import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserloginService } from 'src/app/services/userlogin.service';
import { TokenService, USER_INFO } from './../../services/token.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { Subscription } from 'rxjs';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import * as _ from 'lodash';
import { RacingApiService } from 'src/app/services/racing-api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  result!: string;
  ishomebutton: boolean = false;
  sidebar: boolean = false;
  value1: boolean = false;
  changePassForm!: FormGroup;
  submitted: boolean = false;
  isChangePassword: boolean = false;
  showmore: boolean = false;
  showDropDown: boolean = false;
  // result: any;
  sportsData: any;
  inplaycount: any;

  sportList: any = [];
  sportsName: any;
  selectedSport: any;
  tourList: any = [];
  competitionName: any;
  selectedTour: any;
  matchList: any = [];
  selectedMatch: any;
  marketList: any = [];
  selectedMarket: any;
  listMeetingPending: boolean = false;


  sportSubscription!: Subscription;
  tourListLength: any;
  todayRaces: never[];
  horseracing: any;

  isLi1Active = false;
  isLi2Active = false;
  raceid: any;
  searchResult :any = [];
  searchText: string = "";
  eventsList :any = [];


  constructor(public router: Router, private token: TokenService,
    private fb: FormBuilder, private UserLogin: UserloginService,
    private shareService: ShareDataService,
    private dfService: DataFormatsService,
    private racingApi: RacingApiService,
    private Myaccountservice: UserloginService,
    private UserloginService: UserloginService
  ) {
    this.listMeetings();

    if (this.router.url.indexOf('/sports') > -1) {
      this.ishomebutton = true
      this.sidebar = true
    } else {
      this.ishomebutton = false
      this.sidebar = false
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf('/sports') > -1) {
          this.ishomebutton = true
        }
        else {
          this.ishomebutton = false
        }
      }
    })


  }
  ngOnInit(): void {
    this.SearchEvents();
    this.shareService.callMenu.subscribe((res) => {
      this.showmore = res;
    })

    // $(document).on('show.bs.modal', '.modal', function () {
    //   $(this).appendTo('body');
    // });
    this.GetSportsData()
  }

  SearchEvents() {
    this.sportSubscription = this.shareService.listGamesData$.subscribe(resp => {
      if (resp) {
        // getting all events name whit other data in object
        this.eventsList = resp
        // console.log("search event",this.eventsList)
      }
    })
  }


  keyupSearch(event) {
    this.searchResult = [];
    if (this.searchText.length >= 3) {
      _.forEach(this.eventsList, (element, index) => {
        if (element.eventName.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
          this.searchResult.push(element);
        }
      });
    }

    // console.log("searh result",this.searchResult)
  }


  onclick1() {
    // this.showmore = !this.showmore
    this.shareService.sendMessage(!this.showmore)
  }

  GetSportsData() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      // console.log(data,"data from sidebar");

      if (data != null) {
        this.sportsData = data;
        this.inplaycount = this.dfService.sportEventWise(data, 0);
        // console.log(this.inplaycount , "this.inplaycount");

        if (!this.selectedSport) {
          this.sportsWise();
        }
      }
    });
    this.shareService.activeEventType.subscribe(eventTypeId => {
      if (eventTypeId) {
        _.forEach(this.sportList, (element) => {
          if (element.eventTypeId == eventTypeId) {
            this.toursWise(element);
          }
        });

      } else {
        this.sportsWise();
      }
    })
  }
  sportsWise() {
    this.selectedSport = null;
    this.selectedTour = null;
    // this.sportList = this.dfService.sportsWise(this.sportsData);
    this.sportList = this.dfService.sportEventWise(this.sportsData, 0);
    // console.log("sportList",this.sportList);


    this.closePathPop();
  }
  toursWise(sport: any) {
    this.selectedTour = null;
    if (this.selectedSport && sport.id == this.selectedSport.id) {
      this.selectedSport = null;
      return;
    }
    this.selectedSport = sport;
    // console.log(this.selectedSport);

    this.sportsName = sport.sportsName;
    this.tourList = this.dfService.toursWise(this.sportsData[sport.eventTypeId]);
    this.tourListLength = this.tourList.length
    // console.log("length",this.tourList);
    // console.log("selectedSport",this.selectedSport);


    // this.closePathPop();
  }
  matchesWise(tour: any) {
    if (this.selectedTour && tour.id == this.selectedTour.id) {
      this.selectedTour = null;
      return;
    }
    this.selectedTour = tour;
    this.competitionName = tour.competitionName;
    this.matchList = this.dfService.matchesWise(this.sportsData[this.selectedSport.eventTypeId].tournaments[tour.competitionId]);
    this.closePathPop();
    // console.log(this.matchList);

  }


  listMeetings() {
    if (this.listMeetingPending) {
      return
    }
    this.listMeetingPending = true;
    this.todayRaces = [];
    this.racingApi.listMeetings(this.raceid).subscribe((resp: any) => {
      // console.log("country code horseracing",resp );
      this.horseracing = resp

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
  data(data: any) {
    throw new Error('Method not implemented.');
  }


  toggleFavourite(event: any) {
    // this.dfService.ToggleFavourite(event.mtBfId, false);
  }

  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }
  trackByTour(index: number, item: any) {
    return item.competitionId;
  }

  trackByEvent(index: number, item: any) {
    return item.bfId;
  }



  onClickedOutside(e: Event, data: any) {
    // console.log('Clicked outside:', e);
    $("#path-pop").css('display', 'none');

  }
  togglePathPop() {
    $('#path-pop').toggle();
  }
  closePathPop() {
    $('#path-pop').css('display', 'none');
  }



  selectLi(racingid: number): void {
    this.raceid = racingid
    this.listMeetings()
    if (racingid === 7) {
      this.isLi1Active = !this.isLi1Active;
      this.isLi2Active = false;
    }
    else if (racingid === 4339) {
      this.isLi1Active = false;
      this.isLi2Active = !this.isLi2Active;
    }

  }


}


