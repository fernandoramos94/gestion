/**
 * DevExtreme (ui/scheduler/ui.scheduler.timeline_day.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var registerComponent = require("../../core/component_registrator"),
    SchedulerTimeline = require("./ui.scheduler.timeline");
var TIMELINE_CLASS = "dx-scheduler-timeline-day";
var SchedulerTimelineDay = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS
    },
    _setFirstViewDate: function() {
        this._firstViewDate = this.option("currentDate");
        this._setStartDayHour(this._firstViewDate)
    }
});
registerComponent("dxSchedulerTimelineDay", SchedulerTimelineDay);
module.exports = SchedulerTimelineDay;
