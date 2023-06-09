import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardmeterComponent } from './cardmeter.component';

describe('CardmeterComponent', () => {
  let component: CardmeterComponent;
  let fixture: ComponentFixture<CardmeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardmeterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardmeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
