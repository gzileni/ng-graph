import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphLineAreaComponent } from '@graph/graph-line-area/graph-line-area.component';
import { GraphHeatmapComponent } from '@graph/graph-heatmap/graph-heatmap.component';
import { GraphLineTooltipComponent } from '@graph/graph-line-tooltip/graph-line-tooltip.component';

import { GraphService } from '@graph/graph.service';
import { NgChartsModule } from 'ng2-charts';

const components = [
    GraphLineAreaComponent,
    GraphHeatmapComponent,
    GraphLineTooltipComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports: components,
  providers: [GraphService]
})
export class GraphModule { }
