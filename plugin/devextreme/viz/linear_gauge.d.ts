/**
* DevExtreme (viz/linear_gauge.d.ts)
* Version: 17.1.5
* Build date: Tue Aug 01 2017
*
* Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxLinearGauge(): JQuery;
    dxLinearGauge(options: "instance"): DevExpress.viz.dxLinearGauge;
    dxLinearGauge(options: string): any;
    dxLinearGauge(options: string, ...params: any[]): any;
    dxLinearGauge(options: DevExpress.viz.gauges.dxLinearGaugeOptions): JQuery;
}
}
export default DevExpress.viz.dxLinearGauge;