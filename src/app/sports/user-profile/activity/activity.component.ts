import { Component, OnInit } from '@angular/core';
import{ ReportService}from 'src/app/report.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as  html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  logsData:any;

  selectfromdate: any;
  selecttodate!: Date;
  selecttotime!: Date;
  selectfromtime!: Date;
  month;
  loader: boolean = false;
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

    this.mainService.apis$.subscribe(resp => {
      this.AccountStatement();
    })
  }

  ngOnInit(): void {
    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));
  }


  AccountStatement() {

    this.loader = true;

    $('#loading').css('display','block');



    this.reportService.logActivity().subscribe(
      (resp:any) => {
        this.logsData = resp.result.reverse();
        this.loader = false;
        $('#loading').css('display','none');
      },
      err => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
  }
   onTableDataChange(event:any){
    this.page = event;
    this.AccountStatement();
  }


 

  fileName = 'Activity Log.xlsx';

  exportPdf() {
    var element = document.getElementById('table01');
    var opt = {
      margin: 1,
      filename: 'Activity Log_'+new Date().toDateString(),
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
      console.log(this.POSTS);
    })
  }

 
  onTableSizeChange(event:any){
    this.tableSize = event.target.value;
    this.page = 1;
    this.postList()
  }
}
