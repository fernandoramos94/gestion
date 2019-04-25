/**
 * DevExtreme (viz/series/stacked_series.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    extend = require("../../core/utils/extend").extend,
    areaSeries = require("./area_series").chart,
    chartAreaSeries = areaSeries.area,
    barSeries = require("./bar_series"),
    chartBarSeries = barSeries.chart.bar,
    lineSeries = require("./line_series").chart,
    _extend = extend,
    vizUtils = require("../core/utils"),
    objectUtils = require("../../core/utils/object"),
    _noop = noop,
    baseStackedSeries = {
        getErrorBarRangeCorrector: _noop,
        _fillErrorBars: _noop,
        _calculateErrorBars: _noop
    },
    baseFullStackedSeries = _extend({}, baseStackedSeries, {
        isFullStackedSeries: function() {
            return true
        }
    });
exports.chart = {};
exports.polar = {};
exports.chart.stackedline = _extend({}, lineSeries.line, baseStackedSeries, {});
exports.chart.stackedspline = _extend({}, lineSeries.spline, baseStackedSeries, {});
var fullStackedLineSeries = exports.chart.fullstackedline = _extend({}, lineSeries.line, baseFullStackedSeries, {
    _processRange: function(range) {
        lineSeries.line._processRange.apply(this, arguments);
        range.val.percentStick = true
    },
    getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue
});
exports.chart.fullstackedspline = _extend({}, lineSeries.spline, baseFullStackedSeries, {
    _processRange: function(range) {
        lineSeries.line._processRange.apply(this, arguments);
        range.val.percentStick = true
    },
    getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue
});
exports.chart.stackedbar = _extend({}, chartBarSeries, baseStackedSeries, {});
exports.chart.fullstackedbar = _extend({}, chartBarSeries, baseFullStackedSeries, {
    _processRange: function(range) {
        chartBarSeries._processRange.apply(this, arguments);
        range.val.percentStick = true
    }
});

function clonePoint(point, value, minValue, position) {
    point = objectUtils.clone(point);
    point.value = value;
    point.minValue = minValue;
    point.translate();
    point.argument = point.argument + position;
    return point
}

function preparePointsForStackedAreaSegment(points) {
    var p, array, i = 0,
        result = [],
        len = points.length;
    while (i < len) {
        p = points[i];
        array = [p];
        if (p.leftHole) {
            array = [clonePoint(p, p.leftHole, p.minLeftHole, "left"), p]
        }
        if (p.rightHole) {
            array.push(clonePoint(p, p.rightHole, p.minRightHole, "right"))
        }
        result.push(array);
        i++
    }
    return [].concat.apply([], result)
}
exports.chart.stackedarea = _extend({}, chartAreaSeries, baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        return chartAreaSeries._prepareSegment.call(this, preparePointsForStackedAreaSegment(points, this._prevSeries), rotated)
    },
    _appendInGroup: function() {
        this._group.append(this._extGroups.seriesGroup).toBackground()
    }
});

function getPointsByArgFromPrevSeries(prevSeries, argument) {
    var result;
    while (!result && prevSeries) {
        result = prevSeries._segmentByArg && prevSeries._segmentByArg[argument];
        prevSeries = prevSeries._prevSeries
    }
    return result
}
exports.chart.stackedsplinearea = _extend({}, areaSeries.splinearea, baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        var areaSegment, that = this;
        points = preparePointsForStackedAreaSegment(points, that._prevSeries);
        if (!this._prevSeries || 1 === points.length) {
            areaSegment = areaSeries.splinearea._prepareSegment.call(this, points, rotated)
        } else {
            var forwardPoints = lineSeries.spline._calculateBezierPoints(points, rotated),
                backwardPoints = vizUtils.map(points, function(p) {
                    var point = p.getCoords(true);
                    point.argument = p.argument;
                    return point
                }),
                prevSeriesForwardPoints = [],
                pointByArg = {},
                i = 0,
                len = that._prevSeries._segments.length;
            while (i < len) {
                prevSeriesForwardPoints = prevSeriesForwardPoints.concat(that._prevSeries._segments[i].line);
                i++
            }
            $.each(prevSeriesForwardPoints, function(_, p) {
                if (null !== p.argument) {
                    var argument = p.argument.valueOf();
                    if (!pointByArg[argument]) {
                        pointByArg[argument] = [p]
                    } else {
                        pointByArg[argument].push(p)
                    }
                }
            });
            that._prevSeries._segmentByArg = pointByArg;
            backwardPoints = lineSeries.spline._calculateBezierPoints(backwardPoints, rotated);
            $.each(backwardPoints, function(i, p) {
                var prevSeriesPoints, argument = p.argument.valueOf();
                if (i % 3 === 0) {
                    prevSeriesPoints = pointByArg[argument] || getPointsByArgFromPrevSeries(that._prevSeries, argument);
                    if (prevSeriesPoints) {
                        backwardPoints[i - 1] && prevSeriesPoints[0] && (backwardPoints[i - 1] = prevSeriesPoints[0]);
                        backwardPoints[i + 1] && (backwardPoints[i + 1] = prevSeriesPoints[2] || p)
                    }
                }
            });
            areaSegment = {
                line: forwardPoints,
                area: forwardPoints.concat(backwardPoints.reverse())
            };
            that._areaPointsToSplineAreaPoints(areaSegment.area)
        }
        return areaSegment
    },
    _appendInGroup: exports.chart.stackedarea._appendInGroup
});
exports.chart.fullstackedarea = _extend({}, chartAreaSeries, baseFullStackedSeries, {
    _prepareSegment: exports.chart.stackedarea._prepareSegment,
    _appendInGroup: exports.chart.stackedarea._appendInGroup,
    _processRange: fullStackedLineSeries._processRange
});
exports.chart.fullstackedsplinearea = _extend({}, areaSeries.splinearea, baseFullStackedSeries, {
    _prepareSegment: exports.chart.stackedsplinearea._prepareSegment,
    _appendInGroup: exports.chart.stackedarea._appendInGroup,
    _processRange: fullStackedLineSeries._processRange
});
exports.polar.stackedbar = _extend({}, barSeries.polar.bar, baseStackedSeries, {});