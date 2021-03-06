/**
 * DevExtreme (events/core/wheel.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    registerEvent = require("./event_registrator"),
    eventUtils = require("../utils");
var EVENT_NAME = "dxmousewheel",
    EVENT_NAMESPACE = "dxWheel";
var wheelEvent = void 0 !== document.onwheel ? "wheel" : "mousewheel";
var wheel = {
    setup: function(element) {
        var $element = $(element);
        $element.on(eventUtils.addNamespace(wheelEvent, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel))
    },
    teardown: function(element) {
        var $element = $(element);
        $element.off("." + EVENT_NAMESPACE)
    },
    _wheelHandler: function(e) {
        var delta = this._getWheelDelta(e.originalEvent);
        eventUtils.fireEvent({
            type: EVENT_NAME,
            originalEvent: e,
            delta: delta,
            pointerType: "mouse"
        });
        e.stopPropagation()
    },
    _getWheelDelta: function(event) {
        return event.wheelDelta ? event.wheelDelta : 30 * -event.deltaY
    }
};
registerEvent(EVENT_NAME, wheel);
exports.name = EVENT_NAME;
