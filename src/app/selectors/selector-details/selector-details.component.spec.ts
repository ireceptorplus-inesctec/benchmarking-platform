import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorDetailsComponent } from './selector-details.component';

describe('SelectorDetailsComponent', () => {
  let component: SelectorDetailsComponent;
  let fixture: ComponentFixture<SelectorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
