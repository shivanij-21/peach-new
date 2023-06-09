import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loader = true;
  timeout: number | undefined;
  isLogin: boolean =false;
  
  constructor(   private tokenService: TokenService,) { 
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    setTimeout(() => {
      clearTimeout(this.timeout);
      this.loader = false;
    }, 1500);
  }

  ngOnInit(): void {
  }

}
