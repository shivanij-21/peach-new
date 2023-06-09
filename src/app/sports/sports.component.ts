import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { MainService } from '../services/main.service';
import { ScoreService } from '../services/score.service';
import { ShareDataService } from '../services/share-data.service';
import { SportsApiService } from '../services/sports-api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {



  isGameApiCall = true;
  isIcasino: boolean = environment.isIcasino;
  allScoresData: any = [];
  isLogin: boolean = false;
  intervalSub: any;
  stakeSettingData: any;


  constructor(
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
    $(document).on('click', 'username-info', function () {
      $('.user-dropdown').toggleClass("show");
    })
    // $('.modal').modal('hide');
    //   $('body').removeClass('modal-open');
    // $('.modal-backdrop').remove();

  }


}
