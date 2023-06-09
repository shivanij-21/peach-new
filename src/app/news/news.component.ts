import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserloginService } from '../services/userlogin.service';
import { ShareDataService } from '../services/share-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  data: any;
  isLogin: boolean = false;

  constructor(private news: UserloginService,private token: TokenService) {
    if (this.token.getToken()) {
      this.isLogin = false;
    }
   }

  ngOnInit(): void {
    this.marquee();
  }

  marquee() {
    this.news.news().subscribe((data: any) => {
      this.data = data
    })
  }

}
