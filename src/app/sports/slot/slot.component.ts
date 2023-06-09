import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { TokenService } from 'src/app/services/token.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.css']
})
export class SlotComponent implements OnInit {
  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent!: ElementRef<any>;
  public searchTerm: string = '';
  // constructor() { }




  @ViewChild('tab1', { read: ElementRef },) public tab: ElementRef<any>;
  slotlists: any;
  // slotfilter: any;
  gameId: any;
  filterData: any[];
  slotfilters: any = "pragmatic";
  data: any[];
  loadrainbow: boolean = false;
  gameCode: any;
  accountInfo: any;
  searchKey: string = "";
  slotUrl: SafeResourceUrl;

  constructor(private apiService: CasinoApiService, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private tokenService: TokenService,) {
    $('#page_loading').css('display', 'block');

  }
  // slotfilter = ["pragmatic", "amatic", "tomhorn", "novomatic_html5", "novomatic_deluxe", "novomatic_classic", "NetEnt", "habanero", "microgaming", "microgaming_html5", "igt", "igt_html5", "merkur", "egt", "aristocrat", "igrosoft", "fish", "live_dealers", "platipus", "scientific_games", "kajot", "ainsworth", "quickspin", "apollo", "fast_games", "habanero", "apex", "more_expensive", "wazdan", "netent_html5", "sport_betting",]
  slotfilter = ["pragmatic", "amatic", "tomhorn", "novomatic_html5", "novomatic_deluxe",
    "NetEnt", "habanero", "microgaming", "microgaming_html5", "igt", "igt_html5", "merkur",
    "egt", "aristocrat", "igrosoft", "fish", "platipus", "scientific_games", "kajot",
    "ainsworth", "quickspin", "apollo", "fast_games", "habanero", "apex",
    "wazdan", "netent_html5",]

  ngOnInit(): void {
    this.accountInfo = this.tokenService.getUserInfo();
    this.route.params.subscribe(params => {
      this.gameId = params['gameId'];
      // console.log(this.gameId);

    })
    this.slotlist();

    this.apiService.search.subscribe((val: any) => {
      this.searchKey = val;
    })
  }
  dosomething() {
    this.loadrainbow = true
  }
  opengame(o: any) {
    this.gameCode = o
    let data = {
      "userName": this.accountInfo.userName,
      "gameId": this.gameCode
    }
    console.log(data)
    this.apiService.openGames(data).subscribe((res: any) => {
      if (res.errorCode == 0 && res.url) {
        this.slotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
        window.open((res.url), "_self");
      }
      $('#page_loading').css('display', 'none');
    })
  }
  slotlist() {
    this.apiService.slotlist().subscribe((resp: any) => {
      this.slotlists = resp.content.gameList;
      // this.slotfilter = resp.content.gameLabels;
      this.slotFilter('pragmatic')
      $('#page_loading').css('display', 'none');
    })
  }

  slotFilter(filter: string) {
    let filterData: any[] = []
    this.slotfilters = filter
    this.slotlists.forEach((element: { label: any; }) => {
      if (this.slotfilters == element.label) {
        filterData.push(element)
      }
    });
    this.data = filterData
  }


  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }

  isopen: boolean = true;
  pragmatic() {
    this.isopen = true;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen1: boolean = false;
  Amatic() {
    this.isopen = false;
    this.isopen1 = true;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen2: boolean = false;
  Tomhorn() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = true;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen3: boolean = false;
  Novomatic_html5() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = true;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen4: boolean = false;
  Novomatic_deluxe() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = true;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen5: boolean = false;
  Netent() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = true;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen6: boolean = false;
  Habanero() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = true;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen7: boolean = false;
  Microgaming() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = true;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen8: boolean = false;
  Microgaming_html5() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = true;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen9: boolean = false;
  Igt() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = true;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen10: boolean = false;
  Igt_html5() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = true;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen11: boolean = false;
  Merkur() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = true;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen12: boolean = false;
  Egt() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = true;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen13: boolean = false;
  Aristocrat() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = true;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen14: boolean = false;
  Igrosoft() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = true;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen15: boolean = false;
  Fish() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = true;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen16: boolean = false;
  Platipus() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = true;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen17: boolean = false;
  Scientific_games() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = true;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen18: boolean = false;
  Kajot() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = true;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen19: boolean = false;
  Ainsworth() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = true;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen20: boolean = false;
  Quickspin() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = true;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen21: boolean = false;
  Apollo() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = true;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen22: boolean = false;
  Fast_games() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = true;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen23: boolean = false;
  Habanero1() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = true;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen24: boolean = false;
  Apex() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = true;
    this.isopen25 = false;
    this.isopen26 = false;
  }

  isopen25: boolean = false;
  Wazdan() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = true;
    this.isopen26 = false;
  }

  isopen26: boolean = false;
  Netent_html5() {
    this.isopen = false;
    this.isopen1 = false;
    this.isopen2 = false;
    this.isopen3 = false;
    this.isopen4 = false;
    this.isopen5 = false;
    this.isopen6 = false;
    this.isopen7 = false;
    this.isopen8 = false;
    this.isopen9 = false;
    this.isopen10 = false;
    this.isopen11 = false;
    this.isopen12 = false;
    this.isopen13 = false;
    this.isopen14 = false;
    this.isopen15 = false;
    this.isopen16 = false;
    this.isopen17 = false;
    this.isopen18 = false;
    this.isopen19 = false;
    this.isopen20 = false;
    this.isopen21 = false;
    this.isopen22 = false;
    this.isopen23 = false;
    this.isopen24 = false;
    this.isopen25 = false;
    this.isopen26 = true;
  }

  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    // console.log(this.searchTerm);
    this.apiService.search.next(this.searchTerm);

  }
}
