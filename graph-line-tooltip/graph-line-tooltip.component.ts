import { Component, OnInit, ViewChild, ElementRef,
         Input, OnChanges, SimpleChanges } from '@angular/core';
import { GraphService } from '@graph/graph.service';

import * as d3 from 'd3';
import _ from 'lodash-es';
import moment from 'moment';

@Component({
  selector: 'app-graph-line-tooltip',
  templateUrl: './graph-line-tooltip.component.html',
  styleUrls: ['./graph-line-tooltip.component.scss']
})
export class GraphLineTooltipComponent implements OnInit, OnChanges {

  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() data: Array<any> = [];
  @Input() title: string = '';
  @Input() unit: string = ' ';

  @ViewChild('graph', { static: true }) graph!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltip!: ElementRef;

  public svg: any = null;
  public xAxis: any = null;
  public yAxis: any = null;

  constructor(private graphSvc: GraphService) {}
  ngOnInit(): void {}

  private _plot(): void {

    this.graphSvc.width = this.width;
    this.graphSvc.height = this.height;

    let style: any = `width: ${this.width}px; height: ${this.height}px;`;
    this.graph.nativeElement.setAttribute('style', style);

    d3.selectAll("svg").remove();
    this.svg = d3.select(this.graph.nativeElement)
                 .insert("svg")
                 .attr("width", this.width)
                 .attr("height",this.height)
                 .append("g")
                 .attr("transform",`translate(${this.graphSvc.margin.left},${this.graphSvc.margin.top})`)

    this.graphSvc.custom_y_domain = [-60, 60]
    this.graphSvc.data = this.data;

    this.xAxis = this.svg.append("g")
      .attr("transform", `translate(0,${this.graphSvc.height})`)
      .call(this.graphSvc.xAxis);

    this.yAxis = this.svg.append("g").call(this.graphSvc.yAxis);

    this.svg.append("path")
      .datum(this.graphSvc.data_time)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
      .curve(d3.curveBasis) // Just add that to have a curve instead of segments
      .x((d: any) => this.graphSvc.x_time(d.date))
      .y((d: any) => this.graphSvc.y_time_value(d.value)))

    // create a tooltip
    const tooltip: any = d3.select(this.tooltip.nativeElement)

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover: any = (event: any, d: any) => {
        tooltip.style("opacity", 1)
    }

    const mousemove: any = (event: any, d: any) => {
      tooltip.html(`${moment(d.date).format("DD/MM/YYYY")}: ${d.value}`)
             .style("left", `${event.layerX+10}px`)
             .style("top", `${event.layerY}px`)
    }

    const mouseleave: any = (event: any, d: any) => {
      tooltip.style("opacity", 0)
    }

    this.svg.append("g")
            .selectAll("dot")
            .data(this.graphSvc.data_time)
            .join("circle")
            .attr("class", "myCircle")
            .attr("cx", (d: any) => this.graphSvc.x_time(d.date))
            .attr("cy", (d: any) => this.graphSvc.y_time_value(d.value))
            .attr("r", 3)
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1)
            .attr("fill", "white")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
