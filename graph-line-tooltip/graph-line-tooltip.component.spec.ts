import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineTooltipComponent } from './graph-line-tooltip.component';

describe('GraphLineTooltipComponent', () => {
  let component: GraphLineTooltipComponent;
  let fixture: ComponentFixture<GraphLineTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphLineTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
