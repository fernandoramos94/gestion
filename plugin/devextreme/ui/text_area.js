/**
 * DevExtreme (ui/text_area.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    noop = require("../core/utils/common").noop,
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    TextBox = require("./text_box");
var TEXTAREA_CLASS = "dx-textarea",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
var TextArea = TextBox.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            spellcheck: true,
            minHeight: void 0,
            maxHeight: void 0,
            autoResizeEnabled: false
        })
    },
    _render: function() {
        this.callBase();
        this.element().addClass(TEXTAREA_CLASS);
        this.setAria("multiline", "true");
        this._updateInputHeight()
    },
    _renderInput: function() {
        this.callBase();
        this._renderScrollHandler()
    },
    _createInput: function() {
        var $input = $("<textarea>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        return $input
    },
    _applyInputAttributes: function($input, customAttributes) {
        $input.attr(customAttributes).addClass(TEXTEDITOR_INPUT_CLASS)
    },
    _renderScrollHandler: function() {
        var $input = this._input(),
            eventY = 0;
        $input.on(eventUtils.addNamespace(pointerEvents.down, this.NAME), function(e) {
            eventY = eventUtils.eventData(e).y
        });
        $input.on(eventUtils.addNamespace(pointerEvents.move, this.NAME), function(e) {
            var scrollTopPos = $input.scrollTop(),
                scrollBottomPos = $input.prop("scrollHeight") - $input.prop("clientHeight") - scrollTopPos;
            if (0 === scrollTopPos && 0 === scrollBottomPos) {
                return
            }
            var currentEventY = eventUtils.eventData(e).y;
            var isScrollFromTop = 0 === scrollTopPos && eventY >= currentEventY,
                isScrollFromBottom = 0 === scrollBottomPos && eventY <= currentEventY,
                isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;
            if (isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
                e.isScrollingEvent = true;
                e.stopPropagation()
            }
            eventY = currentEventY
        })
    },
    _renderDimensions: function() {
        var width = this.option("width"),
            height = this.option("height"),
            minHeight = this.option("minHeight"),
            maxHeight = this.option("maxHeight"),
            $element = this.element();
        $element.css({
            "min-height": void 0 !== minHeight ? minHeight : "",
            "max-height": void 0 !== maxHeight ? maxHeight : ""
        });
        $element.outerWidth(width);
        $element.outerHeight(height)
    },
    _resetDimensions: function() {
        this.element().css({
            height: "",
            "min-height": "",
            "max-height": ""
        })
    },
    _renderEvents: function() {
        if (this.option("autoResizeEnabled")) {
            this._input().on(eventUtils.addNamespace("input paste", this.NAME), this._updateInputHeight.bind(this))
        }
        this.callBase()
    },
    _refreshEvents: function() {
        this._input().off(eventUtils.addNamespace("input paste", this.NAME));
        this.callBase()
    },
    _updateInputHeight: function() {
        var $input = this._input();
        if (!this.option("autoResizeEnabled") || void 0 !== this.option("height")) {
            $input.css("height", "");
            return
        }
        this._resetDimensions();
        $input.css("height", 0);
        var heightDifference = this._$element.outerHeight() - $input.outerHeight();
        this._renderDimensions();
        var minHeight = this.option("minHeight"),
            maxHeight = this.option("maxHeight"),
            inputHeight = $input[0].scrollHeight;
        if (void 0 !== minHeight) {
            inputHeight = Math.max(inputHeight, minHeight - heightDifference)
        }
        if (void 0 !== maxHeight) {
            inputHeight = Math.min(inputHeight, maxHeight - heightDifference)
        }
        $input.css("height", inputHeight)
    },
    _renderInputType: noop,
    _visibilityChanged: function(visible) {
        if (visible) {
            this._updateInputHeight()
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "autoResizeEnabled":
                this._refreshEvents();
                this._updateInputHeight();
                break;
            case "value":
            case "height":
                this.callBase(args);
                this._updateInputHeight();
                break;
            case "minHeight":
            case "maxHeight":
                this._renderDimensions();
                this._updateInputHeight();
                break;
            case "visible":
                this.callBase(args);
                args.value && this._updateInputHeight();
                break;
            default:
                this.callBase(args)
        }
    }
});
registerComponent("dxTextArea", TextArea);
module.exports = TextArea;
module.exports.default = module.exports;
