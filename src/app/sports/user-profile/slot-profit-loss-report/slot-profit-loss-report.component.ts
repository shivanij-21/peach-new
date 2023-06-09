import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/report.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as  html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-slot-profit-loss-report',
  templateUrl: './slot-profit-loss-report.component.html',
  styleUrls: ['./slot-profit-loss-report.component.css']
})
export class SlotProfitLossReportComponent implements OnInit {

  userInfo: any;

  ProfitLoss:any;
  totalPnl = 0;
  srNo: any;
  stype = '';
  pnl:any

  selectfromdate: any;
  selecttodate!: Date;
  selecttotime!: Date;
  selectfromtime!: Date;
  month:any;

  loader: boolean = false;

  POSTS:any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [10,25,50,100,200,300,400,500];

  Update: any;

  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    ) {
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));

   }

  ngOnInit(): void {
    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));

    this.mainService.apis$.subscribe((resp) => {
      this.UserDescription();
      this.GetProfitLoss();
    });

  }

  UserDescription() {
    this.userInfo = this.tokenService.getUserInfo();
  }

  selectTab(input:any) {
    if (input == 'today') {
      this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    } else {
      this.selectfromdate = new Date(
        new Date().setDate(new Date().getDate() - 1)
      );
    }
    this.GetProfitLoss();
  }

  changeSport(stype:any) {
    this.stype = stype;
    this.GetProfitLoss();
  }

  GetProfitLoss() {

    this.ProfitLoss = [];
    this.srNo = null;
    this.totalPnl=0;
    this.loader = true;
    $('#loading').css('display', 'block');

    let pnldates = {
      fromdate: this.getFromDateAndTime(),
      todate: this.getToDateAndTime(),
    };

    this.reportService.SlotProfitLoss(pnldates.fromdate, pnldates.todate).subscribe(
      (resp: any) => {

        this.ProfitLoss = resp.result.reverse();
        // console.log(this.ProfitLoss);
        if (this.stype == '') {
          this.ProfitLoss = resp.result.reverse();
        } else if (this.stype == '0') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.marketId ? pnl.marketId.indexOf('_') == -1 : '')
            .reverse();
        } else if (this.stype == '1') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.sportName === 'cricket')
            .reverse();
        } else if (this.stype == '2') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.sportName === 'tennis')
            .reverse();
        } else if (this.stype == '3') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.sportName === 'soccer')
            .reverse();
        } else if (this.stype == '4') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.sportName === 'Horse Racing')
            .reverse();
        } else if (this.stype == '5') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.sportName === 'GreyHound Racing')
            .reverse();
        } else if (this.stype == '6') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.marketId ? pnl.marketId.indexOf('df_') > -1 : '')
            .reverse();
        } else if (this.stype == '7') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => pnl.marketId ? pnl.marketId.indexOf('bm_') > -1 : '')
            .reverse();
        } else if (this.stype == '8') {
          this.ProfitLoss = resp.result
            .filter((pnl:any) => !pnl.marketId)
            .reverse();
        } else {
          this.ProfitLoss = [];
        }

        _.forEach(this.ProfitLoss, (market) => {
          this.totalPnl = this.totalPnl + market.PL;
          market['totalStakes'] = 0;
          market['backTotal'] = 0;
          market['layTotal'] = 0;
          market['mktPnl'] = 0;

          _.forEach(market.bets, (bet) => {
            market.totalStakes += +bet.stake;
            if (bet.betType === 'back' || bet.betType === 'yes') {
              market.backTotal += +bet.pl;
            } else if (bet.betType === 'lay' || bet.betType === 'no') {
              market.layTotal += +bet.pl;
            }
            market.mktPnl += +bet.pl;
          });
          // this.totalComm = this.totalComm + element.commission;
          // this.eventName = this.bets + element.eventName
        });
        // this.totalPnl = resp.total;

        this.loader = false;
        $('#loading').css('display', 'none');
      },
      (err) => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
}

getFromDateAndTime() {
  // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
  return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1
    }-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;
}
getToDateAndTime() {
  // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
  return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1
    }-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
}

getBetType(bet:any) {
  let betType = '';
  if (bet.type == 'back' || bet.type == 'yes') {
    betType = 'back';
  } else {
    betType = 'lay';
  }
  return betType;
}

toggleDetail(srNo:any) {
  this.srNo = srNo;
}

fileName = 'Slot ProfitLoss.xlsx';

exportPdf() {
  var element = document.getElementById('table01');
  var opt = {
    margin: 1,
    filename: 'Slot ProfitLoss_'+new Date().toDateString(),
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
  this.GetProfitLoss();
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
