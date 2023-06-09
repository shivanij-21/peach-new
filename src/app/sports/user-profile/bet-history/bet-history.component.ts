import { Component, OnInit } from '@angular/core';
import{ ReportService}from 'src/app/report.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as  html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.css']
})
export class BetHistoryComponent implements OnInit {

  BETSTATUS = "1";
  stype = '';
  bets: any
  betId: any;

  selectfromdate: any;
  selecttodate!: Date;
  selecttotime!: Date;
  selectfromtime!: Date;
  month;



  loader: boolean = false;
  betstatus: any;
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
  ) {
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));
  }

  ngOnInit(): void {
    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));


    this.mainService.apis$.subscribe(resp => {
      this.GetBetHistory();
    })
  }

  selectTab(input:any) {
    if(input=='today'){
      this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    }else{
      this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    this.GetBetHistory();
  }

  changeSport(stype:any) {
    this.stype=stype;
    this.GetBetHistory();
  }

  GetBetHistory() {

    this.bets = [];

    this.loader = true;
    let STYPE = this.stype;
    $('#loading').css('display', 'block');

    let betdates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }
    this.reportService.BetHistory(betdates.fromdate, betdates.todate, this.BETSTATUS).subscribe(
      (resp:any) => {

        // this.bets = resp.result.reverse();
        this.betstatus=this.BETSTATUS
        if (this.stype == '') {
          this.bets = resp.result.reverse();
        }else if (this.stype == '0') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName.indexOf('Virtual ')==-1 && bet.sportName.indexOf('Live Casino')==-1 && bet.marketName!='Bookmaker' && bet.marketName!=bet.selName)
            .reverse();
        } else if (this.stype == '1') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName === 'cricket')
            .reverse();
        } else if (this.stype == '2') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName === 'tennis')
            .reverse();
        } else if (this.stype == '3') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName === 'soccer')
            .reverse();
        } else if (this.stype == '4') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName === 'Horse Racing')
            .reverse();
        } else if (this.stype == '5') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName === 'GreyHound Racing')
            .reverse();
        }else if (this.stype == '6') {
          this.bets = resp.result
            .filter((bet:any) => bet.marketName==bet.selName)
            .reverse();
        }else if (this.stype == '7') {
          this.bets = resp.result
            .filter((bet:any) => bet.marketName=='Bookmaker')
            .reverse();
        }else if (this.stype == '8') {
          this.bets = resp.result
            .filter((bet:any) => bet.sportName=="Live Casino")
            .reverse();
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

  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

  getBetType(bet:any) {
    let betType = "";
    if (bet.type == "Lagai(B)") {
      betType = 'back';
      bet.betType = 'back';

    } else {
      betType = 'lay';
      bet.betType = 'lay';
    }
    return betType;
  }

  toggleTx(betId: any) {
    this.betId = betId;

  }
  fileName = 'Bet History.xlsx';

  exportPdf() {
    var element = document.getElementById('table01');
    var opt = {
      margin: 1,
      filename: 'Bet History_'+new Date().toDateString(),
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
    this.GetBetHistory();
  }


  postList(): void{
    this.reportService.logActivity().subscribe((response)=>{
      this.POSTS = response;
      console.log(this.POSTS);
    })
  }

 
  onTableSizeChange(event:any){
    this.tableSize = event.target.value;
    this.page = 1;
    this.postList()
  }
}
