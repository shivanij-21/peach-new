import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwcComponent } from './awc.component';

describe('AwcComponent', () => {
  let component: AwcComponent;
  let fixture: ComponentFixture<AwcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
