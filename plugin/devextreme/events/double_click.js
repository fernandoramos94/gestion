/**
 * DevExtreme (events/double_click.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    domUtils = require("../core/utils/dom"),
    Class = require("../core/class"),
    registerEvent = require("./core/event_registrator"),
    clickEvent = require("./click"),
    eventUtils = require("./utils");
var DBLCLICK_EVENT_NAME = "dxdblclick",
    DBLCLICK_NAMESPACE = "dxDblClick",
    NAMESPACED_CLICK_EVENT = eventUtils.addNamespace(clickEvent.name, DBLCLICK_NAMESPACE),
    DBLCLICK_TIMEOUT = 300;
var DblClick = Class.inherit({
    ctor: function() {
        this._handlerCount = 0;
        this._forgetLastClick()
    },
    _forgetLastClick: function() {
        this._firstClickTarget = null;
        this._lastClickTimeStamp = -DBLCLICK_TIMEOUT
    },
    add: function() {
        if (this._handlerCount <= 0) {
            $(document).on(NAMESPACED_CLICK_EVENT, this._clickHandler.bind(this))
        }
        this._handlerCount++
    },
    _clickHandler: function(e) {
        var timeStamp = e.timeStamp || $.now();
        if (timeStamp - this._lastClickTimeStamp < DBLCLICK_TIMEOUT) {
            eventUtils.fireEvent({
                type: DBLCLICK_EVENT_NAME,
                target: domUtils.closestCommonParent(this._firstClickTarget, e.target),
                originalEvent: e
            });
            this._forgetLastClick()
        } else {
            this._firstClickTarget = e.target;
            this._lastClickTimeStamp = timeStamp
        }
    },
    remove: function() {
        this._handlerCount--;
        if (this._handlerCount <= 0) {
            this._forgetLastClick();
            $(document).off(NAMESPACED_CLICK_EVENT)
        }
    }
});
registerEvent(DBLCLICK_EVENT_NAME, new DblClick);
exports.name = DBLCLICK_EVENT_NAME;
