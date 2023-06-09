import { Component, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MainService } from '../app/services/main.service';
import * as $ from 'jquery'
import { ShareDataService } from './services/share-data.service';
import { TokenService } from '../app/services/token.service';
import { ClientApiService } from './services/client-api.service';
import { DataFormatsService } from './services/data-formats.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'peach-design';
  intervalSub;

  siteName = environment.siteName;
  stakeSettingData: any;
  isGameApiCall = true;

  constructor(private mainService:MainService,
    private clientApi: ClientApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,){

      this.getAllApi(null);

      this.intervalSub = setInterval(() => {
        this.getAllApi('data')
      }, 60000)
  

    // this.mainService.getApis().subscribe((res: any) => {
    //   this.mainService.apis$.next(res);
    // });

  }

  getAllApi(data:any) {
    this.mainService.getApis().subscribe((res: any) => {

      this.mainService.apis2$.next(res);
      if (!data) {
        this.mainService.apis$.next(data);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }
}