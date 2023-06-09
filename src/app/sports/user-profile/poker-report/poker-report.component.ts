import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/report.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as  html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-poker-report',
  templateUrl: './poker-report.component.html',
  styleUrls: ['./poker-report.component.css']
})
export class PokerReportComponent implements OnInit {
  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;
  bets = []

  loader: boolean = false;
  betstatus: any;
  bettingHistory: any = [];
  month: any;
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
    this.selectfromdate = new Date(new Date().setHours(0, 0, 0));
    this.selecttodate = new Date(new Date().setHours(23, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(0, 0, 0, 0));
    this.selecttotime = new Date(new Date().setHours(23, 59, 0, 0));

    this.mainService.apis$.subscribe(resp => {
      this.GetBetHistory();
    })
    this.getlanguages();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe((data: any) => {
      this.Update = data
      if (this.Update?.myaccount == "আমার অ্যাকাউন্ট") {
        $("#accountPopup").css('font-size', '9px');
      } else {
        $("#accountPopup").css('font-size', 'inherit');
      }

    })
  }


  selectTab(input: string) {
    if (input == 'today') {
      this.selectfromdate = new Date(new Date().setHours(0, 0, 0));
    } else {
      this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    this.GetBetHistory();
  }

  GetBetHistory() {
    this.bets = [];

    this.loader = true;
    $('#loading').css('display', 'block');

    let betdates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }
    this.reportService.PokerBetHistory(betdates.fromdate, betdates.todate).subscribe(
      (resp: any) => {
        this.bettingHistory = resp.result;
        // console.log(this.bettingHistory);
        this.loader = false;
        $('#loading').css('display', 'none');
      },


    );
  }

  getFromDateAndTime() {
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

  fileName = 'Poker Report.xlsx';

  exportPdf() {
    var element = document.getElementById('table01');
    var opt = {
      margin: 1,
      filename: 'Poker Report_'+new Date().toDateString(),
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
