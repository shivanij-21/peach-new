// import { BetTablesComponent } from './sports/bet-tables/bet-tables.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselBannerComponent } from './carousel-banner/carousel-banner.component';
import { AboutUsComponent } from './footer/about-us/about-us.component';
import { ResponsiblegamingComponent } from './footer/responsiblegaming/responsiblegaming.component';
import { TermsandconditionComponent } from './footer/termsandcondition/termsandcondition.component';
import { HeaderComponent } from './header/header.component';
import { LiveCasinoComponent } from './live-casino/live-casino.component';
import { MainComponent } from './main/main.component';
import { SportsComponent } from './sports/sports.component';
import { SLiveCasinoComponent } from './sports/s-live-casino/s-live-casino.component'
import { HeaderTopComponent } from './sports/header-top/header-top.component'
import { SlotComponent } from './sports/slot/slot.component'
import { FantasyComponent } from './sports/fantasy/fantasy.component'
import { FaqComponent } from './sports/faq/faq.component';
import { AccountStateComponent } from './sports/user-profile/account-state/account-state.component';
import { CurrentBetsComponent } from './sports/user-profile/current-bets/current-bets.component';
import { ActivityComponent } from './sports/user-profile/activity/activity.component';
import { CasinoResultComponent } from './sports/user-profile/casino-bets/casino-result.component';
import { SecurityComponent } from './sports/user-profile/security/security.component';
import { AuthGuard } from './services/auth.guard';
import { CardmeterComponent } from './sports/s-live-casino/cardmeter/cardmeter.component';
import { ProfitLossComponent } from './sports/user-profile/profit-loss/profit-loss.component';
import { BetHistoryComponent } from './sports/user-profile/bet-history/bet-history.component';
import { FullmarketsComponent } from './sports/fullmarkets/fullmarkets.component';
import { PokercasinoComponent } from './sports/pokercasino/pokercasino.component';
import { SlotGameComponent } from './sports/slot-game/slot-game.component';
import { SnCasinoComponent } from './sports/sn-casino/sn-casino.component';
import { PokerReportComponent } from './sports/user-profile/poker-report/poker-report.component';
import { SlotReportComponent } from './sports/user-profile/slot-report/slot-report.component';
import { SlotProfitLossReportComponent } from './sports/user-profile/slot-profit-loss-report/slot-profit-loss-report.component';
import { MainContentComponent } from './sports/main-content/main-content.component';
import { SnReportComponent } from './sports/sn-report/sn-report.component';
import { NewsComponent } from './news/news.component';
import { AwcComponent } from './sports/awc/awc.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: HeaderComponent },
      // { path: 'banner', component: CarouselBannerComponent },
      // { path: 'live', component: LiveCasinoComponent },
    ]
  },
  { path: 'main-content', component: MainContentComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'terms-and-condition', component: TermsandconditionComponent },
  { path: 'responsible-gaming', component: ResponsiblegamingComponent },
  { path: 'sports', canActivate:[AuthGuard], component: SportsComponent },
  { path: 'fullmarkets/:eventId', canActivate:[AuthGuard], component: FullmarketsComponent },
  { path: 'sncasino/:providerCode/:gameCode', component: SnCasinoComponent },
  { path: 'fullmarkets/:eventId/:marketId/:port', component: FullmarketsComponent },
  { path: 'casino', canActivate:[AuthGuard], component: SLiveCasinoComponent },
  { path: 's-header-top', component: HeaderTopComponent },
  { path: 'slot', canActivate:[AuthGuard], component: SlotComponent },
  { path: 'awc', canActivate:[AuthGuard], component: AwcComponent },
  { path: 'Fantasy', canActivate:[AuthGuard], component: FantasyComponent },
  { path: 'faq', canActivate:[AuthGuard], component: FaqComponent },
  { path: 'account-statement', canActivate:[AuthGuard], component: AccountStateComponent },
  { path: 'currentt-bets', canActivate:[AuthGuard], component: CurrentBetsComponent },
  { path: 'activity', canActivate:[AuthGuard], component: ActivityComponent },
  { path: 'casinoresult', canActivate:[AuthGuard], component: CasinoResultComponent },
  { path: 'securityauth', canActivate:[AuthGuard], component: SecurityComponent },
  { path: 'tp/:tableId/:tableName/:gType', component: CardmeterComponent},
  { path: 'profit-loss', canActivate:[AuthGuard], component: ProfitLossComponent },
  { path: 'bet-history', canActivate:[AuthGuard], component: BetHistoryComponent },
  { path: 'pokercasino' , canActivate:[AuthGuard], component: PokercasinoComponent },
  { path: 'slot-game/:id' , canActivate:[AuthGuard], component: SlotGameComponent },
  { path: 'poker-report' , canActivate:[AuthGuard], component: PokerReportComponent },
  { path: 'slot-report' , canActivate:[AuthGuard], component: SlotReportComponent },
  { path: 'slot-profit-loss-report' , canActivate:[AuthGuard], component: SlotProfitLossReportComponent },
  { path: 'sn-report' , canActivate:[AuthGuard], component: SnReportComponent },
  { path: 'news' , canActivate:[AuthGuard], component: NewsComponent },


  // { path: 'bt', component: BetTablesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
   exports: [RouterModule]
})
export class AppRoutingModule { }
