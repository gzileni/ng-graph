import { Component, OnInit, ViewChild, ElementRef,
         Input, OnChanges, SimpleChanges } from '@angular/core';
import { GraphService } from '@graph/graph.service';

import * as d3 from 'd3';
import _ from 'lodash-es';

@Component({
  selector: 'app-graph-heatmap',
  templateUrl: './graph-heatmap.component.html',
  styleUrls: ['./graph-heatmap.component.scss']
})
export class GraphHeatmapComponent implements OnInit, OnChanges {

  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() data: Array<any> = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() unit: string = ' ';
  @Input() hideXAxis: boolean = true;

  private _color: any = null;

  @ViewChild('graph', { static: true }) graph!: ElementRef;

  public svg: any = null;

  constructor(private graphSvc: GraphService) { }

  ngOnInit(): void {
    this.graphSvc.range.subscribe((res: any) => {
      this._color = d3.scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([res.min, res.max])
    })
  }

  /**
   *
   */
  private _plot(): void {

    this.graphSvc.width = this.width;
    this.graphSvc.height = this.height;

    d3.selectAll("svg").remove();
    this.svg = d3.select(this.graph.nativeElement)
                 .insert("svg")
                 .attr("width", this.width)
                 .attr("height",this.height)
                 .append("g")
                 .attr("transform",`translate(${this.graphSvc.margin.left},${this.graphSvc.margin.top})`)

    this.graphSvc.custom_y_domain = [-60, 60];
    this.graphSvc.heatmap = this.data;

    const myVars = _.map(this.graphSvc.variables_hm, (d: any) => d.key)

    /** Build X scales and axis: */
    const x = d3.scaleBand()
      .range([ 0, this.graphSvc.width ])
      .domain(this.graphSvc.groups_hm)
      .padding(0.05);

    if (this.hideXAxis == false) {
      this.svg.append("g")
        .style("font-size", 15)
        .attr("transform", `translate(0, ${this.graphSvc.height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()
    }

    /** Build Y scales and axis: */
    const y = d3.scaleBand()
      .range([ this.graphSvc.height, 0 ])
      .domain(myVars)
      .padding(0.05);

    this.svg.append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove()

    /** create a tooltip */
    const tooltip = d3.select(this.graph.nativeElement)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    /** Three function that change the tooltip when user hover / move / leave a cell */
    const mouseover: any = (event: any, d: any) => {
      tooltip
        .style("opacity", 1);

      d3.select(this.graph.nativeElement)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    const mousemove: any = (event: any, d: any) => {
      tooltip
        .html(d.group + " : " + d.value)
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 + "px")
    }

    const mouseleave: any = (event: any, d: any) => {
      tooltip
        .style("opacity", 0);

      d3.select(this.svg)
        .style("stroke", "none")
        .style("opacity", 0.8);
    }

    /** add the squares */
    this.svg.selectAll()
            .data(this.graphSvc.heatmap, (d: any) => {return d.group+':'+d.variable;})
            .join("rect")
            .attr("x", (d: any) => {
              return x(d.group)
            })
            .attr("y", (d: any) => {
              return y(d.variable)
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d: any) => {
              return this._color(d.value)
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


    // Add title to graph
    this.svg.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("text-anchor", "left")
            .style("font-size", "22px")
            .text(this.title);

    // Add subtitle to graph
    this.svg.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "left")
            .style("font-size", "14px")
            .style("fill", "grey")
            .style("max-width", 400)
            .text(this.subtitle);

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}
