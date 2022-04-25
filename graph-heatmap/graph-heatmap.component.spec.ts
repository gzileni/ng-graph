import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphHeatmapComponent } from './graph-heatmap.component';

describe('GraphHeatmapComponent', () => {
  let component: GraphHeatmapComponent;
  let fixture: ComponentFixture<GraphHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
