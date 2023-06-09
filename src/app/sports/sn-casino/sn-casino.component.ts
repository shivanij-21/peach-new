import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { MainService } from 'src/app/services/main.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sn-casino',
  templateUrl: './sn-casino.component.html',
  styleUrls: ['./sn-casino.component.css']
})
export class SnCasinoComponent implements OnInit {
  supernowaUrl:SafeResourceUrl;
  gameCode:string;
  providerCode:string;
  token1:any;
 
  constructor(private token: TokenService, private sanitizer: DomSanitizer, private route: ActivatedRoute,private apiService: CasinoApiService,
    private mainService:MainService)
    { 
    $('#page_loading').css('display', 'block');
  }

  ngOnInit(): void {
    this.token1 = this.token.getToken();
    this.mainService.apis$.subscribe((res) => {
    this.route.params.subscribe(params => {
      this.gameCode = params.gameCode;
      this.providerCode = params.providerCode;
      let authData= {"token":this.token1,"gameCode":this.gameCode,"providerCode":this.providerCode,"backUrl":"https://"+environment.domain}
      console.log(authData);
      
      this.apiService.supernowaAuth(authData).subscribe((resp: any)=>{
        console.log(resp,);
        if(resp.status.code == "SUCCESS"){
          this.supernowaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.launchURL);
        }
        $('#page_loading').css('display', 'none');
      })
    })
  })
  }


}
