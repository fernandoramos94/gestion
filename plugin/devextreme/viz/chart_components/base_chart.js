/**
 * DevExtreme (viz/chart_components/base_chart.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    eventUtils = require("../../events/utils"),
    BaseWidget = require("../core/base_widget"),
    legendModule = require("../components/legend"),
    dataValidatorModule = require("../components/data_validator"),
    seriesModule = require("../series/base_series"),
    chartThemeManagerModule = require("../components/chart_theme_manager"),
    LayoutManagerModule = require("./layout_manager"),
    trackerModule = require("./tracker"),
    headerBlockModule = require("./header_block"),
    REINIT_REFRESH_ACTION = "_reinit",
    REINIT_DATA_SOURCE_REFRESH_ACTION = "_updateDataSource",
    DATA_INIT_REFRESH_ACTION = "_dataInit",
    FORCE_RENDER_REFRESH_ACTION = "_forceRender",
    RESIZE_REFRESH_ACTION = "_resize",
    ACTIONS_BY_PRIORITY = [REINIT_REFRESH_ACTION, REINIT_DATA_SOURCE_REFRESH_ACTION, DATA_INIT_REFRESH_ACTION, FORCE_RENDER_REFRESH_ACTION, RESIZE_REFRESH_ACTION],
    vizUtils = require("../core/utils"),
    _noop = commonUtils.noop,
    _map = vizUtils.map,
    _each = $.each,
    _extend = extend,
    _isArray = Array.isArray,
    _isDefined = commonUtils.isDefined,
    _setCanvasValues = vizUtils.setCanvasValues,
    DEFAULT_OPACITY = .3,
    REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS = ["series", "commonSeriesSettings", "containerBackgroundColor", "dataPrepareSettings", "seriesSelectionMode", "pointSelectionMode", "useAggregation", "synchronizeMultiAxes"],
    REFRESH_SERIES_FAMILIES_ACTION_OPTIONS = ["equalBarWidth", "minBubbleSize", "maxBubbleSize", "barWidth", "negativesAsZeroes", "negativesAsZeros"],
    FORCE_RENDER_REFRESH_ACTION_OPTIONS = ["adaptiveLayout", "crosshair", "resolveLabelOverlapping", "adjustOnZoom", "zoomingMode", "scrollingMode"];

function checkHeightLabelsInCanvas(points, canvas, isRotated) {
    var labels, label, allLabelsAreInvisible, commonLabelSize = 0,
        canvasSize = canvas.end - canvas.start;
    for (var i = 0; i < points.length; i++) {
        labels = points[i].getLabels();
        allLabelsAreInvisible = true;
        for (var j = 0; j < labels.length; j++) {
            label = labels[j];
            if (label.isVisible()) {
                commonLabelSize += label.getBoundingRect()[isRotated ? "width" : "height"];
                allLabelsAreInvisible = false
            }
        }
        if (allLabelsAreInvisible) {
            points[i] = null
        }
    }
    if (canvasSize > 0) {
        while (commonLabelSize > canvasSize) {
            commonLabelSize -= killSmallValues(points, isRotated)
        }
    }
}

function killSmallValues(points, isRotated) {
    var indexOfPoint, smallestValuePoint = {
            originalValue: 1 / 0
        },
        bBox = 0;
    _each(points, function(index, point) {
        if (point && smallestValuePoint.originalValue >= point.originalValue) {
            smallestValuePoint = point;
            indexOfPoint = index
        }
    });
    if (null !== indexOfPoint) {
        points[indexOfPoint].getLabels().forEach(function(label) {
            bBox += label.getBoundingRect()[isRotated ? "width" : "height"];
            label.hide()
        });
        points[indexOfPoint] = null;
        return bBox
    }
    return 0
}

function resolveLabelOverlappingInOneDirection(points, canvas, isRotated, shiftFunction) {
    var rollingStocks = [],
        stubCanvas = {
            start: isRotated ? canvas.left : canvas.top,
            end: isRotated ? canvas.width - canvas.right : canvas.height - canvas.bottom
        },
        hasStackedSeries = false;
    checkHeightLabelsInCanvas(points, stubCanvas, isRotated);
    points.forEach(function(p) {
        if (!p) {
            return
        }
        hasStackedSeries = hasStackedSeries || p.series.isStackedSeries() || p.series.isFullStackedSeries();
        p.getLabels().forEach(function(l) {
            l.isVisible() && rollingStocks.push(new RollingStock(l, isRotated, shiftFunction))
        })
    });
    if (hasStackedSeries) {
        !isRotated && rollingStocks.reverse()
    } else {
        rollingStocks.sort(function(a, b) {
            return a.getInitialPosition() - b.getInitialPosition()
        })
    }
    if (!checkStackOverlap(rollingStocks)) {
        return
    }
    rollingStocks.reverse();
    moveRollingStock(rollingStocks, stubCanvas)
}

function overlapRollingStock(firstRolling, secondRolling) {
    if (!firstRolling || !secondRolling) {
        return
    }
    return firstRolling.getBoundingRect().end > secondRolling.getBoundingRect().start
}

function checkStackOverlap(rollingStocks) {
    var i, currentRollingStock, overlap, root;
    for (i = 0; i < rollingStocks.length - 1; i++) {
        currentRollingStock = root || rollingStocks[i];
        if (overlapRollingStock(currentRollingStock, rollingStocks[i + 1])) {
            currentRollingStock.toChain(rollingStocks[i + 1]);
            rollingStocks[i + 1] = null;
            root = currentRollingStock;
            overlap = true
        } else {
            root = null
        }
    }
    return overlap
}

function moveRollingStock(rollingStocks, canvas) {
    var i, j, currentRollingStock, nextRollingStock, currentBBox, nextBBox;
    for (i = 0; i < rollingStocks.length; i++) {
        currentRollingStock = rollingStocks[i];
        if (rollingStocksIsOut(currentRollingStock, canvas)) {
            currentBBox = currentRollingStock.getBoundingRect();
            for (j = i + 1; j < rollingStocks.length; j++) {
                nextRollingStock = rollingStocks[j];
                if (!nextRollingStock) {
                    continue
                }
                nextBBox = nextRollingStock.getBoundingRect();
                if (nextBBox.end > currentBBox.start - (currentBBox.end - canvas.end)) {
                    nextRollingStock.toChain(currentRollingStock);
                    rollingStocks[i] = currentRollingStock = null;
                    break
                }
            }
        }
        currentRollingStock && currentRollingStock.setRollingStockInCanvas(canvas)
    }
}

function rollingStocksIsOut(rollingStock, canvas) {
    return rollingStock && rollingStock.getBoundingRect().end > canvas.end
}

function RollingStock(label, isRotated, shiftFunction) {
    var bBox = label.getBoundingRect();
    this.labels = [label];
    this.shiftFunction = shiftFunction;
    this._bBox = {
        start: isRotated ? bBox.x : bBox.y,
        width: isRotated ? bBox.width : bBox.height,
        end: isRotated ? bBox.x + bBox.width : bBox.y + bBox.height
    };
    this._initialPosition = isRotated ? bBox.x : bBox.y;
    return this
}
RollingStock.prototype = {
    toChain: function(nextRollingStock) {
        var nextRollingStockBBox = nextRollingStock.getBoundingRect();
        nextRollingStock.shift(nextRollingStockBBox.start - this._bBox.end);
        this._changeBoxWidth(nextRollingStockBBox.width);
        this.labels = this.labels.concat(nextRollingStock.labels)
    },
    getBoundingRect: function() {
        return this._bBox
    },
    shift: function(shiftLength) {
        var shiftFunction = this.shiftFunction;
        _each(this.labels, function(index, label) {
            var bBox = label.getBoundingRect(),
                coords = shiftFunction(bBox, shiftLength);
            label.shift(coords.x, coords.y)
        });
        this._bBox.end -= shiftLength;
        this._bBox.start -= shiftLength
    },
    setRollingStockInCanvas: function(canvas) {
        if (this._bBox.end > canvas.end) {
            this.shift(this._bBox.end - canvas.end)
        }
    },
    getInitialPosition: function() {
        return this._initialPosition
    },
    _changeBoxWidth: function(width) {
        this._bBox.end += width;
        this._bBox.width += width
    }
};

function getLegendFields(name) {
    return {
        nameField: name + "Name",
        colorField: name + "Color",
        indexField: name + "Index"
    }
}

function getLegendSettings(legendDataField) {
    var formatObjectFields = getLegendFields(legendDataField);
    return {
        getFormatObject: function(data) {
            var res = {};
            res[formatObjectFields.indexField] = data.id;
            res[formatObjectFields.colorField] = data.states.normal.fill;
            res[formatObjectFields.nameField] = data.text;
            return res
        },
        textField: formatObjectFields.nameField
    }
}

function setTemplateFields(data, templateData, series) {
    _each(data, function(_, data) {
        _each(series.getTemplateFields(), function(_, field) {
            data[field.templateField] = data[field.originalField]
        });
        templateData.push(data)
    });
    series.updateTemplateFieldNames()
}

function checkOverlapping(firstRect, secondRect) {
    return (firstRect.x <= secondRect.x && secondRect.x <= firstRect.x + firstRect.width || firstRect.x >= secondRect.x && firstRect.x <= secondRect.x + secondRect.width) && (firstRect.y <= secondRect.y && secondRect.y <= firstRect.y + firstRect.height || firstRect.y >= secondRect.y && firstRect.y <= secondRect.y + secondRect.height)
}
var overlapping = {
    resolveLabelOverlappingInOneDirection: resolveLabelOverlappingInOneDirection
};

function suppressCommonLayout(layout) {
    layout.forward = function(rect) {
        return rect
    };
    layout.backward = _noop
}
var BaseChart = BaseWidget.inherit({
    _eventsMap: {
        onSeriesClick: {
            name: "seriesClick"
        },
        onPointClick: {
            name: "pointClick"
        },
        onArgumentAxisClick: {
            name: "argumentAxisClick"
        },
        onLegendClick: {
            name: "legendClick"
        },
        onSeriesSelectionChanged: {
            name: "seriesSelectionChanged"
        },
        onPointSelectionChanged: {
            name: "pointSelectionChanged"
        },
        onSeriesHoverChanged: {
            name: "seriesHoverChanged"
        },
        onPointHoverChanged: {
            name: "pointHoverChanged"
        },
        onDone: {
            name: "done"
        },
        onZoomStart: {
            name: "zoomStart"
        },
        onZoomEnd: {
            name: "zoomEnd"
        }
    },
    _rootClassPrefix: "dxc",
    _rootClass: "dxc-chart",
    _init: function() {
        this._savedBusinessRange = {};
        this.callBase.apply(this, arguments)
    },
    _initialChanges: ["REINIT"],
    _themeDependentChanges: ["REFRESH_SERIES_REINIT"],
    _createThemeManager: function() {
        var option = this.option(),
            themeManager = new chartThemeManagerModule.ThemeManager(option, this._chartType);
        themeManager.setTheme(option.theme, option.rtlEnabled);
        return themeManager
    },
    _initCore: function() {
        var that = this;
        suppressCommonLayout(that._layout);
        that._canvasClipRect = that._renderer.clipRect();
        that._createHtmlStructure();
        that._headerBlock = new headerBlockModule.HeaderBlock;
        that._createLegend();
        that._createTracker();
        that._needHandleRenderComplete = true;
        that.layoutManager = new LayoutManagerModule.LayoutManager;
        that._createScrollBar();
        that._$element.on("contextmenu", function(event) {
            if (eventUtils.isTouchEvent(event) || eventUtils.isPointerEvent(event)) {
                event.preventDefault()
            }
        }).on("MSHoldVisual", function(event) {
            event.preventDefault()
        })
    },
    _getLayoutItems: commonUtils.noop,
    _layoutManagerOptions: function() {
        return this._themeManager.getOptions("adaptiveLayout")
    },
    _reinit: function() {
        var that = this;
        _setCanvasValues(that._canvas);
        that._reinitAxes();
        that._skipRender = true;
        that._updateDataSource();
        if (!that.series) {
            that._dataSpecificInit(false)
        }
        that._skipRender = false;
        that._correctAxes();
        that._forceRender()
    },
    _correctAxes: _noop,
    _createHtmlStructure: function() {
        var that = this,
            renderer = that._renderer,
            root = renderer.root;
        that._backgroundRect = renderer.rect().attr({
            fill: "gray",
            opacity: 1e-4
        }).append(root);
        that._panesBackgroundGroup = renderer.g().attr({
            "class": "dxc-background"
        }).append(root);
        that._stripsGroup = renderer.g().attr({
            "class": "dxc-strips-group"
        }).linkOn(root, "strips");
        that._gridGroup = renderer.g().attr({
            "class": "dxc-grids-group"
        }).linkOn(root, "grids");
        that._axesGroup = renderer.g().attr({
            "class": "dxc-axes-group"
        }).linkOn(root, "axes");
        that._constantLinesGroup = renderer.g().attr({
            "class": "dxc-constant-lines-group"
        }).linkOn(root, "constant-lines");
        that._labelAxesGroup = renderer.g().attr({
            "class": "dxc-strips-labels-group"
        }).linkOn(root, "strips-labels");
        that._panesBorderGroup = renderer.g().attr({
            "class": "dxc-border"
        }).linkOn(root, "border");
        that._seriesGroup = renderer.g().attr({
            "class": "dxc-series-group"
        }).linkOn(root, "series");
        that._labelsGroup = renderer.g().attr({
            "class": "dxc-labels-group"
        }).linkOn(root, "labels");
        that._crosshairCursorGroup = renderer.g().attr({
            "class": "dxc-crosshair-cursor"
        }).linkOn(root, "crosshair");
        that._legendGroup = renderer.g().attr({
            "class": "dxc-legend",
            "clip-path": that._getCanvasClipRectID()
        }).linkOn(root, "legend");
        that._scrollBarGroup = renderer.g().attr({
            "class": "dxc-scroll-bar"
        }).linkOn(root, "scroll-bar")
    },
    _disposeObjectsInArray: function(propName, fieldNames) {
        _each(this[propName] || [], function(_, item) {
            if (fieldNames && item) {
                _each(fieldNames, function(_, field) {
                    item[field] && item[field].dispose()
                })
            } else {
                item && item.dispose()
            }
        });
        this[propName] = null
    },
    _disposeCore: function() {
        var that = this,
            disposeObject = function(propName) {
                if (that[propName]) {
                    that[propName].dispose();
                    that[propName] = null
                }
            },
            unlinkGroup = function(name) {
                that[name].linkOff()
            },
            disposeObjectsInArray = this._disposeObjectsInArray;
        that._renderer.stopAllAnimations();
        that.businessRanges = null;
        disposeObjectsInArray.call(that, "series");
        disposeObject("_headerBlock");
        disposeObject("_tracker");
        disposeObject("_crosshair");
        that.layoutManager = that._userOptions = that._canvas = that._groupsData = null;
        unlinkGroup("_stripsGroup");
        unlinkGroup("_gridGroup");
        unlinkGroup("_axesGroup");
        unlinkGroup("_constantLinesGroup");
        unlinkGroup("_labelAxesGroup");
        unlinkGroup("_panesBorderGroup");
        unlinkGroup("_seriesGroup");
        unlinkGroup("_labelsGroup");
        unlinkGroup("_crosshairCursorGroup");
        unlinkGroup("_legendGroup");
        unlinkGroup("_scrollBarGroup");
        disposeObject("_canvasClipRect");
        disposeObject("_panesBackgroundGroup");
        disposeObject("_backgroundRect");
        disposeObject("_stripsGroup");
        disposeObject("_gridGroup");
        disposeObject("_axesGroup");
        disposeObject("_constantLinesGroup");
        disposeObject("_labelAxesGroup");
        disposeObject("_panesBorderGroup");
        disposeObject("_seriesGroup");
        disposeObject("_labelsGroup");
        disposeObject("_crosshairCursorGroup");
        disposeObject("_legendGroup");
        disposeObject("_scrollBarGroup")
    },
    _getAnimationOptions: function() {
        return this._themeManager.getOptions("animation")
    },
    _getDefaultSize: function() {
        return {
            width: 400,
            height: 400
        }
    },
    _getOption: function(name) {
        return this._themeManager.getOptions(name)
    },
    _applySize: function() {
        this._processRefreshData(RESIZE_REFRESH_ACTION)
    },
    _resize: function() {
        this._doRender(this.__renderOptions || {
            animate: false,
            isResize: true
        })
    },
    _trackerType: "ChartTracker",
    _createTracker: function() {
        var that = this;
        that._tracker = new trackerModule[that._trackerType]({
            seriesGroup: that._seriesGroup,
            renderer: that._renderer,
            tooltip: that._tooltip,
            legend: that._legend,
            eventTrigger: that._eventTrigger
        })
    },
    _getTrackerSettings: function() {
        return this._getSelectionModes()
    },
    _getSelectionModes: function() {
        var themeManager = this._themeManager;
        return {
            seriesSelectionMode: themeManager.getOptions("seriesSelectionMode"),
            pointSelectionMode: themeManager.getOptions("pointSelectionMode")
        }
    },
    _updateTracker: function(trackerCanvases) {
        var that = this;
        that._tracker.update(that._getTrackerSettings());
        that._tracker.setCanvases({
            left: 0,
            right: that._canvas.width,
            top: 0,
            bottom: that._canvas.height
        }, trackerCanvases)
    },
    _doRender: function(_options) {
        var drawOptions, recreateCanvas, that = this;
        if ( /*!that._initialized || */ that._skipRender) {
            return
        }
        if (0 === that._canvas.width && 0 === that._canvas.height) {
            return
        }
        that._resetIsReady();
        drawOptions = that._prepareDrawOptions(_options);
        recreateCanvas = drawOptions.recreateCanvas;
        that.__originalCanvas = that._canvas;
        that._canvas = extend({}, that._canvas);
        if (recreateCanvas) {
            that.__currentCanvas = that._canvas
        } else {
            that._canvas = that.__currentCanvas
        }
        recreateCanvas && that._updateCanvasClipRect(that._canvas);
        that._renderer.stopAllAnimations(true);
        _setCanvasValues(that._canvas);
        that._cleanGroups();
        that._renderElements(drawOptions)
    },
    _renderElements: function(drawOptions) {
        var argBusinessRange, zoomMinArg, zoomMaxArg, that = this,
            preparedOptions = that._prepareToRender(drawOptions),
            isRotated = that._isRotated(),
            isLegendInside = that._isLegendInside(),
            trackerCanvases = [],
            layoutTargets = that._getLayoutTargets(),
            dirtyCanvas = extend({}, that._canvas),
            drawElements = [],
            layoutCanvas = drawOptions.drawTitle && drawOptions.drawLegend && drawOptions.adjustAxes;
        if (layoutCanvas) {
            drawElements = that._getDrawElements(drawOptions, isLegendInside)
        }
        that._renderer.lock();
        that.layoutManager.setOptions(that._layoutManagerOptions());
        that.layoutManager.layoutElements(drawElements, that._canvas, function(sizeShortage) {
            that._renderAxes(drawOptions, preparedOptions, isRotated);
            sizeShortage && that._shrinkAxes(drawOptions, sizeShortage)
        }, layoutTargets, isRotated);
        layoutCanvas && that._updateCanvasClipRect(dirtyCanvas);
        that._applyClipRects(preparedOptions);
        that._appendSeriesGroups();
        that._createCrosshairCursor();
        _each(layoutTargets, function() {
            var canvas = this.canvas;
            trackerCanvases.push({
                left: canvas.left,
                right: canvas.width - canvas.right,
                top: canvas.top,
                bottom: canvas.height - canvas.bottom
            })
        });
        if (that._scrollBar) {
            argBusinessRange = that._argumentAxes[0].getTranslator().getBusinessRange();
            if ("discrete" === argBusinessRange.axisType && argBusinessRange.categories && argBusinessRange.categories.length <= 1) {
                zoomMinArg = zoomMaxArg = void 0
            } else {
                zoomMinArg = argBusinessRange.minVisible;
                zoomMaxArg = argBusinessRange.maxVisible
            }
            that._scrollBar.init(argBusinessRange).setPosition(zoomMinArg, zoomMaxArg)
        }
        that._updateTracker(trackerCanvases);
        that._updateLegendPosition(drawOptions, isLegendInside);
        that._renderSeries(drawOptions, isRotated, isLegendInside);
        that._renderer.unlock()
    },
    _createCrosshairCursor: _noop,
    _appendSeriesGroups: function() {
        this._seriesGroup.linkAppend();
        this._labelsGroup.linkAppend();
        this._appendAdditionalSeriesGroups()
    },
    _renderSeries: function(drawOptions, isRotated, isLegendInside) {
        this._calculateSeriesLayout(drawOptions, isRotated);
        this._renderSeriesElements(drawOptions, isRotated, isLegendInside)
    },
    _calculateSeriesLayout: function(drawOptions, isRotated) {
        drawOptions.hideLayoutLabels = this.layoutManager.needMoreSpaceForPanesCanvas(this._getLayoutTargets(), isRotated) && !this._themeManager.getOptions("adaptiveLayout").keepLabels;
        this._updateSeriesDimensions(drawOptions);
        this._canvas = this.__originalCanvas
    },
    _renderSeriesElements: function(drawOptions, isRotated, isLegendInside) {
        var i, singleSeries, that = this,
            series = that.series,
            seriesLength = series.length,
            resolveLabelOverlapping = that._themeManager.getOptions("resolveLabelOverlapping");
        for (i = 0; i < seriesLength; i++) {
            singleSeries = series[i];
            that._applyExtraSettings(singleSeries, drawOptions);
            singleSeries.draw(drawOptions.animate && singleSeries.getPoints().length <= drawOptions.animationPointsLimit && that._renderer.animationEnabled(), drawOptions.hideLayoutLabels, that._getLegendCallBack(singleSeries))
        }
        "none" !== resolveLabelOverlapping && that._resolveLabelOverlapping(resolveLabelOverlapping);
        that._adjustSeries();
        that._renderTrackers(isLegendInside);
        that._tracker.repairTooltip();
        that._drawn();
        that._renderCompleteHandler()
    },
    _resolveLabelOverlapping: function(resolveLabelOverlapping) {
        var func;
        switch (resolveLabelOverlapping) {
            case "stack":
                func = this._resolveLabelOverlappingStack;
                break;
            case "hide":
                func = this._resolveLabelOverlappingHide;
                break;
            case "shift":
                func = this._resolveLabelOverlappingShift
        }
        commonUtils.isFunction(func) && func.call(this)
    },
    _getVisibleSeries: function() {
        return commonUtils.grep(this.getAllSeries(), function(series) {
            return series.isVisible()
        })
    },
    _resolveLabelOverlappingHide: function() {
        var currentLabel, nextLabel, currentLabelRect, nextLabelRect, i, j, points, labels = [],
            series = this._getVisibleSeries();
        for (i = 0; i < series.length; i++) {
            points = series[i].getVisiblePoints();
            for (j = 0; j < points.length; j++) {
                labels = labels.concat(points[j].getLabels())
            }
        }
        for (i = 0; i < labels.length; i++) {
            currentLabel = labels[i];
            currentLabelRect = currentLabel.getBoundingRect();
            if (!currentLabel.isVisible()) {
                continue
            }
            for (j = i + 1; j < labels.length; j++) {
                nextLabel = labels[j];
                nextLabelRect = nextLabel.getBoundingRect();
                if (checkOverlapping(currentLabelRect, nextLabelRect)) {
                    nextLabel.hide()
                }
            }
        }
    },
    _cleanGroups: function() {
        var that = this;
        that._stripsGroup.linkRemove().clear();
        that._gridGroup.linkRemove().clear();
        that._axesGroup.linkRemove().clear();
        that._constantLinesGroup.linkRemove().clear();
        that._labelAxesGroup.linkRemove().clear();
        that._labelsGroup.linkRemove().clear();
        that._crosshairCursorGroup.linkRemove().clear()
    },
    _createLegend: function() {
        var that = this,
            legendSettings = getLegendSettings(that._legendDataField);
        that._legend = new legendModule.Legend({
            renderer: that._renderer,
            group: that._legendGroup,
            backgroundClass: "dxc-border",
            itemGroupClass: "dxc-item",
            textField: legendSettings.textField,
            getFormatObject: legendSettings.getFormatObject
        })
    },
    _updateLegend: function() {
        var that = this,
            themeManager = that._themeManager,
            legendOptions = themeManager.getOptions("legend"),
            legendData = that._getLegendData();
        legendOptions.containerBackgroundColor = themeManager.getOptions("containerBackgroundColor");
        legendOptions._incidentOccurred = that._incidentOccurred;
        that._legend.update(legendData, legendOptions)
    },
    _prepareDrawOptions: function(drawOptions) {
        var options, animationOptions = this._getAnimationOptions();
        options = extend({}, {
            force: false,
            adjustAxes: true,
            drawLegend: true,
            drawTitle: true,
            animate: animationOptions.enabled,
            animationPointsLimit: animationOptions.maxPointCountSupported
        }, drawOptions, this.__renderOptions);
        if (!_isDefined(options.recreateCanvas)) {
            options.recreateCanvas = options.adjustAxes && options.drawLegend && options.drawTitle
        }
        return options
    },
    _processRefreshData: function(newRefreshAction) {
        var currentRefreshActionPosition = inArray(this._currentRefreshData, ACTIONS_BY_PRIORITY),
            newRefreshActionPosition = inArray(newRefreshAction, ACTIONS_BY_PRIORITY);
        if (!this._currentRefreshData || currentRefreshActionPosition >= 0 && newRefreshActionPosition < currentRefreshActionPosition) {
            this._currentRefreshData = newRefreshAction
        }
    },
    _getLegendData: function() {
        return _map(this._getLegendTargets(), function(item) {
            var legendData = item.legendData,
                style = item.getLegendStyles,
                opacity = style.normal.opacity;
            if (!item.visible) {
                if (!_isDefined(opacity) || opacity > DEFAULT_OPACITY) {
                    opacity = DEFAULT_OPACITY
                }
                legendData.textOpacity = DEFAULT_OPACITY
            }
            legendData.states = {
                hover: style.hover,
                selection: style.selection,
                normal: _extend({}, style.normal, {
                    opacity: opacity
                })
            };
            return legendData
        })
    },
    _getLegendOptions: function(item) {
        return {
            legendData: {
                text: item[this._legendItemTextField],
                argument: item.argument,
                id: item.index,
                argumentIndex: item.argumentIndex
            },
            getLegendStyles: item.getLegendStyles(),
            visible: item.isVisible()
        }
    },
    _disposeSeries: function() {
        var that = this;
        _each(that.series || [], function(_, series) {
            series.dispose()
        });
        that.series = null;
        _each(that.seriesFamilies || [], function(_, family) {
            family.dispose()
        });
        that.seriesFamilies = null;
        that._needHandleRenderComplete = true
    },
    _optionChanged: function(arg) {
        this._themeManager.resetOptions(arg.name);
        this.callBase.apply(this, arguments)
    },
    _applyChanges: function() {
        var that = this;
        that._themeManager.update(that._options);
        that.callBase.apply(that, arguments);
        that._doRefresh()
    },
    _optionChangesMap: {
        animation: "ANIMATION",
        dataSource: "DATA_SOURCE",
        palette: "PALETTE",
        legend: "DATA_INIT",
        seriesTemplate: "DATA_INIT",
        "export": "FORCE_RENDER",
        valueAxis: "AXES_AND_PANES",
        argumentAxis: "AXES_AND_PANES",
        commonAxisSettings: "AXES_AND_PANES",
        panes: "AXES_AND_PANES",
        defaultPane: "AXES_AND_PANES",
        rotated: "ROTATED",
        customizePoint: "REFRESH_SERIES_REINIT",
        customizeLabel: "REFRESH_SERIES_REINIT",
        scrollBar: "SCROLL_BAR"
    },
    _customChangesOrder: ["ANIMATION", "DATA_SOURCE", "PALETTE", "REFRESH_SERIES_DATA_INIT", "DATA_INIT", "REFRESH_SERIES_FAMILIES", "FORCE_RENDER", "AXES_AND_PANES", "ROTATED", "REFRESH_SERIES_REINIT", "SCROLL_BAR", "CHART_TOOLTIP", "REINIT"],
    _change_ANIMATION: function() {
        this._renderer.updateAnimationOptions(this._getAnimationOptions())
    },
    _change_DATA_SOURCE: function() {
        this._needHandleRenderComplete = true;
        this._processRefreshData(REINIT_DATA_SOURCE_REFRESH_ACTION)
    },
    _change_PALETTE: function() {
        this._themeManager.updatePalette(this.option("palette"));
        this._refreshSeries(DATA_INIT_REFRESH_ACTION)
    },
    _change_REFRESH_SERIES_DATA_INIT: function() {
        this._refreshSeries(DATA_INIT_REFRESH_ACTION)
    },
    _change_DATA_INIT: function() {
        this._processRefreshData(DATA_INIT_REFRESH_ACTION)
    },
    _change_REFRESH_SERIES_FAMILIES: function() {
        this._processSeriesFamilies();
        this._populateBusinessRange();
        this._processRefreshData(FORCE_RENDER_REFRESH_ACTION)
    },
    _change_FORCE_RENDER: function() {
        this._processRefreshData(FORCE_RENDER_REFRESH_ACTION)
    },
    _change_AXES_AND_PANES: function() {
        this._refreshSeries(REINIT_REFRESH_ACTION)
    },
    _change_ROTATED: function() {
        this._createScrollBar();
        this._refreshSeries(REINIT_REFRESH_ACTION)
    },
    _change_REFRESH_SERIES_REINIT: function() {
        this._refreshSeries(REINIT_REFRESH_ACTION)
    },
    _change_SCROLL_BAR: function() {
        this._createScrollBar();
        this._processRefreshData(FORCE_RENDER_REFRESH_ACTION)
    },
    _change_CHART_TOOLTIP: function() {
        this._organizeStackPoints()
    },
    _change_REINIT: function() {
        this._processRefreshData(REINIT_REFRESH_ACTION)
    },
    _refreshSeries: function(actionName) {
        this._disposeSeries();
        this._processRefreshData(actionName)
    },
    _doRefresh: function() {
        var methodName = this._currentRefreshData;
        if (methodName) {
            this._currentRefreshData = null;
            this._renderer.stopAllAnimations(true);
            this[methodName]()
        }
    },
    _updateCanvasClipRect: function(canvas) {
        var width, height, that = this;
        width = Math.max(canvas.width - canvas.left - canvas.right, 0);
        height = Math.max(canvas.height - canvas.top - canvas.bottom, 0);
        that._canvasClipRect.attr({
            x: canvas.left,
            y: canvas.top,
            width: width,
            height: height
        });
        that._backgroundRect.attr({
            x: canvas.left,
            y: canvas.top,
            width: width,
            height: height
        })
    },
    _getCanvasClipRectID: function() {
        return this._canvasClipRect.id
    },
    _dataSourceChangedHandler: function() {
        this._resetZoom();
        this._dataInit()
    },
    _dataInit: function() {
        this._dataSpecificInit(true)
    },
    _dataSpecificInit: function(needRedraw) {
        var that = this;
        that.series = that.series || that._populateSeries();
        that._repopulateSeries();
        that._seriesPopulatedHandlerCore();
        that._populateBusinessRange();
        that._tracker.updateSeries(that.series);
        that._updateLegend();
        needRedraw && that._forceRender()
    },
    _forceRender: function() {
        this._doRender({
            force: true
        })
    },
    _repopulateSeries: function() {
        var parsedData, that = this,
            themeManager = that._themeManager,
            data = that._dataSourceItems(),
            dataValidatorOptions = themeManager.getOptions("dataPrepareSettings"),
            seriesTemplate = themeManager.getOptions("seriesTemplate");
        if (seriesTemplate) {
            that._templatedSeries = vizUtils.processSeriesTemplate(seriesTemplate, data);
            that._populateSeries();
            delete that._templatedSeries;
            data = that.templateData || data
        }
        that._groupSeries();
        parsedData = dataValidatorModule.validateData(data, that._groupsData, that._incidentOccurred, dataValidatorOptions);
        themeManager.resetPalette();
        that.series.forEach(function(singleSeries) {
            singleSeries.updateData(parsedData[singleSeries.getArgumentField()]);
            that._processSingleSeries(singleSeries)
        });
        that._organizeStackPoints()
    },
    _organizeStackPoints: function() {
        var that = this,
            themeManager = that._themeManager,
            sharedTooltip = themeManager.getOptions("tooltip").shared,
            stackPoints = {};
        _each(that.series || [], function(_, singleSeries) {
            that._resetStackPoints(singleSeries);
            sharedTooltip && that._prepareStackPoints(singleSeries, stackPoints)
        })
    },
    _renderCompleteHandler: function() {
        var that = this,
            allSeriesInited = true;
        if (that._needHandleRenderComplete) {
            _each(that.series, function(_, s) {
                allSeriesInited = allSeriesInited && s.canRenderCompleteHandle()
            });
            if (allSeriesInited) {
                that._needHandleRenderComplete = false;
                that._eventTrigger("done", {
                    target: that
                })
            }
        }
    },
    _getDrawElements: function(drawOptions, legendHasInsidePosition) {
        var legendOptions, that = this,
            drawElements = [],
            exportOptions = that._themeManager.getOptions("export"),
            titleOptions = that._title.getLayoutOptions() || {},
            headerElements = [];
        if (that._exportMenu && exportOptions.enabled) {
            headerElements.push(that._exportMenu);
            drawElements.push(that._headerBlock)
        }
        if (drawOptions.drawTitle) {
            "bottom" !== titleOptions.verticalAlignment && headerElements.length ? headerElements.push(that._title) : drawElements.push(that._title)
        }
        if (drawOptions.drawLegend && that._legend) {
            that._legendGroup.linkAppend();
            if (!legendHasInsidePosition) {
                legendOptions = that._legend.getLayoutOptions();
                if (1 === headerElements.length && "bottom" !== legendOptions.verticalAlignment && "vertical" === legendOptions.cutSide) {
                    headerElements.push(that._legend)
                } else {
                    drawElements.push(that._legend)
                }
            }
        }
        if (headerElements.length) {
            that._headerBlock.update(headerElements, that._canvas)
        }
        return drawElements
    },
    _resetZoom: _noop,
    _dataIsReady: function() {
        return _isDefined(this.option("dataSource")) && this._dataIsLoaded()
    },
    _populateSeries: function() {
        var particularSeriesOptions, particularSeries, seriesTheme, data, i, eventPipe, that = this,
            themeManager = that._themeManager,
            hasSeriesTemplate = !!themeManager.getOptions("seriesTemplate"),
            seriesOptions = hasSeriesTemplate ? that._templatedSeries : that.option("series"),
            allSeriesOptions = _isArray(seriesOptions) ? seriesOptions : seriesOptions ? [seriesOptions] : [],
            extraOptions = that._getExtraOptions(),
            seriesVisibilityChanged = function() {
                that._specialProcessSeries();
                that._populateBusinessRange();
                that._renderer.stopAllAnimations(true);
                that._updateLegend();
                that._doRender({
                    force: true
                })
            };
        that._disposeSeries();
        that.series = [];
        that.templateData = [];
        themeManager.resetPalette();
        eventPipe = function(data) {
            that.series.forEach(function(currentSeries) {
                currentSeries.notify(data)
            })
        };
        for (i = 0; i < allSeriesOptions.length; i++) {
            particularSeriesOptions = _extend(true, {}, allSeriesOptions[i], extraOptions);
            if (!particularSeriesOptions.name) {
                particularSeriesOptions.name = "Series " + (i + 1).toString()
            }
            data = particularSeriesOptions.data;
            particularSeriesOptions.data = null;
            particularSeriesOptions.rotated = that._isRotated();
            particularSeriesOptions.customizePoint = themeManager.getOptions("customizePoint");
            particularSeriesOptions.customizeLabel = themeManager.getOptions("customizeLabel");
            particularSeriesOptions.visibilityChanged = seriesVisibilityChanged;
            particularSeriesOptions.incidentOccurred = that._incidentOccurred;
            seriesTheme = themeManager.getOptions("series", particularSeriesOptions);
            if (!that._checkPaneName(seriesTheme)) {
                continue
            }
            particularSeries = new seriesModule.Series({
                renderer: that._renderer,
                seriesGroup: that._seriesGroup,
                labelsGroup: that._labelsGroup,
                eventTrigger: that._eventTrigger,
                commonSeriesModes: that._getSelectionModes(),
                eventPipe: eventPipe,
                argumentAxis: that._getArgumentAxis(),
                valueAxis: that._getValueAxis(seriesTheme.pane, seriesTheme.axis)
            }, seriesTheme);
            if (!particularSeries.isUpdated) {
                that._incidentOccurred("E2101", [seriesTheme.type])
            } else {
                particularSeries.index = that.series.length;
                that._processSingleSeries(particularSeries);
                that.series.push(particularSeries);
                if (hasSeriesTemplate) {
                    setTemplateFields(data, that.templateData, particularSeries)
                }
            }
        }
        return that.series
    },
    getAllSeries: function() {
        return this.series.slice()
    },
    getSeriesByName: function(name) {
        var found = null;
        _each(this.series, function(i, singleSeries) {
            if (singleSeries.name === name) {
                found = singleSeries;
                return false
            }
        });
        return found
    },
    getSeriesByPos: function(pos) {
        return this.series[pos]
    },
    clearSelection: function() {
        this._tracker.clearSelection()
    },
    hideTooltip: function() {
        this._tracker._hideTooltip()
    },
    render: function(renderOptions) {
        var that = this;
        that.__renderOptions = renderOptions;
        that.__forceRender = renderOptions && renderOptions.force;
        that.callBase.apply(that, arguments);
        that.__renderOptions = that.__forceRender = null;
        return that
    }
});
REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS.forEach(function(name) {
    BaseChart.prototype._optionChangesMap[name] = "REFRESH_SERIES_DATA_INIT"
});
FORCE_RENDER_REFRESH_ACTION_OPTIONS.forEach(function(name) {
    BaseChart.prototype._optionChangesMap[name] = "FORCE_RENDER"
});
REFRESH_SERIES_FAMILIES_ACTION_OPTIONS.forEach(function(name) {
    BaseChart.prototype._optionChangesMap[name] = "REFRESH_SERIES_FAMILIES"
});
exports.overlapping = overlapping;
exports.BaseChart = BaseChart;
BaseChart.addPlugin(require("../core/export").plugin);
BaseChart.addPlugin(require("../core/title").plugin);
BaseChart.addPlugin(require("../core/tooltip").plugin);
BaseChart.addPlugin(require("../core/loading_indicator").plugin);
BaseChart.addPlugin(require("../core/data_source").plugin);
var _change_TITLE = BaseChart.prototype._change_TITLE;
BaseChart.prototype._change_TITLE = function() {
    _change_TITLE.apply(this, arguments);
    this._change(["FORCE_RENDER"])
};
var _change_TOOLTIP = BaseChart.prototype._change_TOOLTIP;
BaseChart.prototype._change_TOOLTIP = function() {
    _change_TOOLTIP.apply(this, arguments);
    this._change(["CHART_TOOLTIP"])
};