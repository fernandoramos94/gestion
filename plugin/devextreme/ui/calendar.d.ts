/**
* DevExtreme (ui/calendar.d.ts)
* Version: 17.1.5
* Build date: Tue Aug 01 2017
*
* Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxCalendar(): JQuery;
    dxCalendar(options: "instance"): DevExpress.ui.dxCalendar;
    dxCalendar(options: string): any;
    dxCalendar(options: string, ...params: any[]): any;
    dxCalendar(options: DevExpress.ui.dxCalendarOptions): JQuery;
}
}
export default DevExpress.ui.dxCalendar;