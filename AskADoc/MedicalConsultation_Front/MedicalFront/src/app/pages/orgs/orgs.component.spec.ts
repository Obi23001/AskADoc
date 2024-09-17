import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgsComponent } from './orgs.component';

describe('OrgsComponent', () => {
  let component: OrgsComponent;
  let fixture: ComponentFixture<OrgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
