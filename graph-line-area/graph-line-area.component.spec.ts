import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineAreaComponent } from './graph-line-area.component';

describe('GraphLineAreaComponent', () => {
  let component: GraphLineAreaComponent;
  let fixture: ComponentFixture<GraphLineAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphLineAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
