import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-casino',
  templateUrl: './live-casino.component.html',
  styleUrls: ['./live-casino.component.css'],
})
export class LiveCasinoComponent implements OnInit {
  arrayimg: any[];

  Casinos: any[any] = [
    'assets/img/Casino/TP2020.jpg',
    'assets/img/Casino/TP1Day.jpg',
    'assets/img/Casino/TPOpen.jpg',
    'assets/img/Casino/Lucky7A.jpg',
    'assets/img/Casino/Lucky7B.jpg',
    'assets/img/Casino/32Cards.jpg',
    'assets/img/Casino/32CardsB.jpg',
    'assets/img/Casino/AAA.jpg',
    'assets/img/Casino/Bollywood.jpg',
    'assets/img/Casino/Poker2020.jpg',
    'assets/img/Casino/Poker1Day.jpg',
    'assets/img/Casino/Poker6P.jpg',
    'assets/img/Casino/DT2020.jpg',
    'assets/img/Casino/DT1Day.jpg',
    'assets/img/Casino/DTL2020.jpg',
    'assets/img/Casino/Baccarat.jpg',
    'assets/img/Casino/3CardsJud.jpg',
  ];

  provider: any[any] = [
    'assets/images/1.jpg',
    'assets/images/2.jpg',
    'assets/images/5.jpg',
    'assets/images/6.jpg',
    'assets/images/17.jpg',
    'assets/images/21.jpg',
    'assets/images/24.jpg',
    'assets/images/26.jpg',
    'assets/images/31.jpg',
    'assets/images/999.jpg',
  ];

  Items2: any[any] = [
    'assets/images/vtrio-lc.jpg',
    'assets/images/vteenmuf-lc.jpg',
    'assets/images/vteen20-lc.jpg',
    'assets/images/vteen-lc.jpg',
    'assets/images/vlucky7-lc.jpg',
    'assets/images/vaaa-lc.jpg',
    'assets/images/vbtable-lc.jpg',
    'assets/images/vdt6-lc.jpg',
    'assets/images/vdtl20-lc.jpg',
  ];
  awc: any[any] = [
    "assets/img/awc_images/AncientScript.png",
    "assets/img/awc_images/FastSpin-FISH-001.png",
    "assets/img/awc_images/FastSpin-SLOT-001.png",
    "assets/img/awc_images/FC-EGAME-001.png",
    "assets/img/awc_images/FC-FISH-001.png",
    "assets/img/awc_images/FC-SLOT-001.png",
    "assets/img/awc_images/fish-prawn-crab2.png",
    "assets/img/awc_images/Gold Shark.png",
    "assets/img/awc_images/Horsebook.png",
    "assets/img/awc_images/JDB-EGAME-001.png",
    "assets/img/awc_images/JDB-FISH-002.png",
    "assets/img/awc_images/JDB-SLOT-001.png",
    "assets/img/awc_images/JILI-FISH-001.png",
  ];

  constructor() {}
  ngOnInit(): void {}
}
