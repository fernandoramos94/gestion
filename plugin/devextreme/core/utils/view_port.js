/**
 * DevExtreme (core/utils/view_port.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    ready = require("./dom").ready,
    changeCallback = $.Callbacks(),
    $originalViewPort = $();
var value = function() {
    var $current;
    return function(element) {
        if (!arguments.length) {
            return $current
        }
        var $element = $(element);
        $originalViewPort = $element;
        var isNewViewportFound = !!$element.length;
        var prevViewPort = value();
        $current = isNewViewportFound ? $element : $("body");
        changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort)
    }
}();
ready(function() {
    value(".dx-viewport")
});
exports.value = value;
exports.changeCallback = changeCallback;
exports.originalViewPort = function() {
    return $originalViewPort
};
