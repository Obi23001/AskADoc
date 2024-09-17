import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgcardComponent } from './orgcard.component';

describe('OrgcardComponent', () => {
  let component: OrgcardComponent;
  let fixture: ComponentFixture<OrgcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
