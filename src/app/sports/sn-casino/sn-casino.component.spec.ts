import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnCasinoComponent } from './sn-casino.component';

describe('SnCasinoComponent', () => {
  let component: SnCasinoComponent;
  let fixture: ComponentFixture<SnCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnCasinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
