import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as d3 from 'd3';
import _ from 'lodash-es';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private _plot = new Subject<void>();
  public plot = this._plot.asObservable();

  private _range = new Subject<any>();
  public range = this._range.asObservable();

  public levels: number = 10;

  private _width: number = 0;
  private _height: number = 0;
  private _data: Array<any> = [];
  private _data_time: Array<any> = [];
  private _heatmap: Array<any> = [];

  private _x_data_time: any = null;
  private _y_data_time_value: any = null;
  private _y_domain_time_value: any = null;
  private _x_domain_time: any = null;
  private _x_time: any = null;
  private _y_time_value: any = null;
  private _xAxis: any = null;
  private _yAxis: any = null;
  private _domain_current_time: Array<any> = [];

  private _groups_hm: Array<any> = [];
  private _variables_hm: Array<any> = [];

  public margin: any = { top: 20, right: 15, bottom: 50, left: 30 };
  public format_x_time: string = '%d/%m/%Y';

  public custom_y_domain: Array<number> | any = null;

  constructor() {}

  public get variables_hm(): Array<any> {
    return this._variables_hm;
  }

  /**
   *
   */
  public set variables_hm(value: Array<any>) {
    // const isCustom: boolean = this.custom_y_domain != null && this.custom_y_domain != undefined && _.size(this.custom_y_domain) > 0;

    this._variables_hm = [];

    const values: Array<number> | any = _.map(value, (o:any) => {
      return o.value;
    })

    const min: number | any = _.min(values);
    const max: number | any = _.max(values);

    this._range.next({
      min: min,
      max: max
    });

    const steps: number = _.round((max - min) / this.levels, 2);

    let min_i: number = 0
    let max_i: number = 0;

    for (let i=0; i < this.levels; i++) {

      min_i = min_i == 0 ? min : max_i;
      let s: number = _.round(min_i + steps, 2);
      max_i = s > max ? max : s;

      const key: string = `${i+1} (${min_i} -> ${max_i})`;

      this._variables_hm.push({
        key: key,
        min: min_i,
        max: max_i
      });
    }
  }

  /**
   *
   */
  public get groups_hm(): Array<any> {
    return this._groups_hm;
  }

  public set groups_hm(value: Array<any>) {
    this._groups_hm = _.map(value, (d:any) => { return d.group });
  }

  /**
   *
   */
   public get data(): Array<any> {
    return this._data;
  }

  public set data(value: Array<any>) {
    this._data = value;
    this.data_time = value;
  }

  /**
   *
   */
  public get heatmap(): Array<any> {
    return this._heatmap;
  }

  /**
   *
   * @param value
   * @returns
   */
  private _getVariable(value: any): string {
    const result: any = _.find(this.variables_hm, (item:any) => {
      return value >= item.min && value <= item.max
    })

    return result.key;
  }

  public set heatmap(value: Array<any>) {

    /** create heatmap */
    this.variables_hm = value;
    this.groups_hm = value;
    this._heatmap = _.map(value, (d: any) => {
      return {
        group: d.group,
        variable: this._getVariable(d.value),
        value: d.value
      }
    })
  }

  /**
   *
   */
  public get yAxis(): any {
    return this._yAxis
  }

  public set yAxis(value: any) {
    this._yAxis = value;
  }

  /**
   *
   */
   public get xAxis(): any {
    return this._xAxis;
  }

  public set xAxis(selection: any) {
    this._xAxis = selection;
  }

  /**
   *
   */
  public set domain_current_time(value: Array<any>) {
    this._domain_current_time = value;

    let d: Array<any> = _.filter(this.data, (item: any) => {
      return moment(d3.timeParse(this.format_x_time)(item.date)).isBetween(moment(value[0]), moment(value[1]));
    });

    if (_.size(d) > 0) {
      this.data_time = d;
      this._plot.next();
    } else {
      this.restart();
    }
  }

  /**
   *
   */
  public get domain_current_time(): Array<any> {
    return this._domain_current_time;
  }

  /**
   * re-plotting graph
   */
  public restart() {
    this.data_time = this.data;
    this._plot.next();
  }

  /**
   *
   */
  public get y_time_value(): any {
    return this._y_time_value;
  }

  public set y_time_value(value: any) {
    this._y_time_value = value;
    this.yAxis = d3.axisLeft(value)
  }

  /**
   *
   */
  public get x_time(): any {
    return this._x_time
  }

  public set x_time(value: any) {
    this._x_time = value;
    this.xAxis = d3.axisBottom(value);
  }

  /**
   *
   */
  public get x_domain_time(): Array<any> {
    return this._x_domain_time
  }

  public set x_domain_time(value: any) {
    this._x_domain_time = value;
    this.x_time = d3.scaleTime()
                    .domain(value)
                    .range([ 0, this.width ]);
  }



  /**
   *
   */
  public get y_domain_time_value(): Array<any> {
    return this._y_domain_time_value;
  }

  public set y_domain_time_value(value: any) {
    this._y_domain_time_value = value;
    this.y_time_value = d3.scaleLinear()
                          .domain(value)
                          .range([ this.height, 0 ]);
  }

  /**
   *
   */
  public get x_data_time(): Array<any> {
    return this._x_data_time;
  }

  public set x_data_time(value: any) {
    this._x_data_time = value;
    this.x_domain_time = d3.extent(value);
  }

  /**
   *
   */
  public get y_data_time_value(): any {
    return this._y_data_time_value
  }

  /**
   *
   */
  public set y_data_time_value(value: any) {
    this._y_data_time_value = value;
    this.y_domain_time_value = this.custom_y_domain != null && this.custom_y_domain != undefined ?
                               this.custom_y_domain :
                               d3.extent(value);
  }

  /**
   *
   */
  public get data_time(): Array<any> {
    return this._data_time;
  }

  /**
   *
   */
  public set data_time(value: Array<any>) {

    this._data_time = _.map(value, (o: any) => {
      return {
        date: d3.timeParse(this.format_x_time)(o.date),
        value: o.value
      }
    });

    this.y_data_time_value = this._data_time.map((d: any) => d.value);
    this.x_data_time = this._data_time.map((d: any) => d.date);

  }



  /**
   *
   */
  public get width(): number {
    return this._width - this.margin.left - this.margin.right;
  }

  /**
   *
   */
  public set width(value: number) {
    this._width = value;
  }

  /**
   *
   */
  public get height(): number {
    return this._height - this.margin.top - this.margin.bottom;
  }

  /**
   *
   */
  public set height(value: number) {
    this._height = value;
  }

}


