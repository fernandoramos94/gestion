/**
* DevExtreme (ui/validation_group.d.ts)
* Version: 17.1.5
* Build date: Tue Aug 01 2017
*
* Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxValidationGroup(): JQuery;
    dxValidationGroup(options: "instance"): DevExpress.ui.dxValidationGroup;
    dxValidationGroup(options: string): any;
    dxValidationGroup(options: string, ...params: any[]): any;
    dxValidationGroup(options: DevExpress.ui.dxValidationGroupOptions): JQuery;
}
}
export default DevExpress.ui.dxValidationGroup;