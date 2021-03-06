/**
 * DevExtreme (viz/series/points/bar_point.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extend = require("../../../core/utils/extend").extend,
    _extend = extend,
    _math = Math,
    _floor = _math.floor,
    _abs = _math.abs,
    _min = _math.min,
    symbolPoint = require("./symbol_point"),
    CANVAS_POSITION_DEFAULT = "canvas_position_default",
    DEFAULT_BAR_TRACKER_SIZE = 9,
    CORRECTING_BAR_TRACKER_VALUE = 4,
    RIGHT = "right",
    LEFT = "left",
    TOP = "top",
    BOTTOM = "bottom";
module.exports = _extend({}, symbolPoint, {
    correctCoordinates: function(correctOptions) {
        var that = this,
            correction = _floor(correctOptions.offset - correctOptions.width / 2);
        if (that._options.rotated) {
            that.height = correctOptions.width;
            that.yCorrection = correction
        } else {
            that.width = correctOptions.width;
            that.xCorrection = correction
        }
    },
    _getGraphicBBox: function() {
        var that = this,
            bBox = {};
        bBox.x = that.x;
        bBox.y = that.y;
        bBox.width = that.width;
        bBox.height = that.height;
        return bBox
    },
    _getLabelConnector: function(location) {
        return this._getGraphicBBox(location)
    },
    _getLabelPosition: function() {
        var position, that = this,
            initialValue = that.initialValue,
            invert = that._getValTranslator().getBusinessRange().invert,
            isDiscreteValue = "discrete" === that.series.valueAxisType,
            isFullStacked = that.series.isFullStackedSeries(),
            notAxisInverted = !isDiscreteValue && (initialValue >= 0 && !invert || initialValue < 0 && invert) || isDiscreteValue && !invert || isFullStacked;
        if (!that._options.rotated) {
            position = notAxisInverted ? TOP : BOTTOM
        } else {
            position = notAxisInverted ? RIGHT : LEFT
        }
        return position
    },
    _getLabelCoords: function(label) {
        var coords, that = this;
        if (0 === that.initialValue && that.series.isFullStackedSeries()) {
            if (!this._options.rotated) {
                coords = that._getLabelCoordOfPosition(label, TOP)
            } else {
                coords = that._getLabelCoordOfPosition(label, RIGHT)
            }
        } else {
            if ("inside" === label.getLayoutOptions().position) {
                coords = that._getLabelCoordOfPosition(label, "inside")
            } else {
                coords = symbolPoint._getLabelCoords.call(this, label)
            }
        }
        return coords
    },
    _checkLabelPosition: function(label, coord) {
        var that = this,
            visibleArea = that._getVisibleArea();
        if (that._isPointInVisibleArea(visibleArea, that._getGraphicBBox())) {
            return that._moveLabelOnCanvas(coord, visibleArea, label.getBoundingRect())
        }
        return coord
    },
    _isLabelInsidePoint: function(label) {
        var that = this,
            graphicBBox = that._getGraphicBBox(),
            labelBBox = label.getBoundingRect();
        if (that._options.resolveLabelsOverlapping && "inside" === label.getLayoutOptions().position) {
            if (labelBBox.width > graphicBBox.width || labelBBox.height > graphicBBox.height) {
                label.hide();
                return true
            }
        }
        return false
    },
    _moveLabelOnCanvas: function(coord, visibleArea, labelBBox) {
        var x = coord.x,
            y = coord.y;
        if (visibleArea.minX > x) {
            x = visibleArea.minX
        }
        if (visibleArea.maxX < x + labelBBox.width) {
            x = visibleArea.maxX - labelBBox.width
        }
        if (visibleArea.minY > y) {
            y = visibleArea.minY
        }
        if (visibleArea.maxY < y + labelBBox.height) {
            y = visibleArea.maxY - labelBBox.height
        }
        return {
            x: x,
            y: y
        }
    },
    _showForZeroValues: function() {
        return this._options.label.showForZeroValues || this.initialValue
    },
    _drawMarker: function(renderer, group, animationEnabled) {
        var that = this,
            style = that._getStyle(),
            x = that.x,
            y = that.y,
            width = that.width,
            height = that.height,
            r = that._options.cornerRadius;
        if (animationEnabled) {
            if (that._options.rotated) {
                width = 0;
                x = that.defaultX
            } else {
                height = 0;
                y = that.defaultY
            }
        }
        that.graphic = renderer.rect(x, y, width, height).attr({
            rx: r,
            ry: r
        }).smartAttr(style).data({
            "chart-data-point": that
        }).append(group)
    },
    _getSettingsForTracker: function() {
        var that = this,
            y = that.y,
            height = that.height,
            x = that.x,
            width = that.width;
        if (that._options.rotated) {
            if (1 === width) {
                width = DEFAULT_BAR_TRACKER_SIZE;
                x -= CORRECTING_BAR_TRACKER_VALUE
            }
        } else {
            if (1 === height) {
                height = DEFAULT_BAR_TRACKER_SIZE;
                y -= CORRECTING_BAR_TRACKER_VALUE
            }
        }
        return {
            x: x,
            y: y,
            width: width,
            height: height
        }
    },
    getGraphicSettings: function() {
        var graphic = this.graphic;
        return {
            x: graphic.attr("x"),
            y: graphic.attr("y"),
            height: graphic.attr("height"),
            width: graphic.attr("width")
        }
    },
    _getEdgeTooltipParams: function(x, y, width, height) {
        var xCoord, yCoord, isPositive = this.value >= 0,
            invertedBusinessRange = this._getValTranslator().getBusinessRange().invert;
        if (this._options.rotated) {
            yCoord = y + height / 2;
            if (invertedBusinessRange) {
                xCoord = isPositive ? x : x + width
            } else {
                xCoord = isPositive ? x + width : x
            }
        } else {
            xCoord = x + width / 2;
            if (invertedBusinessRange) {
                yCoord = isPositive ? y + height : y
            } else {
                yCoord = isPositive ? y : y + height
            }
        }
        return {
            x: xCoord,
            y: yCoord,
            offset: 0
        }
    },
    getTooltipParams: function(location) {
        var x = this.x,
            y = this.y,
            width = this.width,
            height = this.height;
        return "edge" === location ? this._getEdgeTooltipParams(x, y, width, height) : {
            x: x + width / 2,
            y: y + height / 2,
            offset: 0
        }
    },
    _truncateCoord: function(coord, minBounce, maxBounce) {
        if (coord < minBounce) {
            return minBounce
        }
        if (coord > maxBounce) {
            return maxBounce
        }
        return coord
    },
    _translateErrorBars: function(argVisibleArea) {
        symbolPoint._translateErrorBars.call(this);
        if (this._errorBarPos < argVisibleArea.min || this._errorBarPos > argVisibleArea.max) {
            this._errorBarPos = void 0
        }
    },
    _translate: function() {
        var arg, minArg, val, minVal, that = this,
            rotated = that._options.rotated,
            valAxis = rotated ? "x" : "y",
            argAxis = rotated ? "y" : "x",
            valIntervalName = rotated ? "width" : "height",
            argIntervalName = rotated ? "height" : "width",
            argTranslator = that._getArgTranslator(),
            valTranslator = that._getValTranslator(),
            argVisibleArea = argTranslator.getCanvasVisibleArea(),
            valVisibleArea = valTranslator.getCanvasVisibleArea();
        arg = minArg = argTranslator.translate(that.argument) + (that[argAxis + "Correction"] || 0);
        val = valTranslator.translate(that.value);
        minVal = valTranslator.translate(that.minValue);
        if (null === val) {
            val = minVal
        }
        that["v" + valAxis] = val;
        that["v" + argAxis] = arg + that[argIntervalName] / 2;
        that[valIntervalName] = _abs(val - minVal);
        that._calculateVisibility(rotated ? _min(val, minVal) : _min(arg, minArg), rotated ? _min(arg, minArg) : _min(val, minVal), that.width, that.height);
        val = that._truncateCoord(val, valVisibleArea.min, valVisibleArea.max);
        minVal = that._truncateCoord(minVal, valVisibleArea.min, valVisibleArea.max);
        that[argAxis] = arg;
        that["min" + argAxis.toUpperCase()] = minArg;
        that[valIntervalName] = _abs(val - minVal);
        that[valAxis] = _min(val, minVal) + (that[valAxis + "Correction"] || 0);
        that["min" + valAxis.toUpperCase()] = minVal + (that[valAxis + "Correction"] || 0);
        that["default" + valAxis.toUpperCase()] = valTranslator.translate(CANVAS_POSITION_DEFAULT);
        that._translateErrorBars(argVisibleArea);
        if (that.inVisibleArea) {
            if (that[argAxis] < argVisibleArea.min) {
                that[argIntervalName] = that[argIntervalName] - (argVisibleArea.min - that[argAxis]);
                that[argAxis] = argVisibleArea.min;
                that["min" + argAxis.toUpperCase()] = argVisibleArea.min
            }
            if (that[argAxis] + that[argIntervalName] > argVisibleArea.max) {
                that[argIntervalName] = argVisibleArea.max - that[argAxis]
            }
        }
    },
    _updateMarker: function(animationEnabled, style) {
        this.graphic.smartAttr(_extend({}, style, !animationEnabled ? this.getMarkerCoords() : {}))
    },
    getMarkerCoords: function() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    },
    coordsIn: function(x, y) {
        var that = this;
        return x >= that.x && x <= that.x + that.width && y >= that.y && y <= that.y + that.height
    }
});
