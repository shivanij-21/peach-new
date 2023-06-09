import { Component, OnInit } from '@angular/core';
import{ ReportService}from 'src/app/report.service';
import { MainService } from 'src/app/services/main.service';
import * as  html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-account-state',
  templateUrl: './account-state.component.html',
  styleUrls: ['./account-state.component.css']
})
export class AccountStateComponent implements OnInit {
  fileName = 'Account Statement.xlsx';

  selectfromdate: any;

  selecttodate!: Date;
  selecttotime!: Date;
  selectfromtime!: Date;
  month;

  filter = "1";
  statementsData:any;
  srNo: any;
  loader: boolean = false;
  Update: any;
fas: any;

  POSTS:any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [10,25,50,100,200,300,400,500];


  constructor(    private reportService: ReportService,
    private mainService: MainService
    ) {
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));

   }


  ngOnInit(): void {
    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));

    this.mainService.apis$.subscribe(resp => {
      this.AccountStatement();
    })
  }

  AccountStatement(){
    this.statementsData = [];

    this.loader = true;


    let pnldates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }

    this.reportService.AccountStatement(pnldates.fromdate, pnldates.todate, this.filter).subscribe((resp:any) => {
      // console.log("account statement ",resp);

        this.statementsData = resp.result.reverse();
      }
    );
  }

  onTableDataChange(event:any){
    this.page = event;
    this.AccountStatement();
  }

  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }


  exportPdf() {
    var element = document.getElementById('table01');
    var opt = {
      margin: 1,
      filename: 'Account Statement_'+new Date().toDateString(),
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
