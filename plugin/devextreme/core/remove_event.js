/**
 * DevExtreme (core/remove_event.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    jQuery = require("jquery"),
    cleanData = jQuery.cleanData,
    specialEvents = $.event.special;
var eventName = "dxremove",
    eventPropName = "dxRemoveEvent";
jQuery.cleanData = function(elements) {
    elements = [].slice.call(elements);
    for (var i = 0; i < elements.length; i++) {
        var $element = $(elements[i]);
        if ($element.prop(eventPropName)) {
            $element.removeProp(eventPropName);
            $element.triggerHandler(eventName)
        }
    }
    return cleanData(elements)
};
specialEvents[eventName] = {
    noBubble: true,
    setup: function() {
        $(this).prop(eventPropName, true)
    }
};
module.exports = eventName;
