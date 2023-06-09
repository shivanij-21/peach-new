import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { CarouselBannerComponent } from './carousel-banner/carousel-banner.component';
import { MarqueeComponent } from './marquee/marquee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveCasinoComponent } from './live-casino/live-casino.component';
import { FooterComponent } from './footer/footer.component';
import { WinnerComponent } from './winner/winner.component';
import { AboutUsComponent } from './footer/about-us/about-us.component';
import { TermsandconditionComponent } from './footer/termsandcondition/termsandcondition.component';
import { ResponsiblegamingComponent } from './footer/responsiblegaming/responsiblegaming.component';
import { SportsComponent } from './sports/sports.component';
import { ExchangeComponent } from './sports/exchange/exchange.component';
import { SlotComponent } from './sports/slot/slot.component';
import { FantasyComponent } from './sports/fantasy/fantasy.component';
import { SidebarComponent } from './sports/sidebar/sidebar.component';
import { SFooterComponent } from './sports/s-footer/s-footer.component';
import { MainContentComponent } from './sports/main-content/main-content.component';
import { SortByDatePipe } from './pipes/sort-by-date.pipe';

import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { RightSidebarComponent } from './sports/right-sidebar/right-sidebar.component';
import { SLiveCasinoComponent } from './sports/s-live-casino/s-live-casino.component';
import { HeaderTopComponent } from './sports/header-top/header-top.component';
import { FaqComponent } from './sports/faq/faq.component';
import { AccountStateComponent } from './sports/user-profile/account-state/account-state.component';
import { CurrentBetsComponent } from './sports/user-profile/current-bets/current-bets.component';
import { ActivityComponent } from './sports/user-profile/activity/activity.component';
import { CasinoResultComponent } from './sports/user-profile/casino-bets/casino-result.component';
import { SecurityComponent } from './sports/user-profile/security/security.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonModule } from '@angular/common';
// import {  BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { NguCarouselModule } from '@ngu/carousel';
import { HighlightsComponent } from './highlights/highlights.component';

import { CardmeterComponent } from './sports/s-live-casino/cardmeter/cardmeter.component';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './services/token.interceptor';
import { ProfitLossComponent } from './sports/user-profile/profit-loss/profit-loss.component';
import { BetHistoryComponent } from './sports/user-profile/bet-history/bet-history.component';
import { FullmarketsComponent } from './sports/fullmarkets/fullmarkets.component';
import { BetSlipComponent } from './sports/bet-slip/bet-slip.component';
import { OrderByFancyPipe } from './pipes/order-by-fancy.pipe';
import { OrderByBookPipe } from './pipes/order-by-book.pipe';
import { PokercasinoComponent } from './sports/pokercasino/pokercasino.component';
import { SlotGameComponent } from './sports/slot-game/slot-game.component';
import { SnCasinoComponent } from './sports/sn-casino/sn-casino.component';
import { PokerReportComponent } from './sports/user-profile/poker-report/poker-report.component';
import { SlotReportComponent } from './sports/user-profile/slot-report/slot-report.component';
import { SlotProfitLossReportComponent } from './sports/user-profile/slot-profit-loss-report/slot-profit-loss-report.component';
import { SnReportComponent } from './sports/sn-report/sn-report.component';
import { RemoveSpacePipe } from './pipes/remove-space.pipe';
import { GoogleChartsModule } from 'angular-google-charts';
import { FilterPipe } from './pipes/filter.pipe';
import { NewsComponent } from './news/news.component';
import { AwcComponent } from './sports/awc/awc.component';
import { UniqueFilterPipe } from './pipes/unique-filter.pipe';
import { CasinoSidebarComponent } from './sports/casino-sidebar/casino-sidebar.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';


@NgModule({
  declarations: [
    AppComponent,

    MainComponent,
    CarouselBannerComponent,
    MarqueeComponent,
    LiveCasinoComponent,
    FooterComponent,
    WinnerComponent,
    AboutUsComponent,
    TermsandconditionComponent,
    ResponsiblegamingComponent,
    SportsComponent,
    ExchangeComponent,
    SlotComponent,
    FantasyComponent,
    SidebarComponent,
    SFooterComponent,
    MainContentComponent,
    RightSidebarComponent,
    SLiveCasinoComponent,
    HeaderTopComponent,
    FaqComponent,
    AccountStateComponent,
    CurrentBetsComponent,
    ActivityComponent,
    CasinoResultComponent,
    SecurityComponent,
    HighlightsComponent,
    CardmeterComponent,
    FullmarketsComponent,
    SortByDatePipe,
    ProfitLossComponent,
    HeaderComponent,
    SortByDatePipe,
    BetHistoryComponent,
    BetSlipComponent,
    OrderByFancyPipe,
    OrderByBookPipe,
    PokercasinoComponent,
    SlotGameComponent,
    SnCasinoComponent,
    PokerReportComponent,
    SlotReportComponent,
    SlotProfitLossReportComponent,
    SnReportComponent,
    RemoveSpacePipe,
    FilterPipe,
    NewsComponent,
    AwcComponent,
    UniqueFilterPipe,
    CasinoSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    CarouselModule,
    NguCarouselModule,
    GoogleChartsModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SlickCarouselModule,
  ],
  providers: [
    // {
    //   provide: [HTTP_INTERCEPTORS, ToastrModule.forRoot(), BsDatepickerConfig],
    //   useClass: TokenInterceptor,
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
