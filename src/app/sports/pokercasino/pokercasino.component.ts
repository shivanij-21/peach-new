import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-pokercasino',
  templateUrl: './pokercasino.component.html',
  styleUrls: ['./pokercasino.component.css']
})
export class PokercasinoComponent implements OnInit {
  pokerUrl:SafeResourceUrl;
  accountInfo: any;

  constructor(
    private tokenService: TokenService,
    private casinoapiService: CasinoApiService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.accountInfo = this.tokenService.getUserInfo();
    this.getPokerLobby();
  }

  ngOnDestroy():void{
    this.quitPoker();
  }

  getPokerLobby(){
    $('#page_loading').css('display', 'block');
    let authData = {
      "userName":this.accountInfo.userName,
      "userId":this.accountInfo.userId
    }
    this.casinoapiService.pokerAuth(authData).subscribe((resp: any)=>{
      // console.log(resp);
      if(resp.errorCode==0){
        this.pokerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.lobbyUrl);
      }
      $('#page_loading').css('display', 'none');
    })
  }

  quitPoker(){
    $('#page_loading').css('display', 'block');
    let authData = {
      "userName":this.accountInfo.userName,
      "userId":this.accountInfo.userId
    }
    this.casinoapiService.pokerQuit(authData).subscribe((resp: any)=>{
      // console.log(resp);
      $('#page_loading').css('display', 'none');
    })
  }


}
