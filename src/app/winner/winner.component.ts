import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  winners =[

    {Playername:'de****' , winAmount:'20,524'},
    {Playername:'ze****' , winAmount:'80,524'},
    {Playername:'je****' , winAmount:'1,80,524'},
    {Playername:'ae****' , winAmount:'1,80,840'},
    {Playername:'se****' , winAmount:'2,80,840'},
    {Playername:'ni****' , winAmount:'2,00,840'},
    {Playername:'je****' , winAmount:'11,20,840'},
    {Playername:'ko****' , winAmount:'5,20,000'},
    {Playername:'si****' , winAmount:'11,00,101'},
    {Playername:'ke****' , winAmount:'2,20,399'},
    {Playername:'As****' , winAmount:'5,65,645'},
    {Playername:'de****' , winAmount:'7,65,339'},
    {Playername:'ha****' , winAmount:'3,15,815'},

  ]

}
