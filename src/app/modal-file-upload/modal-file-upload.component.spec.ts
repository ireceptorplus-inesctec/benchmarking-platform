import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFileUpload } from './modal-file-upload.component';

describe('ModalFileUpload', () => {
  let component: ModalFileUpload;
  let fixture: ComponentFixture<ModalFileUpload>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFileUpload ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
