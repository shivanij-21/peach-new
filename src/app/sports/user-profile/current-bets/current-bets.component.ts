import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/report.service';
import * as _ from 'lodash';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as  html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-current-bets',
  templateUrl: './current-bets.component.html',
  styleUrls: ['./current-bets.component.css']
})
export class CurrentBetsComponent implements OnInit {

  bets: any;
  betId: any;
  stype = '';

  loader: boolean = false;
  showMyContainer: boolean = false;

  betStatus: string = "";
  orderBetPlaced: boolean = true;
  orderMarket: boolean = false;
  Update: any;

  POSTS:any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [10,25,50,100,200,300,400,500];

  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private shareService: ShareDataService

  ) { }

  ngOnInit(): void {
    this.mainService.apis$.subscribe(resp => {
      this.GetCurrentBets();
    })
  }

  selectTab(stype:any) {
    this.stype = stype;
    this.GetCurrentBets();
  }

  changeSport(stype:any) {
    this.stype = stype;
    this.GetCurrentBets();
  }

  changeStatus(event:any) {
    if (this.orderBetPlaced) {
      this.orderBetPlaced = false;
      this.orderMarket = true;
      this.bets = _.orderBy(this.bets, ['marketName'], ['asc']);
      // console.log("betsssss",this.bets);

    } else {
      this.orderBetPlaced = true;
      this.orderMarket = false;
      this.bets = _.orderBy(this.bets, ['betTime'], ['desc']);
      // console.log(" else betsssss",this.bets);
    }
  }

  changeBetStatus() {
    this.GetCurrentBets();
  }

  GetCurrentBets() {

    this.loader = true;
    $('#loading').css('display', 'block');

    this.reportService.currentBets().subscribe(
      (resp: any) => {
        // console.log("betsssss res ",this.bets);

        this.bets = resp.result;
        if (this.stype == '') {
          this.bets = resp.result.reverse();
        } else if (this.stype == '0') {
          this.bets = resp.result.filter((bet:any) => bet.sportName.indexOf('Virtual ') == -1 && bet.sportName.indexOf('Live Casino') == -1 && bet.marketName != 'Bookmaker' && bet.marketName != bet.selName).reverse();
        } else if (this.stype == '1') {
          this.bets = resp.result.filter((bet:any) => bet.sportName === 'cricket').reverse();
        } else if (this.stype == '2') {
          this.bets = resp.result.filter((bet:any) => bet.sportName === 'tennis').reverse();
        } else if (this.stype == '3') {
          this.bets = resp.result.filter((bet:any) => bet.sportName === 'soccer').reverse();
        } else if (this.stype == '4') {
          this.bets = resp.result.filter((bet:any) => bet.sportName === 'Horse Racing').reverse();
        } else if (this.stype == '5') {
          this.bets = resp.result.filter((bet:any) => bet.sportName === 'GreyHound Racing').reverse();
        } else if (this.stype == '6') {
          this.bets = resp.result.filter((bet:any) => bet.marketName == bet.selName).reverse();
        } else if (this.stype == '7') {
          this.bets = resp.result.filter((bet:any) => bet.marketName == 'Bookmaker').reverse();
        } else if (this.stype == '8') {
          this.bets = resp.result.filter((bet:any) => bet.sportName == "Live Casino").reverse();
        } else {
          this.bets = [];
        }


        this.loader = false;
        $('#loading').css('display', 'none');
      },
      err => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
  }

  toggleTx(betId:any) {
    this.betId = betId;

  }
  fileName = 'Current Bets.xlsx';

  exportPdf() {
    var element = document.getElementById('table01');
    var opt = {
      margin: 1,
      filename: 'Current Bets_'+new Date().toDateString(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }


  exportExcel(){
    let element = document.getElementById('table01')

    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)

    const wb:XLSX.WorkBook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb,ws,'Sheet1')

    XLSX.writeFile(wb,this.fileName)
  }

  onTableDataChange(event:any){
    this.page = event;
    this.GetCurrentBets();
  }

  postList(): void{
    this.reportService.logActivity().subscribe((response)=>{
      this.POSTS = response;
      // console.log(this.POSTS);
    })
  }

 
  onTableSizeChange(event:any){
    this.tableSize = event.target.value;
    this.page = 1;
    this.postList()
  }
}
