import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullmarketsComponent } from './fullmarkets.component';

describe('FullmarketsComponent', () => {
  let component: FullmarketsComponent;
  let fixture: ComponentFixture<FullmarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullmarketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullmarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
