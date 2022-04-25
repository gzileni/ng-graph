import { Component, OnInit, ViewChild, ElementRef,
         Input, OnChanges, SimpleChanges } from '@angular/core';
import { GraphService } from '@graph/graph.service';

import * as d3 from 'd3';
import _ from 'lodash-es';
import moment from 'moment';

@Component({
  selector: 'app-graph-line-area',
  templateUrl: './graph-line-area.component.html',
  styleUrls: ['./graph-line-area.component.scss']
})
export class GraphLineAreaComponent implements OnInit, OnChanges {

  @Input() width: number | any = null;
  @Input() height: number | any = null;
  @Input() data: Array<any> = [];
  @Input() title: string = '';
  @Input() unit: string = '';
  @Input() format: string = '%d/%m/%Y';
  @Input() min: number = 0;
  @Input() max: number = 150;

  public xAxis: any = null;
  public yAxis: any = null;

  @ViewChild('graph', { static: true }) graph!: ElementRef;

  public svg: any = null;
  public brush: any = null;
  public area: any = null;
  public areaGenerator: any = null;
  public idleTimeout: any = null;

  constructor(private graphSvc: GraphService) {}

  ngOnInit(): void {
    /** If user double click, reinitialize the chart */
    this.svg.on("dblclick", () => {
      this.graphSvc.restart()
    });

    this.graphSvc.plot.subscribe(() => {
      /** Update axis and area position */
      this.xAxis.transition().duration(1000).call(this.graphSvc.xAxis);
      this.area
          .select('.myArea')
          .transition()
          .duration(1000)
          .attr("d", this.areaGenerator)
    })
  }

  /**
   *
   */
  private _plot(data: Array<any>): void {

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

    this.svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.graphSvc.margin.left + 5)
        .attr("x", -this.graphSvc.margin.top)
        .text(this.unit)

    this.graphSvc.custom_y_domain = [this.min, this.max];
    this.graphSvc.format_x_time = this.format;
    this.graphSvc.data = data;

    this.xAxis = this.svg.append("g")
                         .attr("transform", `translate(0,${this.graphSvc.height})`)
                         .call(this.graphSvc.xAxis);

    this.yAxis = this.svg.append("g")
                         .call(this.graphSvc.yAxis)

    /** Add a clipPath: everything out of this area won't be drawn. */
    const clip: any = this.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", this.graphSvc.width )
        .attr("height", this.graphSvc.height )
        .attr("x", 0)
        .attr("y", 0);

    /** Create the area variable: where both the area and the brush take place */
    this.area = this.svg.append('g')
      .attr("clip-path", "url(#clip)");

    /** Create an area generator */
    this.areaGenerator = d3.area()
      .x((d: any) => this.graphSvc.x_time(d.date))
      .y0(this.graphSvc.y_time_value(0))
      .y1((d: any) => this.graphSvc.y_time_value(d.value));

    /**
     * Add brushing
     * Add the brush feature using the d3.brush function
     * initialise the brush area: start at 0,0 and finishes at width,height:
     * it means I select the whole graph area
     * Each time the brush selection changes, trigger the 'updateChart' function
     */
    this.brush = d3.brushX()
        .extent( [ [0,0], [this.graphSvc.width, this.graphSvc.height] ] )
        .on("end", this._updateChart)

    /** Add the area */
    /** I add the class myArea to be able to modify it later on. */
    this.area.append("path")
      .datum(this.graphSvc.data_time)
      .attr("class", "myArea")
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .3)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", this.areaGenerator )

    /** Add the brushing */
    this.area
      .append("g")
        .attr("class", "brush")
        .call(this.brush);
  }

  private idled() { this.idleTimeout = null; }

  /**
   *
   * @param event
   */
  _updateChart = (event: any) => {
    /** What are the selected boundaries? */
    const extent: any = event.selection
    const x: any = null;

    /** If no selection, back to initial coordinate. Otherwise, update X axis domain */
    if (extent) {
      this.graphSvc.domain_current_time = [this.graphSvc.x_time.invert(extent[0]),
                                           this.graphSvc.x_time.invert(extent[1])];
      /** This remove the grey brush area as soon as the selection has been done */
      this.area.select(".brush").call(this.brush.move, null)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue != null && changes['data'].currentValue != undefined) {
      this._plot(changes['data'].currentValue);
    }
  }

}
