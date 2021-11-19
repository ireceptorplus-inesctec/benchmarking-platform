import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilityDataComponent } from './traceability_data.component';

describe('TraceabilityDataComponent', () => {
  let component: TraceabilityDataComponent;
  let fixture: ComponentFixture<TraceabilityDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceabilityDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceabilityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
