import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocardComponent } from './docard.component';

describe('DocardComponent', () => {
  let component: DocardComponent;
  let fixture: ComponentFixture<DocardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
