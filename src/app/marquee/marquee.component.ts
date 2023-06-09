import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { UserloginService } from '../services/userlogin.service';
import { Subscription } from 'rxjs';
import { ShareDataService } from '../services/share-data.service';
import { DataFormatsService } from '../services/data-formats.service';
import * as _ from 'lodash';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.css']
})
export class MarqueeComponent implements OnInit {
  data: any;
  marqueeResult: any;
  selectedTab: string = 'inplay';
  sportList :any = [];
  sportSubscription: Subscription;
  isLoader:boolean = false
  isLogin:boolean=false
  

  constructor(private news: UserloginService,
    private shareService:ShareDataService,
    private dfService:DataFormatsService,private tokenService:TokenService) { 
      if (this.tokenService.getToken()) {
        this.isLogin = true;
      }
    }

  ngOnInit(): void {
    this.marquee();
    this.sportWise();
  }

  marquee() {
    this.news.news().subscribe((data:any) => {
      this.data = data;
      // console.log(data,"marquee response")
    })
  }
  sportListFilter = [
    { sportName: 'Cricket', eventTypeId: '4', isShow: true, selected: true },
    { sportName: 'Tennis', eventTypeId: '2', isShow: true, selected: true },
    { sportName: 'Soccer', eventTypeId: '1', isShow: true, selected: true }
  ];

  sportWise() {
    $('#page_loading').css('display', 'block');

    if (this.sportSubscription) {
      this.sportSubscription.unsubscribe();
    }
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.InplayTodayTomorrowEventWise(data, this.selectedTab);
        $('#page_loading').css('display', 'none');
        this.sportListIsShow();

        this.isLoader=true;
      }
    });
  }


  sportListIsShow() {
    if (this.selectedTab != 'inplay') {
      _.forEach(this.sportList, (element) => {
        _.forEach(this.sportListFilter, (element2) => {
          if (element.eventTypeId == element2.eventTypeId) {
            element['isShow'] = element2.isShow;
          }
        });
      });
    }
  }
  trackByEvent(index: number, item: any) {
    return item.eventId;
  }


}
