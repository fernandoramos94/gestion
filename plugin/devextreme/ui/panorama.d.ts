/**
* DevExtreme (ui/panorama.d.ts)
* Version: 17.1.5
* Build date: Tue Aug 01 2017
*
* Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxPanorama(): JQuery;
    dxPanorama(options: "instance"): DevExpress.ui.dxPanorama;
    dxPanorama(options: string): any;
    dxPanorama(options: string, ...params: any[]): any;
    dxPanorama(options: DevExpress.ui.dxPanoramaOptions): JQuery;
}
}
export default DevExpress.ui.dxPanorama;