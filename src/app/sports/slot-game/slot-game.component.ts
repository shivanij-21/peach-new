import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { MainService } from 'src/app/services/main.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-slot-game',
  templateUrl: './slot-game.component.html',
  styleUrls: ['./slot-game.component.css']
})
export class SlotGameComponent implements OnInit {

  slotUrl: SafeResourceUrl;
  gameId: string;
  uid: string;
  gameCode: string;
  providerCode: string;
  token: string;
  accountInfo: any;

  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private apiService: CasinoApiService,
    private main: MainService) {

  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.main.apis$.subscribe((res) => {
        $('#page_loading').css('display', 'block');
        this.UserDescription();
      });
    } else {

    }




this.route.params.subscribe(params => {
  this.gameId = params['gameId'];
  let authData = { "gameId": this.gameId, "userName": this.accountInfo.userName };

  this.apiService.openGames(authData).subscribe((resp: any) => {
    // resp = { "errorCode": 0, "errorDescription":"", "gameId": "8125", "url": "https://static-cdns.com/resources/xgames/firekirin/arcoftemplar_2016/index.html?nogslang=EN&nogscurrency=USD&lobbyurl=cricbuzzer.io&sessionid=8a74fdf67b403b0424c4a0156a0672e89979c9dd%2F65d87f286db404b90480&countrycode=EN&locale=en_GB&nogssocket=wss%3A%2F%2Fws.staticfirekirin.com%2Fwss2016&nogsid=2233790" }
    if (resp.errorCode == 0) {
      console.log(resp.url, "resp.url");
      this.slotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.url);
    }

    $('#page_loading').css('display', 'none');
  })
})

}

UserDescription() {
  this.accountInfo = this.tokenService.getUserInfo();

}
}
